"use client";

import { useSocket } from "@/providers/SocketProvider";
import { Chip } from "@mui/material";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return <Chip label="Polling every 1s" color="error" />;
  }
  return <Chip label="connected" color="success" />;
};

export default SocketIndicator;
