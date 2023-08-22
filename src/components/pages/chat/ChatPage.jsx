import UserAndBotChat from "../../functionalityComponents/UserAndBotChat/UserChat";
import withAuth from "../../../hoc/withAuth";
import BotChat from "../../functionalityComponents/UserAndBotChat/BotChat";

const Chat = (props) => {
  console.log("Chat Receiver:", props.reciver);

  return (
    <div>
      <UserAndBotChat reciver={props.reciver}></UserAndBotChat>
      <BotChat></BotChat>
    </div>
  );
};

export default withAuth(Chat);
