import { getAvatar } from "@/lib/utils";
import RobotAvatar from "./RobotAvatar";

export default function ChatbotPreview({ appearance }: { appearance: any }) {
  return (
    <div
      className="rounded-xl shadow-lg p-4 flex flex-col h-[520px]"
      style={{ backgroundColor: appearance.chatBackgroundColor }}
    >
      {/* Title */}
      <div
        className="p-4 rounded-t-xl text-center font-bold"
        style={{
          backgroundColor: appearance.titleBackgroundColor,
          color: appearance.titleColor,
        }}
      >
        {appearance.title || "Chatbot Title"}
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Start Chat Messages dizisini sırala */}
        {Array.isArray(appearance.startChatMessages) &&
          appearance.startChatMessages.map((msg: string, idx: number) =>
            msg ? (
              <div key={idx} className="flex items-center gap-2 max-w-[80%]">
                {/* Avatar göster */}
                {appearance.avatarUrl && (
                  <RobotAvatar
                    src={getAvatar(Number(appearance.avatarUrl) || 0)}
                    alt="Chatbot Avatar"
                    className="w-10 h-10 rounded-full mt-1"
                    style={{
                      backgroundColor: appearance.chatBackgroundColor,
                    }}
                  />
                  // <img
                  //   src={appearance.avatarUrl}
                  //   alt="Chatbot Avatar"
                  //   className="w-10 h-10 rounded-full mt-1"
                  // />
                )}
                {/* Mesaj balonu */}
                <div
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor:
                      appearance.chatbotChatMessageBackgroundColor,
                    color: "#ffffff",
                  }}
                >
                  {msg}
                </div>
              </div>
            ) : null
          )}

        {/* Thinking Dots */}
        <div className="flex space-x-1 items-center">
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: appearance.chatbotThinkingDotColor }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce delay-100"
            style={{ backgroundColor: appearance.chatbotThinkingDotColor }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce delay-200"
            style={{ backgroundColor: appearance.chatbotThinkingDotColor }}
          />
        </div>

        {/* Örnek Kullanıcı Mesajı */}
        <div
          className="ml-auto max-w-[80%] px-4 py-2 rounded-lg text-sm text-white"
          style={{
            backgroundColor: appearance.userChatMessageBackgroundColor,
            color: appearance.userChatMessageTitleColor,
          }}
        >
          Hello!
        </div>
      </div>

      {/* Input / Footer */}
      <div className="p-2 flex items-center space-x-2">
        <input
          type="text"
          disabled
          className="flex-1 p-2 rounded border text-sm"
          placeholder="Type a message..."
        />
        <button
          className="px-3 py-2 rounded text-white text-sm"
          style={{ backgroundColor: appearance.sendMessageButtonColor }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
