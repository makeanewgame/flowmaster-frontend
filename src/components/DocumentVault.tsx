import FileTable from "@/components/FileTable";
import { UploadArea } from "@/components/UploadArea";
import { FileMimeType } from "@/lib/utils";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { selectCurrentUserBot } from "@/redux/features/botSlice";
import {
  fileServiceApi,
  useDeleteFileMutation,
  useGetCollectionQuery,
  useGetFilesQuery,
} from "@/redux/service/fileServiceApi";
import { reportServiceApi } from "@/redux/service/reportsServiceApi";
import { getSocket } from "@/redux/service/socketInstance";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DocumentVault() {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const currentBot = useSelector(selectCurrentUserBot);
  const [filesList, setFilesList] = useState<any[]>([]);

  const { data: fileListFromApi, isLoading } = useGetFilesQuery({
    userID: currentUser.userId,
    botId: currentBot?.id || "",
  });

  const { data: ingestDocumentFromApi, refetch: refetchIngestDocuments } =
    useGetCollectionQuery(
      {
        botId: currentBot?.id,
      },
      {
        skip: skip,
      }
    );

  const [DeleteFile, { isSuccess: deleteSuccess, isError: deleteError }] =
    useDeleteFileMutation();

  useEffect(() => {
    if (!fileListFromApi && !Array.isArray(fileListFromApi)) return;

    if (fileListFromApi.length > 0) {
      setSkip(false);
    } else {
      setSkip(true);
    }

    const temp = fileListFromApi.map((file: any) => {
      return {
        id: file.id,
        file: file.fileName,
        date: file.updatedAt,
        character: "----",
        type:
          typeof file.type === "string" && file.type in FileMimeType
            ? FileMimeType[file.type as keyof typeof FileMimeType]
            : "Unknown",
        retrain: "-",
        status: file.status,
      };
    });

    setFilesList(temp);
  }, [currentUser, fileListFromApi]);

  const staticticsMockup = [
    {
      title: "Indexed Documents",
      value: ingestDocumentFromApi?.document_count || 0,
      color: "bg-green-500",
    },
    {
      title: "Total Characters",
      value: "4.3K",
      color: "bg-purple-500",
    },
    {
      title: "Pending Documents",
      value: ingestDocumentFromApi?.pending_count || 0,
      color: "bg-blue-500",
    },
    {
      title: "Failed",
      value: 0,
      color: "bg-red-500",
    },
    {
      title: "No Space",
      value: 0,
      color: "bg-orange-500",
    },
  ];

  const handleDelete = (id: string) => {
    DeleteFile({ id });
  };

  useEffect(() => {
    if (deleteSuccess) {
      setSkip(false);
      dispatch(reportServiceApi.util.invalidateTags(["Report"]));
      refetchIngestDocuments();
    }
    if (deleteSuccess) {
      addToast({
        title: "Success",
        description: "File deleted successfully",
        color: "success",
      });
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (deleteError) {
      addToast({
        title: "Error",
        description: "Failed to delete file",
        color: "danger",
      });
    }
  }, [deleteError]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (msg: any) => {
      if (msg.type === "file") {
        dispatch(fileServiceApi.util.invalidateTags(["File"]));
        setSkip(false);
        refetchIngestDocuments();
      }
    };
    socket.on("message", handler);
    return () => {
      socket.off("message", handler);
    };
  }, []);

  return (
    <div className="flex grow gap-4 items-stretch h-98">
      <div className="grow basis-10/12">
        {isLoading && <div>Loading...</div>}
        {!isLoading && filesList.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No files found
          </div>
        )}
        {!isLoading && filesList.length > 0 && (
          <FileTable fileList={filesList} handleDelete={handleDelete} />
        )}
      </div>
      <div className="flex  basis-2/12 flex-col gap-4">
        <UploadArea multiple={true} />
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-white">
          {staticticsMockup.map((stat) => (
            <div
              key={stat.title}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                <span className="text-gray-500">{stat.title}</span>
              </div>
              <span className="text-gray-500">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
