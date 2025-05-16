import { BotMessage, UserMessage } from "@/components/ChatForm";
import { useChatHistoryDetailsQuery } from "@/redux/service/reportsServiceApi";
import { Button } from "@heroui/button";
import { useNavigate, useParams } from "react-router-dom";

export default function ChatHistoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: chatHistoryListFromApi, isLoading } =
    useChatHistoryDetailsQuery(id);

  console.log("data", chatHistoryListFromApi);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start gap-4 p-4 h-full">
        <div className="flex flex-col grow gap-4 h-full">
          <div className="flex justify-start gap-2 items-center p-4 border-b-[1px] border-[#E3EBF7]">
            <Button isIconOnly onPress={() => navigate(-1)} variant="light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            <h1 className="text-[24px] text-gray-500 font-bold">
              Chat Details
            </h1>
          </div>
        </div>
      </div>
      <div className="p-4">
        {!isLoading &&
          chatHistoryListFromApi.CustomerChatDetails.map(
            (chat: any, index: number) => {
              if (chat.sender === "bot") {
                return (
                  <BotMessage
                    key={index}
                    msg={chat.message}
                    imgSrc={chat.imgSrc || ""}
                    bg={""}
                  />
                );
              } else {
                return <UserMessage key={index} msg={chat.message} />;
              }
            }
          )}
      </div>
    </div>
  );
}
