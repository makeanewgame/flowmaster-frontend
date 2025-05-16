import ChatForm from "@/components/ChatForm";

function Home() {
  // const dummyChatData = {
  //   messages: [
  //     {
  //       datetime: "2021-10-10T10:10:10",
  //       sender: "bot",
  //       message: "Hi ✋",
  //     },
  //     {
  //       datetime: "2021-10-10T10:10:10",
  //       sender: "bot",
  //       message: " welcome to Chatbu How can help you today?",
  //     },
  //     {
  //       datetime: "2021-10-10T10:10:10",
  //       sender: "user",
  //       message: "I need help",
  //     },
  //     {
  //       datetime: "2021-10-10T10:10:10",
  //       sender: "bot",
  //       message: "Sure, I can help you with that",
  //     },
  //     {
  //       datetime: "2021-10-10T10:10:10",
  //       sender: "user",
  //       message: "Thank you",
  //     },
  //   ],
  // };

  return (
    <>
      <div className="flex justify-between items-start gap-4 p-4 h-full">
        <div className="flex flex-col grow gap-4 h-full">
          <div className="flex justify-between items-center p-4 border-b-[1px] border-[#E3EBF7]">
            <h1 className="text-[24px] text-gray-500 font-bold">Home</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full gap-4 p-4 pt-0 w-full">
        <ChatForm />
      </div>
    </>
  );
}

export default Home;
