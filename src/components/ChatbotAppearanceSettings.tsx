import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import AvatarPicker from "./AvatarPicker";

type Appearance = {
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

type Props = {
  appearance: Appearance;
  onChange: (appearance: Appearance) => void;
};

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border shadow"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

export default function ChatbotAppearanceSettings({
  appearance,
  onChange,
}: Props) {
  const [messages, setMessages] = useState<string[]>(
    appearance.startChatMessages?.length ? appearance.startChatMessages : [""]
  );
  const [errors, setErrors] = useState<string[]>(messages.map(() => ""));

  useEffect(() => {
    onChange({ ...appearance, startChatMessages: messages });
  }, [messages]);

  const onMessageChange = (idx: number, val: string) => {
    const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
    const newErrors = [...errors];
    if (wordCount > 5) {
      newErrors[idx] = "En fazla 5 kelime yazabilirsiniz.";
      setErrors(newErrors);
      return;
    }
    newErrors[idx] = "";
    setErrors(newErrors);

    const newMsgs = [...messages];
    newMsgs[idx] = val;
    setMessages(newMsgs);
  };

  const addMessage = () => {
    if (messages.length >= 5) return;
    setMessages([...messages, ""]);
    setErrors([...errors, ""]);
  };

  const removeMessage = (idx: number) => {
    const newMsgs = messages.filter((_, i) => i !== idx);
    const newErrors = errors.filter((_, i) => i !== idx);
    setMessages(newMsgs);
    setErrors(newErrors);
  };

  const updateAppearance = (
    key: keyof Omit<Appearance, "startChatMessages">,
    value: string
  ) => {
    onChange({ ...appearance, [key]: value } as Appearance);
  };

  const fonts = ["Poppins", "Roboto", "Inter", "Open Sans"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Title */}
      <div className="col-span-2">
        <Input
          label="Title"
          aria-label="Title"
          type="text"
          value={appearance.title}
          onChange={(e) => updateAppearance("title", e.target.value)}
        />
      </div>

      {/* Start Chat Messages */}
      <div className="col-span-2 space-y-2">
        <Label className="text-sm font-medium">Start Chat Messages</Label>

        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Input
              aria-label="Start Chat Message"
              type="text"
              className="flex-1"
              placeholder="En fazla 5 kelime"
              value={msg}
              onChange={(e) => onMessageChange(idx, e.target.value)}
            />
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => removeMessage(idx)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        {errors.map(
          (err, i) =>
            err && (
              <p key={i} className="text-red-500 text-xs ml-2">
                {err}
              </p>
            )
        )}
        <Button size="sm" disabled={messages.length >= 5} onPress={addMessage}>
          + Mesaj Ekle ({messages.length}/5)
        </Button>
      </div>

      {/* Renk ve diğer ayarlar */}
      <ColorInput
        label="Title Background Color"
        value={appearance.titleBackgroundColor}
        onChange={(val) => updateAppearance("titleBackgroundColor", val)}
      />
      <ColorInput
        label="Title Color"
        value={appearance.titleColor}
        onChange={(val) => updateAppearance("titleColor", val)}
      />
      <ColorInput
        label="Chat Window Background"
        value={appearance.chatBackgroundColor}
        onChange={(val) => updateAppearance("chatBackgroundColor", val)}
      />
      <ColorInput
        label="User Chat Message Background"
        value={appearance.userChatMessageBackgroundColor}
        onChange={(val) =>
          updateAppearance("userChatMessageBackgroundColor", val)
        }
      />
      <ColorInput
        label="Chatbot Chat Message Background"
        value={appearance.chatbotChatMessageBackgroundColor}
        onChange={(val) =>
          updateAppearance("chatbotChatMessageBackgroundColor", val)
        }
      />
      <ColorInput
        label="Thinking Dots Color"
        value={appearance.chatbotThinkingDotColor}
        onChange={(val) => updateAppearance("chatbotThinkingDotColor", val)}
      />
      <ColorInput
        label="Send Message Button Color"
        value={appearance.sendMessageButtonColor}
        onChange={(val) => updateAppearance("sendMessageButtonColor", val)}
      />

      {/* Font seçimi */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Font</Label>
        <Dropdown>
          <DropdownTrigger>
            <Button className="w-full justify-between bg-gray-100">
              {appearance.font || "Select Font"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Select Font"
            onAction={(key) => updateAppearance("font", key as string)}
          >
            {fonts.map((font) => (
              <DropdownItem key={font} value={font}>
                {font}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Avatar seçimi */}
      <AvatarPicker
        avatarUrl={appearance.avatarUrl || ""}
        onChange={(url) => updateAppearance("avatarUrl", url)}
      />

      {appearance.avatarUrl && (
        <div className="pt-4 col-span-2">
          <Label className="text-sm font-medium">Selected Avatar</Label>
          <div className="flex items-center gap-3">
            <img
              src={appearance.avatarUrl}
              alt="Selected Avatar"
              className="w-16 h-16 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
