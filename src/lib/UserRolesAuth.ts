import { IconType } from "@/icons/icons";

export enum UserTypes {
  ADMIN = "admin",
  USER = "user",
  REPORT = "report",
}

export const menu = [
  {
    name: "home",
    icon: IconType.Home,
    path: "/home",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "appearance",
    icon: null,
    path: "/appearance",
    role: [UserTypes.ADMIN, UserTypes.USER],
    hidden: true,
    sideMenu: false,
  },
  {
    name: "chatbots",
    icon: IconType.ChatBot,
    path: "/chatbots",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "companies",
    icon: IconType.Vault,
    path: "/companies",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "reports",
    icon: IconType.Reports,
    path: "/reports",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "integrations",
    icon: IconType.Integrations,
    path: "/integrations",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "help",
    icon: IconType.Help,
    path: "/help",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "support",
    icon: IconType.Support,
    path: "/support",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "settings",
    icon: IconType.Settings,
    path: "/settings",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: true,
  },
  {
    name: "chat-history-details",
    path: "/chat-history-detail/:id",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: false,
  },
  {
    name: "team-settings",
    path: "/team-settings",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: false,
  },
  {
    name: "invoices",
    path: "/invoices",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: false,
  },
  {
    name: "subscription",
    path: "/subscription",
    role: [UserTypes.ADMIN, UserTypes.USER],
    sideMenu: false,
  },
];
