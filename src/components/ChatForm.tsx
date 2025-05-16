import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import chatbumini from "./../assets/chatbu-mini.webp";
import { useEffect, useRef, useState } from "react";
import {
  useChatMutation,
  useGetAppearanceQuery,
} from "@/redux/service/botServiceApi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentChat,
  selectCurrentChatId,
  selectCurrentUserBot,
  updateChatId,
  updateChatMessages,
} from "@/redux/features/botSlice";
import { v4 as uuidv4 } from "uuid";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { reportServiceApi } from "@/redux/service/reportsServiceApi";
import { EnterIcon, TrashIcon } from "./icons";
import { ChevronDownIcon } from "./HistoryTable";

export const BotMessage = ({
  msg,
  imgSrc,
  bg,
}: {
  msg: string;
  imgSrc: string;
  bg: string;
}) => {
  return (
    <div className="flex justify-start gap-2">
      <div className="">
        <div className="rounded-full bg-[#EEF6FF] w-[32px] h-[32px]">
          <img
            src={imgSrc}
            alt="chatbu-mini"
            className="w-[32px] h-[32px] rounded-full"
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: bg,
        }}
        className="p-2 max-w-fit min-w-min inline-flexflex text-pretty rounded-tl-md rounded-tr-md rounded-br-md
      relative inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-foreground"
      >
        <div
          dangerouslySetInnerHTML={{ __html: msg?.replace(/\n/g, "<br />") }}
        />
      </div>
    </div>
  );
};

export const UserMessage = ({ msg }: { msg: string }) => {
  return (
    <div className="flex justify-end gap-2 my-2">
      <div
        className="p-2 max-w-fit min-w-min inline-flexflex text-pretty rounded-tl-md rounded-tr-md rounded-bl-md bg-[#006EFF] text-white
      relative inline-flex items-center justify-between box-border whitespace-nowrap text-small"
      >
        {msg}
      </div>
      <div className="">
        <div className="rounded-full text-white w-[32px] h-[32px] flex items-center justify-center bg-[#006EFF]">
          HE
        </div>
      </div>
    </div>
  );
};

export const defaultChatMessages = [
  {
    datetime: "2021-10-10T10:10:10",
    sender: "bot",
    message: "Hi ✋",
  },
  {
    datetime: "2021-10-10T10:10:10",
    sender: "bot",
    message: " welcome to Chatbu How can help you today?",
  },
];

export default function ChatForm() {
  const [chat, { isLoading }] = useChatMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();
  const currentChatId = useSelector(selectCurrentChatId);
  const currentChat = useSelector(selectCurrentChat);
  const currentUser = useSelector(selectCurrentUser);
  const currentBot = useSelector(selectCurrentUserBot);

  console.log("currentBot", currentBot);

  const { data: apperance } = useGetAppearanceQuery(
    {
      botId: currentBot?.id,
    },
    { skip: !currentBot?.id }
  );

  useEffect(() => {
    if (!currentBot) return;

    const messages: { date: string; sender: string; message: string }[] = [];

    currentBot?.settings?.startChatMessages?.forEach((message: any) => {
      messages.push({
        date: new Date().toISOString(),
        sender: "bot",
        message: message,
      });
    });

    console.log("messages", messages);

    if (!currentChatId) {
      const chatId = uuidv4();
      dispatch(updateChatId(chatId));
      dispatch(updateChatMessages(messages));
    }
  }, [currentChatId, currentBot, dispatch]);

  useEffect(() => {
    console.log("apperance", apperance);
  }, [apperance]);

  const [show, setShow] = useState(false);

  const handleKeyPress = async (e: any) => {
    if (isLoading) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputMessage.trim() === "") return;
      await sendChat();
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      setInputMessage("");
    }
  };

  const sendChat = async () => {
    const updatedUserMessages = [
      ...currentChat,
      {
        date: new Date().toISOString(),
        sender: "user",
        message: inputMessage,
      },
    ];
    dispatch(updateChatMessages(updatedUserMessages));
    dispatch(reportServiceApi.util.invalidateTags(["Report"]));

    try {
      chat({
        date: new Date().toISOString(),
        sender: "user",
        message: inputMessage,
        botId: currentBot.id,
        chatId: currentChatId,
        userId: currentUser.userId,
      }).then((res) => {
        const updatedBotMessages = [
          ...currentChat,
          {
            sender: "bot",
            message: res?.data?.content,
            date: new Date().toISOString(),
          },
        ];
        dispatch(updateChatMessages(updatedBotMessages));
        dispatch(reportServiceApi.util.invalidateTags(["Report"]));
      });
    } catch (error) {
      console.log("Error sending chat message:", error);
      console.log(error);
    }
  };

  const handleClearChat = () => {
    dispatch(updateChatMessages([]));
    dispatch(updateChatId(null));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [currentChat]);

  const avatarUrl = apperance?.settings?.avatarUrl;
  const chatBackgroundColor =
    apperance?.settings?.chatBackgroundColor || "#ffffff";
  const chatbotChatMessageBackgroundColor =
    apperance?.settings?.chatbotChatMessageBackgroundColor || "#ffffff";
  const title = apperance?.settings?.title || "Chatbu";
  const titleBackgroundColor =
    apperance?.settings?.titleBackgroundColor || "#006EFF";
  const titleColor = apperance?.settings?.titleColor || "#ffffff";

  return (
    <div>
      {show ? (
        <div className="fixed right-0 bottom-0 transition-all duration-300 ease-in-out p-4 min-w-[320px]">
          <div className="max-w-96 shadow-2xl flex flex-grow flex-col rounded-xl border-[1px] border-[#dadada] ">
            <div
              style={{ backgroundColor: titleBackgroundColor }}
              className="flex justify-between items-center p-2 rounded-t-xl"
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#EEF6FF] rounded-full">
                  <img
                    src={avatarUrl || chatbumini}
                    alt="chatbu-mini"
                    className="w-[32px] h-[32px] rounded-full"
                  />
                </div>
                <div style={{ color: titleColor }} className="text-2xl">
                  {title}
                </div>
              </div>

              <div className="flex">
                <Button
                  isIconOnly
                  className="p-2"
                  onPress={handleClearChat}
                  style={{
                    backgroundColor: titleBackgroundColor,
                  }}
                >
                  <TrashIcon
                    iconColor={titleColor}
                    className="w-[32px] h-[32px]"
                  />
                </Button>

                <Button
                  isIconOnly
                  style={{
                    color: titleColor,
                    backgroundColor: titleBackgroundColor,
                  }}
                  className="p-2"
                  onPress={() => setShow(false)}
                >
                  <ChevronDownIcon className="w-[32px] h-[32px]" />
                </Button>
              </div>
            </div>
            <div
              style={{ backgroundColor: chatBackgroundColor }}
              className="flex-grow p-2 flex flex-col gap-2 overflow-y-auto max-h-[50vh]"
            >
              {Array.isArray(currentChat) &&
                currentChat.map((chatItem: any, index: number) => {
                  if (chatItem.sender === "bot") {
                    return (
                      <BotMessage
                        key={index}
                        msg={chatItem.message}
                        bg={chatbotChatMessageBackgroundColor}
                        imgSrc={avatarUrl || chatbumini}
                      />
                    );
                  } else {
                    return <UserMessage key={index} msg={chatItem.message} />;
                  }
                })}

              {isLoading && (
                <div className="flex justify-center items-center gap-2 text-primary-500  animate-pulse">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-primary-500"></span>
                  </span>
                  thinking...
                </div>
              )}
              <div ref={scrollRef} />
            </div>
            <div className="p-2 rounded-b-xl" onKeyPress={handleKeyPress}>
              <Input
                value={inputMessage}
                placeholder="Type a message"
                onValueChange={setInputMessage}
                endContent={<EnterIcon />}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[100px] flex items-center fixed right-0 bottom-0">
          <div
            className="bg-[#EEF6FF] mr-8 py-2 px-4 max-w-fit min-w-min rounded-full flex items-center justify-center text-blue-500 cursor-pointer shadow-md"
            onClick={() => {
              setShow(true);

              setTimeout(() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }
              }, 500);
            }}
          >
            <img
              src={chatbumini}
              alt="chatbu-mini"
              className="w-[32px] h-[32px]"
            />
            Try your chatbot
          </div>
        </div>
      )}
    </div>
  );
}
