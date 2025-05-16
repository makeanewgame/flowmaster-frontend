import {
  ChatBotIcon,
  CollapseIcon,
  HelpIcon,
  HomeIcon,
  IconType,
  IntegrationIcon,
  ReportIcon,
  SettingsIcon,
  SupportIcon,
  VaultIcon,
} from "@/icons/icons";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menu } from "@/lib/UserRolesAuth";

export default function SideBar() {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  // const userRoles = useSelector(selectCurrentUserRoles);
  // const userRoles = [UserTypes.USER];

  useEffect(() => {
    navigate("/" + activeMenu);
    // eslint-disable-next-line
  }, []);

  const handleNavigation = (path: any) => {
    navigate(path);
  };

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    setActiveMenu(currentPath);
  }, [location]);

  // const checkRoles = (roles: any) => {
  //   for (const userRole of userRoles) {
  //     for (const role of roles) {
  //       if (
  //         userRole ===
  //         Object.keys(UserTypes).find(
  //           (key) => UserTypes[key as keyof typeof UserTypes] === role
  //         )
  //       ) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // };

  const getIcons = (icon: any, className: any) => {
    switch (icon) {
      case IconType.Home:
        return <HomeIcon className={className} />;
      case IconType.ChatBot:
        return <ChatBotIcon className={className} />;
      case IconType.Vault:
        return <VaultIcon className={className} />;
      case IconType.Reports:
        return <ReportIcon className={className} />;
      case IconType.Integrations:
        return <IntegrationIcon className={className} />;
      case IconType.Settings:
        return <SettingsIcon className={className} />;
      case IconType.Help:
        return <HelpIcon className={className} />;
      case IconType.Support:
        return <SupportIcon className={className} />;
      default:
        return <ChatBotIcon className="" />;
    }
  };

  return (
    <div
      className={
        "flex flex-col bg-[#E3EBF7] p-4 animate-fade-right transition-all duration-300 ease-in-out " +
        (!toggle ? "w-[330px]" : "w-[75px]")
      }
    >
      <div className="flex justify-between items-center">
        {!toggle && (
          <>
            <Logo />
            <div className="w-full"></div>
          </>
        )}

        <button
          onClick={() => setToggle(!toggle)}
          className="mx-auto cursor-pointer"
        >
          <CollapseIcon />
        </button>
      </div>
      <div className="flex flex-col gap-2 basis-full mt-8">
        {menu
          .filter((item) => item.sideMenu !== false && !item.hidden)
          .map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(item.name)}
              className="group flex items-center gap-2 space-x-2 p-2 cursor-pointer rounded hover:text-white hover:bg-blue-600"
            >
              {getIcons(
                item.icon,
                activeMenu === item.name
                  ? "fill-primary"
                  : "fill-gray-400 group-hover:fill-white"
              )}
              {!toggle && (
                <div
                  className={
                    "group-hover:text-white " +
                    (activeMenu === item.name
                      ? "text-primary"
                      : "text-gray-500")
                  }
                >
                  {t(item.name)}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
