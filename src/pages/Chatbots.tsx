import { selectCurrentUser } from "@/redux/features/authSlice";
import {
  useChangeStatusMutation,
  useCreateBotMutation,
  useDeleteMutation,
  useListBotsQuery,
  useRenameMutation,
} from "@/redux/service/botServiceApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Button } from "@heroui/button";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormikProvider, useFormik, Form } from "formik";
import * as Yup from "yup";
import { VerticalDotsIcon } from "@/components/Icons/VerticalDotsIcon";
import {
  quotaServiceApi,
  useQuotaListQuery,
} from "@/redux/service/quotaServiceApi";
import { reportServiceApi } from "@/redux/service/reportsServiceApi";
import { getAvatar, getRandomInt } from "@/lib/utils";
import { selectCurrentUserBot } from "@/redux/features/botSlice";

type Chatbot = {
  id: number;
  botName: string;
  active: boolean;
  botAvatar: string;
  systemPrompt: string;
};

export const chatbotsConfigs = [
  { key: "chatbot", label: "Chat Bot" },
  { key: "productionbot", label: "Production Bot" },
  { key: "custom", label: "Custom Bot Command" },
];

const ChatbotDefaultSettings = {
  font: "Poppins",
  title: "Chatbot",
  logoUrl: "",
  avatarUrl: `${getRandomInt(1, 20)}`,
  titleColor: "#000000",
  startChatMessages: ["Hi ✋", "welcome to Chatbu How can help you today?"],
  chatBackgroundColor: "#FFFFFF",
  titleBackgroundColor: "#FFFFFF",
  sendMessageButtonColor: "#000000",
  chatbotThinkingDotColor: "#000000",
  userChatMessageTitleColor: "#000000",
  userChatMessageBackgroundColor: "#FFFFFF",
  chatbotChatMessageBackgroundColor: "#FFFFFF",
};

export default function Chatbots() {
  const dispatch = useDispatch();
  const [botConfig, setBotConfig] = React.useState<Set<string>>(new Set([]));
  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null);
  const [quota, setQuota] = useState({
    limit: 0,
    usage: 0,
  });
  const currentUser = useSelector(selectCurrentUser);
  const currentBot = useSelector(selectCurrentUserBot);

  const [chatbots, setChatbots] = useState<any[]>([]);
  const { data, isSuccess } = useListBotsQuery(null);
  const { data: quotaList } = useQuotaListQuery(currentUser.userId);
  const [createBot] = useCreateBotMutation();
  const [deleteChatbot] = useDeleteMutation();
  const [renameBot] = useRenameMutation();
  const [changeStatus] = useChangeStatusMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const getRandomAvatar = () => {
    const avatarIndex = Math.floor(Math.random() * 20);
    return avatarIndex;
  };

  const validationSchema = Yup.object({
    botName: Yup.string()
      .min(3, "Bot name must be at least 3 characters")
      .max(20, "Bot name must be at most 20 characters")
      .matches(
        /^[a-zA-Z0-9 ]*$/,
        "Bot name can only contain letters and numbers"
      )
      .required("Bot name is required"),
  });

  const formik = useFormik({
    initialValues: {
      botName: "",
      systemPrompt: "",
      customCommand: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  const handleSendForm = async () => {
    const correctName = await formik.validateField("botName");
    if (correctName !== undefined) {
      formik.setFieldError("botName", correctName);
      return;
    }

    let systemPrompt = "";
    if (botConfig.has("chatbot")) {
      systemPrompt =
        "Sen bir eğitim sitesi yapay zeka asistanısın. Eğitimlerle ilgili sorulara vektör veri tabanından cevap verirsin.";
    } else if (botConfig.has("productionbot")) {
      systemPrompt =
        "Sen bir üretim sitesi yapay zeka asistanısın. Üretimle ilgili sorulara vektör veri tabanından cevap verirsin.";
    } else if (botConfig.has("custom")) {
      systemPrompt = formik.values.customCommand;
    }
    if (formik.values.systemPrompt === "") {
      formik.values.systemPrompt =
        "Sen bir eğitim sitesi yapay zeka asistanısın. Eğitimlerle ilgili sorulara vektör veri tabanından cevap verirsin.";
    }

    createBot({
      user: currentUser.userId,
      botName: formik.values.botName,
      botAvatar: getRandomAvatar(),
      settings: ChatbotDefaultSettings,
      systemPrompt: systemPrompt,
    }).then(() => {
      dispatch(quotaServiceApi.util.invalidateTags(["Quota"]));
      dispatch(reportServiceApi.util.invalidateTags(["Report"]));
    });
    onClose();
    formik.values.botName = "";
    formik.values.systemPrompt = "";
    formik.values.customCommand = "";
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendForm();
    }
  };

  const handleKeyDownEditForm = (e: any) => {
    if (e.key === "Enter") {
      handleSendEditForm();
    }
  };

  const handleSendEditForm = () => {
    renameBot({
      userId: currentUser.userId,
      botId: selectedBot?.id,
      name: formik.values.botName,
      systemPrompt: formik.values.systemPrompt,
    });
    onEditClose();
    formik.values.botName = "";
    formik.values.systemPrompt = "";
    setSelectedBot(null);
  };

  const handleOpen = () => {
    onOpen();
  };

  // Use useEffect to update state after render
  React.useEffect(() => {
    if (isSuccess && data) {
      setChatbots(data);
    }
  }, [isSuccess, data]);

  const handleDelete = (chatbot: Chatbot) => {
    deleteChatbot({
      userId: currentUser.userId,
      botId: chatbot.id,
    }).then(() => {
      dispatch(quotaServiceApi.util.invalidateTags(["Quota"]));
      dispatch(reportServiceApi.util.invalidateTags(["Report"]));
    });
  };

  const handleEdit = (chatbot: Chatbot) => {
    formik.values.botName = chatbot.botName;
    formik.values.systemPrompt = chatbot.systemPrompt;
    setSelectedBot(chatbot);
    onEditOpen();
  };

  const ToggleChatBot = (chatbot: Chatbot) => {
    changeStatus({
      userId: currentUser.userId,
      botId: chatbot.id,
      active: chatbot.active,
    });
  };

  useEffect(() => {
    if (quotaList) {
      quotaList.map((quota: any) => {
        if (quota.quotaType === "BOT") {
          setQuota({
            limit: quota.limit,
            usage: quota.used,
          });
        }
      });
    }
  }, [quotaList]);

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
    <>
      <div className="flex justify-between items-start gap-4 p-4">
        <div className="flex flex-col grow gap-4">
          <div className="flex justify-between items-center p-4 border-b-[1px] border-[#E3EBF7]">
            <div className="flex gap-2">
              <h1 className="text-[24px] text-gray-500 font-bold">Chatbots</h1>
              <div className="bg-blue-100 text-gray-500 w-fit text-xs flex items-center justify-center rounded-full py-1 px-2">
                bot usage {quota.usage}/{quota.limit}
              </div>
            </div>
            <Button color="primary" onPress={handleOpen}>
              create chatbot
            </Button>
          </div>
          {chatbots.length === 0 && (
            <div className="bg-gray-100 rounded-xl p-4 min-h-48 flex flex-col items-stretch justify-center">
              <h2 className="text-[18px] text-gray-500 font-bold py-4 text-center">
                You don't have any chatbots yet. Create your first chatbot now!
              </h2>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {chatbots.length > 0 &&
              chatbots.map((chatbot: Chatbot) => (
                <div
                  key={chatbot.id}
                  className="bg-gray-100 rounded-xl p-4 min-h-48 flex flex-col items-stretch justify-between hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-4">
                        <Avatar
                          as="button"
                          className="transition-transform"
                          src={getAvatarLogo()}
                        />
                        <h2 className="text-[18px] text-blue-500 font-bold py-4">
                          {chatbot.botName}
                        </h2>
                      </div>
                    </div>
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <VerticalDotsIcon className="text-default-400" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          onPress={() => ToggleChatBot(chatbot)}
                        >
                          {chatbot.active ? "Set Inactive" : "Set Active"}
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          onPress={() => handleEdit(chatbot)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="appearance"
                          onClick={() => navigate(`/appearance/${chatbot.id}`)}
                        >
                          Appearance
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          onPress={() => handleDelete(chatbot)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div className="bg-blue-100 text-gray-500 rounded-full py-1 px-2 w-fit">
                    {chatbot.active ? "active" : "inactive"}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 max-w-[330px]">
          <h2 className="text-[24px] text-gray-500 font-bold py-4">
            video tutorials
          </h2>
          <div className="flex flex-col gap-4">
            <img
              src="/images/create-your-first-chatbot.webp"
              alt="video"
              className="rounded-lg"
            />
            <h3 className="text-[18px] text-blue-500 font-bold">
              create your first chatbot
            </h3>
            <p className="text-gray-400 text-sm">
              Learn how to create your first chatbot from scratch! This
              step-by-step tutorial will guide you through the basics of chatbot
              development, from choosing the right platform to building
              interactive conversations. Perfect for beginners looking to get
              started with AI-powered chatbots. 🚀
            </p>
          </div>
        </div>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Bot
              </ModalHeader>

              <ModalBody onKeyDown={handleKeyDown}>
                <FormikProvider value={formik}>
                  <Form
                    autoComplete="false"
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="Bot Name"
                      type="botName"
                      name="botName"
                      isRequired={true}
                      autoComplete="false"
                      isInvalid={Boolean(formik.errors.botName)}
                      variant="bordered"
                      placeholder="Enter your bot name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.botName}
                      errorMessage={
                        formik.touched.botName && formik.errors.botName
                          ? formik.errors.botName
                          : ""
                      }
                    />

                    <Select
                      label="Bot Type"
                      placeholder="Select an bot type"
                      selectedKeys={botConfig}
                      variant="bordered"
                      onSelectionChange={(keys) =>
                        setBotConfig(
                          new Set(Array.from(keys).map((key) => String(key)))
                        )
                      }
                    >
                      {chatbotsConfigs.map((animal) => (
                        <SelectItem key={animal.key}>{animal.label}</SelectItem>
                      ))}
                    </Select>

                    {botConfig.has("custom") && (
                      <Textarea
                        label="Custom Command"
                        type="customCommand"
                        name="customCommand"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.customCommand}
                        placeholder="Örnek bir görev tanımı giriniz... Sen bir eğitim sitesi yapay zeka asistanısın. Eğitimlerle ilgili sorulara vektör veri tabanından cevap verirsin."
                      />
                    )}
                  </Form>
                </FormikProvider>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => {
                    formik.values.botName = "";
                    formik.values.systemPrompt = "";
                    formik.values.customCommand = "";
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSendForm}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal backdrop="blur" isOpen={isEditOpen} onClose={onEditClose}>
        <ModalContent>
          {(onEditClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Your Bot
              </ModalHeader>

              <ModalBody onKeyDown={handleKeyDownEditForm}>
                <FormikProvider value={formik}>
                  <Form
                    autoComplete="false"
                    onSubmit={handleSendEditForm}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="Bot Name"
                      type="botName"
                      name="botName"
                      isRequired={true}
                      autoComplete="false"
                      isInvalid={Boolean(formik.errors.botName)}
                      variant="bordered"
                      placeholder="Enter your bot name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.botName}
                      errorMessage={
                        formik.touched.botName && formik.errors.botName
                          ? formik.errors.botName
                          : ""
                      }
                    />
                    <Textarea
                      label="System Prompt"
                      type="systemPrompt"
                      name="systemPrompt"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.systemPrompt}
                      placeholder="Örnek bir görev tanımı giriniz... Sen bir eğitim sitesi yapay zeka asistanısın. Eğitimlerle ilgili sorulara vektör veri tabanından cevap verirsin."
                    />
                  </Form>
                </FormikProvider>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onEditClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSendEditForm}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
