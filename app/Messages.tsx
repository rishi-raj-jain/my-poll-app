import { cn } from "@/lib/utils";
import { Message, MessageList } from "@chatscope/chat-ui-kit-react";
import { useChannelStateContext } from "stream-chat-react";

export default function () {
  const { messages } = useChannelStateContext();
  console.log(messages); // this does not contain messages.poll as it said in the stream docs
  return (
    <MessageList>
      {messages?.map((i, index: number) => (
        <Message
          key={i.id}
          model={{
            position: "normal",
            sender: i.user?.id,
            direction: "incoming",
            message: `${i.user?.id}: ${i.text}`,
            sentTime: i.created_at?.toString(),
          }}
          className={cn(
            "bg-white rounded text-black py-2 text-xs",
            index !== messages.length - 1 && "border-b"
          )}
        />
      ))}
    </MessageList>
  );
}
