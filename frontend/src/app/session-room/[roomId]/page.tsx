"use client";

import { useParams } from "next/navigation";
import VideoRoom from "@/components/conversation/VideoRoom";

export default function Page() {
  const params = useParams();
  const roomId = params.roomId as string;

  return <VideoRoom roomId={roomId} />;
}