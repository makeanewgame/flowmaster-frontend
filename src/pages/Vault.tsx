import { selectCurrentUserBot } from "@/redux/features/botSlice";
import { Tab, Tabs } from "@heroui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ContentIcon,
  DocumentIcon,
  LinkIcon,
  QandAIcon,
  VideoIcon,
  WebpageIcon,
} from "./Icons";
import WebPageVault from "./WebPageVault";
import VideoVault from "./VideoVault";
import LinkVault from "./LinkVault";
import QAVault from "@/QAVault";
import ContentVault from "./ContentVault";
import DocumentVault from "@/components/DocumentVault";

export default function Vault() {
  const currentBot = useSelector(selectCurrentUserBot);

  return (
    <div className="flex justify-between items-start gap-4 p-4 h-full">
      <div className="flex flex-col grow gap-4 h-full">
        <div className="flex justify-between items-center p-4 border-b-[1px] border-[#E3EBF7]">
          <h1 className="text-[24px] text-gray-500 font-bold">Vault</h1>
        </div>

        {!currentBot?.id && (
          <div className="bg-gray-100 rounded-xl p-4 min-h-48 flex flex-col items-stretch justify-center">
            <div className="text-[18px] text-gray-500 font-bold py-4 text-center">
              You don't have any chatbots yet. Create your from the{" "}
              <Link to="/chatbots" className="text-blue-500">
                {" "}
                chatbots page{" "}
              </Link>
            </div>
          </div>
        )}

        {currentBot?.id && (
          <Tabs
            aria-label="Options"
            color="primary"
            variant="bordered"
            classNames={{
              tabList: "flex w-full",
              tabContent: "flex flex-col items-center justify-center",
              tab: "h-20 ",
              panel: "flex grow items-stretch",
            }}
          >
            <Tab
              key="document"
              title={
                <div className="flex flex-col items-center space-x-2">
                  <DocumentIcon />
                  <span>Document</span>
                </div>
              }
            >
              <DocumentVault />
            </Tab>
            <Tab
              key="webpage"
              title={
                <div className="flex items-center space-x-2">
                  <WebpageIcon />
                  <span>Web Page</span>
                </div>
              }
            >
              <WebPageVault />
            </Tab>
            <Tab
              key="video"
              title={
                <div className="flex items-center space-x-2">
                  <VideoIcon />
                  <span>Video</span>
                </div>
              }
            >
              <VideoVault />
            </Tab>
            <Tab
              key="link"
              title={
                <div className="flex items-center space-x-2">
                  <LinkIcon />
                  <span>Link</span>
                </div>
              }
            >
              <LinkVault />
            </Tab>
            <Tab
              key="qanda"
              title={
                <div className="flex items-center space-x-2">
                  <QandAIcon />
                  <span>Q&A</span>
                </div>
              }
            >
              <QAVault />
            </Tab>
            <Tab
              key="content"
              title={
                <div className="flex items-center space-x-2">
                  <ContentIcon />
                  <span>Content</span>
                </div>
              }
            >
              <ContentVault />
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
}
