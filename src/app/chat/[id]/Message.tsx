"use client";

import {
  Box,
  Button,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Fragment, useEffect, useRef, useState } from "react";

import useMounted from "@/hooks/useMounted";
import { useSocket } from "@/providers/SocketProvider";
import { IMessage } from "../../../../chat";
import { useSession } from "next-auth/react";

const Chat = ({ params, chats }: { params: { id: string }; chats: any }) => {
  const { socket } = useSocket();
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { isMounted } = useMounted();
  const isLogin = status === "authenticated";
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chats);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (currentMessage) {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          username: session?.user?.user?.username,
          userId: session?.user?.user?._id,
          content: currentMessage,
          groupId: params.id,
        }),
      });

      if (res.ok) setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket?.on("message", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") sendMessage();
    };
    window.addEventListener("keyup", handleEnter);
    return () => window.removeEventListener("keyup", handleEnter);
  });

  return (
    <Box>
      <Box
        ref={chatContainerRef}
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <Fragment key={index}>
            {message.userId === session?.user?.user?._id ? (
              <Slide direction="left" in={isMounted} mountOnEnter unmountOnExit>
                <Box textAlign="end">
                  <Typography
                    sx={{
                      display: "inline-block",
                      borderRadius: "0.5rem",
                      backgroundColor: "#BEF0AE",
                      padding: "0.5rem",
                      marginBottom: "1rem",
                      color: "black",
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              </Slide>
            ) : (
              <Slide
                direction="right"
                in={isMounted}
                mountOnEnter
                unmountOnExit
              >
                <Box>
                  <Typography variant="overline" sx={{ display: "block" }}>
                    {message.username}
                  </Typography>
                  <Typography
                    sx={{
                      display: "inline-block",
                      borderRadius: "5px",
                      backgroundColor: "#746d69",
                      padding: "5px",
                      marginBottom: "1rem",
                      color: "white",
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              </Slide>
            )}
          </Fragment>
        ))}
      </Box>
      <Stack direction="row" justifyContent="center">
        <TextField
          size="small"
          id="content"
          disabled={!isLogin}
          placeholder={isLogin ? "Type message..." : "Login first"}
          variant="outlined"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button variant="outlined" disabled={!isLogin} onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Box>
  );
};

export default Chat;
