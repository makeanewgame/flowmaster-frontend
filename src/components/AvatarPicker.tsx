import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Select, SelectItem, Avatar, Switch } from "@heroui/react";
import { getAvatar } from "@/lib/utils";

// const getAvatar = (index: number) => {
//   const avatarNumber = (index + 1).toString().padStart(2, "0");
//   return `/images/avatars/${avatarNumber}.webp`;
// };

const users = [
  { id: 1, name: "Tony Reichert", url: getAvatar(0) },
  { id: 2, name: "Zoey Lang", url: getAvatar(1) },
  { id: 3, name: "Mason Mcclain", url: getAvatar(2) },
  { id: 4, name: "Jovany Heller", url: getAvatar(3) },
  { id: 5, name: "Mason Mcclain", url: getAvatar(4) },
  { id: 6, name: "Jovany Heller", url: getAvatar(5) },
  { id: 7, name: "Zoey Lang", url: getAvatar(6) },
  { id: 8, name: "Tony Reichert", url: getAvatar(7) },
  { id: 9, name: "Zoey Lang", url: getAvatar(8) },
  { id: 10, name: "Tony Reichert", url: getAvatar(9) },
  { id: 11, name: "Zoey Lang", url: getAvatar(10) },
  { id: 12, name: "Tony Reichert", url: getAvatar(11) },
  { id: 13, name: "Zoey Lang", url: getAvatar(12) },
  { id: 14, name: "Tony Reichert", url: getAvatar(13) },
  { id: 15, name: "Zoey Lang", url: getAvatar(14) },
  { id: 16, name: "Tony Reichert", url: getAvatar(15) },
  { id: 17, name: "Zoey Lang", url: getAvatar(16) },
  { id: 18, name: "Tony Reichert", url: getAvatar(17) },
  { id: 19, name: "Zoey Lang", url: getAvatar(18) },
  { id: 20, name: "Tony Reichert", url: getAvatar(19) },
];

const predefinedAvatars = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: users[i]?.name || `User ${i + 1}`,
  url: getAvatar(i),
}));

export default function AvatarPicker({
  avatarUrl,
  onChange,
}: {
  avatarUrl: string;
  onChange: (url: string) => void;
}) {
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState<number | null>(
    predefinedAvatars.find((a) => a.url === avatarUrl)?.id ?? null
  );
  const [useCustomAvatar, setUseCustomAvatar] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Maksimum dosya boyutu 1MB olmalı.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString();
      if (base64) {
        onChange(base64);
        setSelectedKey(null); // Upload olursa Select sıfırlansın
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (avatarId: number) => {
    const avatar = predefinedAvatars.find((a) => a.id === avatarId);
    if (avatar) {
      onChange((avatar.id + 1).toString());
      setSelectedKey(avatar.id);
    }
  };

  return (
    <div className="space-y-2 col-span-2">
      <div className="space-y-2 col-span-2">
        <div className=" flex items-center justify-between mb-4 rounded-lg">
          <Label className="text-sm font-medium">Choose avatar</Label>

          <Switch
            isSelected={useCustomAvatar}
            onChange={(e) => {
              const checked = e.target.checked;
              setUseCustomAvatar(checked);
              if (checked) {
                setSelectedKey(null);
                onChange("");
              }
            }}
          >
            I want to upload my own avatar
          </Switch>
        </div>

        {useCustomAvatar ? (
          <div className="pt-2">
            <Label className="text-sm font-medium mb-1 block">
              Upload Your Own Avatar
            </Label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        ) : (
          <Select
            classNames={{ base: "max-w-xs", trigger: "h-12" }}
            items={predefinedAvatars}
            labelPlacement="outside"
            placeholder="Avatar seç"
            selectedKeys={
              selectedKey !== null ? [String(selectedKey)] : undefined
            }
            onSelectionChange={(keys) => {
              const selectedId = Number(Array.from(keys)[0]);
              handleAvatarChange(selectedId);
            }}
            renderValue={(items) => {
              return items.map((item) => {
                const avatar = predefinedAvatars.find(
                  (a) => String(a.id) === item.key
                );
                if (!avatar) return null;
                return (
                  <div key={avatar.id} className="flex items-center gap-2">
                    <Avatar
                      alt={avatar.name}
                      className="flex-shrink-0"
                      size="sm"
                      src={avatar.url}
                    />
                    <div className="flex flex-col">
                      <span>{avatar.name}</span>
                    </div>
                  </div>
                );
              });
            }}
          >
            {(avatar) => (
              <SelectItem key={String(avatar.id)} textValue={avatar.name}>
                <div className="flex flex-row space-x-4 items-center">
                  <Avatar
                    alt={avatar.name}
                    className="flex-shrink-0 mb-1"
                    size="sm"
                    src={avatar.url}
                  />
                  <span className="text-tiny text-default-500 text-center">
                    {avatar.name.split(" ")[0]}
                  </span>
                </div>
              </SelectItem>
            )}
          </Select>
        )}
      </div>
    </div>
  );
}
