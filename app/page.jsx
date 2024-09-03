"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { DevToken, StreamChat } from "stream-chat";
import { Channel, Chat } from "stream-chat-react";
import { generateUsername } from "unique-username-generator";
import Messages from "./Messages";

export default function () {
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const watchChannel = () => {
    const channel = chatClient.channel("polling", "live_poll", {
      name: "Live Poll",
    });
    channel.watch().then(() => setChannel(channel));
  };
  const loadChatClient = async () => {
    const newChatClient = new StreamChat(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      {
        enableWSFallback: true,
      }
    );
    if (newChatClient.user) await newChatClient.disconnectUser();
    const localUser = localStorage.getItem("local_user");
    if (!localUser) localStorage.setItem("local_user", generateUsername());
    const id = localStorage.getItem("local_user");
    const userToConnect = { id };
    await newChatClient.connectUser(userToConnect, DevToken(userToConnect.id));
    setChatClient(newChatClient);
  };
  useEffect(() => {
    loadChatClient();
  }, []);
  useEffect(() => {
    if (chatClient) watchChannel();
  }, [chatClient]);
  return (
    <div className="flex max-w-[300px] flex-col gap-y-3 p-5">
      <div className="flex w-[300px] flex-col gap-y-3">
        <span className="border-b border-gray-100 font-semibold">Polls</span>
        {channel && (
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Messages />
            </Channel>
          </Chat>
        )}
        <Textarea
          id="message_text"
          name="message_text"
          placeholder="Message..."
          className="min-h-[100px] w-full"
        />
        <Button
          className="max-w-max"
          onClick={() => {
            if (channel) {
              chatClient
                .createPoll({
                  name: "Where should we host our next company event?",
                  options: [
                    {
                      text: "Amsterdam, The Netherlands",
                    },
                    {
                      text: "Boulder, CO",
                    },
                  ],
                })
                .then((poll) => {
                  channel.sendMessage({
                    text: "We want to know your opinion!",
                    poll_id: poll.id,
                  });
                });
            }
          }}
        >
          Send Message &rarr;
        </Button>
      </div>
    </div>
  );
}
