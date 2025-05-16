import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../../../redux/features/authSlice";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

import ChatbotAppearanceSettings from "@/components/ChatbotAppearanceSettings";
import ChatbotPreview from "@/components/ChatbotPreview";
import {
  selectCurrentUserBot,
  setCurrentBot,
  updateChatId,
  updateChatMessages,
} from "@/redux/features/botSlice";
import {
  botServiceApi,
  useSaveAppearanceMutation,
} from "@/redux/service/botServiceApi";

type AppearanceSettings = {
  title: string;
  logoUrl: string;
  titleBackgroundColor: string;
  titleColor: string;
  chatBackgroundColor: string;
  userChatMessageBackgroundColor: string;
  userChatMessageTitleColor: string;
  chatbotChatMessageBackgroundColor: string;
  chatbotThinkingDotColor: string;
  sendMessageButtonColor: string;
  startChatMessages: string[];
  font?: string;
  avatarUrl?: string;
};

export default function Appearance() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentBot = useSelector(selectCurrentUserBot);
  const [saveAppearance, { isSuccess: saveSuccess, isError: saveError }] =
    useSaveAppearanceMutation();

  const defaultAppearance: AppearanceSettings = {
    title: "Chatbot Title",
    logoUrl: "",
    titleBackgroundColor: "#dadada",
    titleColor: "#000000",
    chatBackgroundColor: "#ffffff",
    userChatMessageBackgroundColor: "#e24bb2",
    userChatMessageTitleColor: "#ffffff",
    chatbotChatMessageBackgroundColor: "#2b00ff",
    chatbotThinkingDotColor: "#e2d54b",
    sendMessageButtonColor: "#ff0505",
    startChatMessages: ["Bir konuşma başlat"],
  };

  console.log("currentBot", currentBot.settings.title);

  const [appearance, setAppearance] = useState<AppearanceSettings>(
    currentBot?.settings
  );
  const [savedAppearance, setSavedAppearance] =
    useState<AppearanceSettings>(defaultAppearance);

  useEffect(() => {
    if (saveSuccess) {
      console.log("Başarılı");
      navigate("/chatbots");
      botServiceApi.util.invalidateTags(["Bot"]);
      setAppearance({
        ...defaultAppearance,
        ...appearance,
        startChatMessages: appearance.startChatMessages,
      });
      setSavedAppearance({
        ...defaultAppearance,
        ...appearance,
        startChatMessages: appearance.startChatMessages,
      });

      dispatch(
        setCurrentBot({
          ...currentBot,
          settings: {
            ...defaultAppearance,
            ...appearance,
            startChatMessages: appearance.startChatMessages,
          },
        })
      );

      dispatch(updateChatMessages([]));
      dispatch(updateChatId(null));
      addToast({
        title: "Başarılı",
        description: "Ayarlar kaydedildi.",
        color: "success",
      });
    }
    if (saveError) {
      console.log("Hata");
      addToast({
        title: "Hata",
        description: "Ayarlar kaydedilemedi.",
        color: "danger",
      });
    }
  }, [saveSuccess, saveError]);

  const resetAppearance = () => {
    setAppearance(defaultAppearance);
    addToast({
      title: "Sıfırlandı",
      description: "Görünüm varsayılana döndü.",
      color: "warning",
    });
  };

  const handleSaveChanges = async () => {
    console.log("savedAppearance", savedAppearance);

    saveAppearance({
      botId: id,
      settings: {
        ...appearance,
      },
    });
  };

  useEffect(() => {
    console.log("savedAppearance", savedAppearance);
  }, [savedAppearance]);

  return (
    <div className="flex justify-between items-start gap-4 p-4 h-full">
      <div className="flex flex-col grow gap-4 h-full">
        <div className="flex justify-between items-center p-4 border-b-[1px] border-[#E3EBF7]">
          <h1 className="text-[24px] text-gray-500 font-bold">
            Customize Your Chatbot
          </h1>
        </div>
        <div className="flex items-start gap-4 p-4 grow h-full">
          {/* Ayar formu */}
          <div
            className="overflow-y-auto flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ChatbotAppearanceSettings
              appearance={appearance}
              onChange={setAppearance}
            />
          </div>

          {/* Anlık önizleme */}
          <aside className="sticky top-4 w-2/5">
            <ChatbotPreview appearance={appearance} />
          </aside>
        </div>

        {/* Aksiyon butonları */}
        <div className="flex gap-4 p-4">
          <Button
            variant="flat"
            onPress={() => navigate("/chatbots")}
            color="primary"
          >
            Cancel
          </Button>
          <Button variant="bordered" onPress={resetAppearance}>
            Reset Appearance
          </Button>
          <Button variant="solid" color="primary" onPress={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
