import { ArrowRightIcon } from "@/icons/icons";
import {
  selectCurrentUserBot,
  setBots,
  setCurrentBot,
  updateChatId,
  updateChatMessages,
} from "@/redux/features/botSlice";
import { useListBotsQuery } from "@/redux/service/botServiceApi";
import { fileServiceApi } from "@/redux/service/fileServiceApi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { defaultChatMessages } from "./ChatForm";
import { getAvatar } from "@/lib/utils";

export default function RobotAvatar() {
  const [botList, setBotList] = useState<any[]>([]);

  const dispatch = useDispatch();

  const currentBot = useSelector(selectCurrentUserBot);

  //const user = useSelector(selectCurrentUser);

  const { data } = useListBotsQuery(null);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      dispatch(setCurrentBot(data[0]));
      dispatch(setBots(data));
      setBotList(data as any);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(data)) {
      //Bot Listesi Boşsa
      if (data.length === 0) {
        dispatch(setBots([]));
        dispatch(setCurrentBot(null));
        setBotList([]);
      } else {
        dispatch(setBots(data));
        setBotList(data as any);
      }
    }
  }, [data as any[]]);

  useEffect(() => {
    if (botList.length > 0) {
      if (!currentBot) {
        dispatch(setCurrentBot(botList[0]));
      }

      if (currentBot && !botList.find((bot) => bot.id === currentBot.id)) {
        dispatch(setCurrentBot(botList[0]));
      }
    }
  }, [botList]);

  useEffect(() => {
    //currnetBot değiştiğinde apiye istek vault listesini güncelle
    if (currentBot) {
      dispatch(fileServiceApi.util.invalidateTags(["File"]));
      1;
    }
  }, [currentBot]);

  const handleUpdateCurrentBot = (bot: any) => {
    //yeni chat başlat...
    const chatId = uuidv4();
    dispatch(updateChatId(chatId));
    dispatch(updateChatMessages(defaultChatMessages));
    dispatch(setCurrentBot(bot));
  };

  const getAvatarLogo = () => {
    console.log("avatarUrl", currentBot.settings.avatarUrl);
    console.log("logoUrl", currentBot.settings.logoUrl);

    if (currentBot?.settings?.logoUrl !== "") {
      return currentBot?.settings?.logoUrl;
    } else {
      return getAvatar(Number(currentBot?.settings.avatarUrl) || 0);
    }
  };

  return (
    <div className="flex items-center justify-center py-1 px-2 hover:bg-slate-200 rounded cursor-pointer ml-4 ">
      {currentBot && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-2">
              <Avatar
                as="button"
                className="transition-transform"
                src={getAvatarLogo()}
              />
              <div className="text-sm text-gray-600">{currentBot.botName}</div>
              <ArrowRightIcon className="w-4 h-4 rotate-90 fill-gray-600" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="AI Bot Selections" variant="flat">
            {botList.length > 0 ? (
              botList.map((avatar: any) => (
                <DropdownItem
                  key={avatar.id}
                  textValue={avatar.botName}
                  onPress={() => handleUpdateCurrentBot(avatar)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      src={getAvatarLogo()}
                    />
                    {avatar.botName}
                  </div>
                </DropdownItem>
              ))
            ) : (
              <DropdownItem key="not-found">No bots available</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
