import LanguageSwitcher from "@/components/LanguageSwitcher";

import { setCreadentials } from "@/redux/features/authSlice";
import { useActivateEmailMutation } from "@/redux/service/authServiceApi";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const ActivateRegistration = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigation = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [ActivateEmail, { isLoading, isError, isSuccess }] =
    useActivateEmailMutation();

  // Timer işlemi
  useEffect(() => {
    if (timer > 0 && !success) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, success]);

  // Input'lar arasında gezinme fonksiyonu
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Sadece rakam girişine izin ver
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Sadece tek karakteri al
    setCode(newCode);
    setError("");

    // Otomatik sonraki input'a geç
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace tuşuna basıldığında önceki input'a geç
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Kodu doğrula
  const verifyCode = async () => {
    const fullCode = code.join("");

    // Kod eksik mi kontrol et
    if (fullCode.length !== 6) {
      setError("Lütfen 6 haneli kodu eksiksiz girin.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const email = searchParams.get("email");

      if (!email) {
        addToast({
          title: "Hata",
          description: "Eposta adresi bulunamadı.",
          color: "danger",
        });
        return;
      }

      ActivateEmail({ code: fullCode, email: email }).then((res) => {
        if (res.data.success) {
          dispatch(
            setCreadentials({
              user: {
                userId: res.data.userId,
                userEmail: res.data.userEmail,
                userName: res.data.userName,
              },
              token: {
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
              },
            })
          );
          setSuccess(true);
          navigation("/home");
        } else {
          setError(
            "Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      });
    } catch (err) {
      setError("Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      addToast({
        title: "Başarılı",
        description: "Hesabınız başarıyla doğrulandı.",
        color: "success",
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    addToast({
      title: "Error",
      description: "An error occured",
      color: "danger",
    });
  }, [isError]);

  // Kodu yeniden gönder

  const resendCode = () => {
    // Burada kodu yeniden gönderme API çağrısı yapılacak
    setTimer(60);
    setError("");
    setCode(["", "", "", "", "", ""]);

    // İlk input'a odaklan
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  };

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url('/images/login-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute right-0 top-0">
        <div className="flex w-full justify-end p-2">
          <LanguageSwitcher />
        </div>
      </div>
      <div className="container h-screen mx-auto flex justify-end items-center">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {!success ? (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Doğrulama Kodu
                </h2>
                <p className="mt-2 text-gray-600">
                  Eposta adresinize gönderilen 6 haneli doğrulama kodunu girin.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between space-x-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="h-14 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      maxLength={1}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={verifyCode}
                  className="w-full mt-6"
                  isDisabled={isVerifying || code.some((d) => d === "")}
                >
                  Doğrula
                </Button>

                {/* <button
                  onClick={verifyCode}
                  disabled={isVerifying || code.some((d) => d === "")}
                  className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Doğrulanıyor...
                    </span>
                  ) : (
                    "Doğrula"
                  )}
                </button> */}

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Kod almadınız mı?{" "}
                    {timer > 0 ? (
                      <span className="text-gray-500">
                        {timer} saniye sonra tekrar gönderebilirsiniz
                      </span>
                    ) : (
                      <button
                        onClick={resendCode}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Kodu tekrar gönder
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Doğrulama Başarılı!
              </h2>
              <p className="mt-2 text-gray-600">
                Hesabınız başarıyla doğrulandı. Yönlendiriliyorsunuz...
              </p>
              <button
                onClick={() => (window.location.href = "/dashboard")} // Gerçek uygulamada router kullanılabilir
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ana Sayfaya Git
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateRegistration;
