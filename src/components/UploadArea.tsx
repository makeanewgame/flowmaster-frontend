import { selectCurrentUser } from "@/redux/features/authSlice";
import { selectCurrentUserBot } from "@/redux/features/botSlice";
import {
  useIngestDocumentsMutation,
  useUploadFileMutation,
} from "@/redux/service/fileServiceApi";
import { reportServiceApi } from "@/redux/service/reportsServiceApi";
import { Chip } from "@heroui/react"; // Varsayılan olarak @mui/material kullandım, siz kendi bileşeninizi kullanabilirsiniz.
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Benzersiz ID üretmek için basit bir fonksiyon (veya uuid kütüphanesi kullanabilirsiniz)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Dosya durumu tipleri
// type FileStatus = "pending" | "uploading" | "success" | "error" | "removed";

// Kuyruk öğesi tipi
type QueueItem = {
  id: string;
  file: File;
  status:
    | "pending"
    | "uploading"
    | "retrying"
    | "success"
    | "error"
    | "removed";
  error?: string;
};

// Gecikme fonksiyonu (isteğe bağlı, hata sonrası bekleme vb. için)
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Add max file size constant
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export const UploadArea = ({ multiple = false }: { multiple?: boolean }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentBot = useSelector(selectCurrentUserBot);

  const [fileQueue, setFileQueue] = useState<QueueItem[]>([]);
  const [ingestFileTypes, setIngestFileTypes] = useState<Set<string>>(
    new Set()
  );
  const [isIngesting, setIsIngesting] = useState(false);

  const [uploadFileMutation, isSuccess] = useUploadFileMutation();
  const [
    ingestDocuments,
    { isSuccess: ingestSuccess, isError: ingestErrorData },
  ] = useIngestDocumentsMutation();

  const fileLabelRef = useRef<HTMLLabelElement>(null);
  const isProcessingQueue = useRef(false);

  const addFilesToQueue = (newFiles: File[]) => {
    const newQueueItems: QueueItem[] = newFiles.map((file) => {
      // File size validation
      if (file.size > MAX_FILE_SIZE) {
        return {
          id: generateId() + "_" + file.name,
          file,
          status: "error",
          error: "Dosya boyutu 20MB'den büyük.",
        };
      }
      return { id: generateId() + "_" + file.name, file, status: "pending" };
    });
    setFileQueue((prevQueue) => [...prevQueue, ...newQueueItems]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileLabelRef.current?.classList.remove("border-blue-500");
    fileLabelRef.current?.classList.add("border-gray-300");
    if (e.dataTransfer.files) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileLabelRef.current?.classList.remove("border-gray-300");
    fileLabelRef.current?.classList.add("border-blue-500");
  };

  const handleDragLeave = () => {
    fileLabelRef.current?.classList.add("border-gray-300");
    fileLabelRef.current?.classList.remove("border-blue-500");
  };

  // --- Dosya Yükleme İşlemi ---
  const uploadFileAndUpdateState = useCallback(
    async (item: QueueItem, retryCount = 0) => {
      const RETRY_LIMIT = 3;
      const RETRY_DELAY_MS = 3000; // 3 saniye bekle

      setFileQueue((prevQueue) =>
        prevQueue.map((q) =>
          q.id === item.id
            ? { ...q, status: retryCount > 0 ? "retrying" : "uploading" }
            : q
        )
      );

      const formData = new FormData();
      formData.append("file", item.file);
      if (!currentUser?.userId || !currentBot?.id) {
        console.error("Kullanıcı veya Bot bilgisi eksik!");
        setFileQueue((prevQueue) =>
          prevQueue.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "error",
                  error: "Kullanıcı veya Bot bilgisi eksik.",
                }
              : q
          )
        );
        return;
      }
      formData.append("botId", currentBot.id);

      try {
        await uploadFileMutation(formData).unwrap();

        setFileQueue((prevQueue) =>
          prevQueue.map((q) =>
            q.id === item.id ? { ...q, status: "success" } : q
          )
        );
        setIngestFileTypes((prevTypes) =>
          new Set(prevTypes).add(item.file.type || "unknown")
        );

        setTimeout(() => {
          setFileQueue((prevQueue) =>
            prevQueue.filter((q) => q.id !== item.id)
          );
        }, 2000);
      } catch (err: any) {
        const status = err?.status || err?.response?.status;

        if (status === 409 && retryCount < RETRY_LIMIT) {
          console.warn(
            `409 Too Many Requests for ${item.file.name}, retrying in ${RETRY_DELAY_MS}ms`
          );

          setTimeout(() => {
            uploadFileAndUpdateState(item, retryCount + 1); // Tekrar dene
          }, RETRY_DELAY_MS);
          return;
        }

        const errorMessage =
          err?.data?.message || err?.error || "Bilinmeyen bir hata oluştu.";
        setFileQueue((prevQueue) =>
          prevQueue.map((q) =>
            q.id === item.id
              ? { ...q, status: "error", error: errorMessage }
              : q
          )
        );
      }
    },
    [uploadFileMutation, currentUser, currentBot]
  );

  // --- Kuyruk İşleme Effect'i ---
  useEffect(() => {
    // Eğer zaten bir işlem varsa veya kuyruk boşsa işlem yapma
    if (isProcessingQueue.current || fileQueue.length === 0) {
      return;
    }

    // İşlenecek 'pending' durumunda dosyalar var mı?
    const pendingFiles = fileQueue.filter((item) => item.status === "pending");

    if (pendingFiles.length > 0) {
      isProcessingQueue.current = true; // İşlemi başlat

      // Aynı anda kaç dosya yükleneceğini belirle (örneğin 3)
      const concurrencyLimit = 3;
      const filesToProcess = pendingFiles.slice(0, concurrencyLimit);

      // Seçilen dosyaları yüklemek için promise'lar oluştur
      setTimeout(() => {
        const uploadPromises = filesToProcess.map((item) =>
          uploadFileAndUpdateState(item)
        );

        // Tüm yüklemelerin bitmesini bekle (başarılı veya hatalı)
        Promise.allSettled(uploadPromises).then(() => {
          isProcessingQueue.current = false; // İşlemi bitir
          // Kuyrukta hala 'pending' varsa bu effect tekrar tetiklenecek
        });
      }, 200);
    }
  }, [fileQueue, uploadFileAndUpdateState]); // fileQueue değiştiğinde kontrol et

  // --- Ingestion Tetikleme Effect'i ---
  useEffect(() => {
    // Kuyrukta hala işlenen (pending/uploading) dosya var mı kontrol et
    const isQueueProcessing = fileQueue.some(
      (item) => item.status === "pending" || item.status === "uploading"
    );

    // Tüm yüklemeler bitti mi, ingest edilecek tip var mı ve zaten ingest işlemi başlamadı mı?
    if (
      !isQueueProcessing &&
      ingestFileTypes.size > 0 &&
      !isIngesting &&
      fileQueue.length === 0
    ) {
      // fileQueue.length === 0 kontrolü, tüm başarılıların kaldırılmasını bekler
      setIsIngesting(true); // Ingest işlemini başlat
      console.log(
        "All uploads finished. Starting ingestion for types:",
        Array.from(ingestFileTypes)
      );

      const ingestPromises = Array.from(ingestFileTypes).map((type) => {
        // currentUser ve currentBot null/undefined kontrolü
        if (!currentUser?.userId || !currentBot?.id) {
          console.error("Cannot ingest: User or Bot info missing.");
          return Promise.reject("User or Bot info missing."); // Hata döndür
        }
        return ingestDocuments({
          botId: currentBot.id,
          type,
        }).unwrap(); // unwrap() ile promise'ı al
      });

      Promise.allSettled(ingestPromises)
        .then((results) => {
          results.forEach((result, index) => {
            const type = Array.from(ingestFileTypes)[index];
            if (result.status === "fulfilled") {
              console.log(`Ingestion successful for type: ${type}`);
            } else {
              console.error(
                `Ingestion failed for type: ${type}`,
                result.reason
              );
            }
          });
        })
        .finally(() => {
          setIsIngesting(false); // Ingest işlemini bitir
          setIngestFileTypes(new Set()); // Ingest listesini temizle
          // setFileQueue([]); // Hatalı kalanları da temizlemek isterseniz
          console.log("Ingestion process finished.");
        });
    }
  }, [
    fileQueue,
    ingestFileTypes,
    ingestDocuments,
    currentUser,
    currentBot,
    isIngesting,
  ]); // Bağımlılıkları güncelle

  // Ingestion sonuçlarını loglama (isteğe bağlı)
  useEffect(() => {
    if (ingestSuccess) {
      console.log(
        "Ingestion call reported success (might be for the last type)"
      );
    }
  }, [ingestSuccess]);

  useEffect(() => {
    if (ingestErrorData) {
      console.error("Ingestion call reported error:", ingestErrorData);
    }
  }, [ingestErrorData]);

  useEffect(() => {
    dispatch(reportServiceApi.util.invalidateTags(["Report"])); // Dosya güncellemeleri için
  }, [isSuccess]);

  return (
    <div className="flex items-center justify-center w-full flex-col">
      <label
        htmlFor="dropzone-file"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        ref={fileLabelRef}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ${
          isIngesting ? "opacity-50 pointer-events-none" : "" // Ingest sırasında alanı disable et
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 p-12">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-pretty text-center">
            Only txt, pdf, docx, doc,csv, xls, xlsx <br /> files are allowed.{" "}
            <br />
            Each file should be less then 20.00 MB
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          accept=".txt,.pdf,.docx,.doc,.csv,.xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          disabled={isIngesting} // Ingest sırasında input'u disable et
        />
      </label>

      {/* Dosya Kuyruğu */}
      <div className="w-full flex flex-col justify-start gap-1 mt-4">
        {fileQueue.map((item) => (
          <div key={item.id} className="mb-2 p-2 rounded border">
            <div className="flex justify-between items-center">
              <span>{item.file.name}</span>
              <span className="text-sm">
                <Chip
                  color={
                    item.status === "pending"
                      ? "primary"
                      : item.status === "uploading"
                        ? "warning"
                        : item.status === "retrying"
                          ? "warning"
                          : item.status === "success"
                            ? "success"
                            : "danger"
                  }
                  className={`${
                    item.status === "success" ? "animate-fadeOutAnim" : ""
                  }`}
                  style={{
                    animation:
                      item.status === "success"
                        ? "fadeOutAnim 2s forwards"
                        : "none",
                  }}
                >
                  {item.status === "removed" && "Kaldırıldı"}
                  {item.status === "pending" && "Beklemede"}
                  {item.status === "uploading" && "Yükleniyor..."}
                  {item.status === "retrying" && "Tekrar deneniyor..."}
                  {item.status === "success" && "Başarılı"}
                  {item.status === "error" && "Hata"}
                </Chip>
              </span>
            </div>

            {/* Loading bar */}
            {(item.status === "uploading" || item.status === "retrying") && (
              <div className="h-2 bg-gray-200 mt-1 rounded overflow-hidden">
                <div
                  className={`h-full ${
                    item.status === "retrying"
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-blue-500 animate-progress"
                  }`}
                  style={{ width: "100%" }}
                ></div>
              </div>
            )}

            {item.status === "error" && (
              <div className="text-red-500 text-xs mt-1">{item.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
