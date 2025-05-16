import { BellIcon, FeedbackIcon } from "@/icons/icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

import { Badge } from "@heroui/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "@/redux/features/authSlice";
import { authServiceApi } from "@/redux/service/authServiceApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const username = user?.userName.split(" ");
    if (username.length >= 2) {
      const first = username[0].charAt(0).toUpperCase();
      const last = username[username.length - 1].charAt(0).toUpperCase();
      setUserAvatar(`${first}${last}`);
    } else {
      const first = username[0].charAt(0).toUpperCase();
      setUserAvatar(`${first}`);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(authServiceApi.util.resetApiState());
    dispatch(logOut());
  };

  return (
    <div className="flex justify-between items-center  bg-slate-50">
      <div className=""></div>
      <div className=" flex justify-end p-4 gap-4 items-center">
        <FeedbackIcon className="w-6 h-6 fill-gray-500 hover:fill-blue-500" />
        <Badge color="danger" content={5} shape="circle">
          <BellIcon className="fill-gray-500 hover:fill-blue-500" />
        </Badge>
        <LanguageSwitcher />

        <div className="flex items-center gap-4">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                name={userAvatar}
                className="transition-transform"
                color="primary"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2 mb-4">
                <p className="font-semibold">Welcome {user?.userName}</p>
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.userEmail || ""} </p>
              </DropdownItem>
              <DropdownItem
                key="settings"
                onPress={() => navigate("/settings")}
              >
                My Settings
              </DropdownItem>
              <DropdownItem
                key="team_settings"
                onPress={() => navigate("/team-settings")}
              >
                Team Settings
              </DropdownItem>
              <DropdownItem
                key="subscription"
                onPress={() => navigate("/subscription")}
              >
                Subscription
              </DropdownItem>
              <DropdownItem
                key="invoices"
                onPress={() => navigate("/invoices")}
              >
                Invoices
              </DropdownItem>
              <DropdownItem
                key="help_and_feedback"
                onPress={() => navigate("/help")}
              >
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
