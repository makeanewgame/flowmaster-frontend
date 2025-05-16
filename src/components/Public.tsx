import { useNavigate } from "react-router";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";

const Public = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <div className="bg-white p-8 rounded-lg shadow-2xl gap-4 flex flex-col w-[330px]">
          <Logo />

          <Button
            color="primary"
            className="my-4 w-full"
            onClick={() => navigate("/login")}
          >
            {t("login")}
          </Button>

          <Button
            color="primary"
            className="my-4 w-full"
            onClick={() => navigate("/register")}
          >
            {t("register")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Public;
