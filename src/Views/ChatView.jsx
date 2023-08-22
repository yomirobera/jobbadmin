
import Chat from "../components/pages/chat/ChatPage";
import { useLocation } from "react-router-dom";

const ChatView = () => {
  const query = new URLSearchParams(useLocation().search);
  const reciver = query.get("reciver");
  console.log(reciver)
  return (
    <>
      <Chat reciver={reciver} />
    </>
  );
};
export default ChatView;
