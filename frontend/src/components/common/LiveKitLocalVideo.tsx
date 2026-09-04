"use client";

import { useEffect, useRef } from "react";

import { LocalParticipant, Track } from "livekit-client";

interface LiveKitLocalVideoProps {
  participant: LocalParticipant;
  source?: Track.Source;
  mirror?: boolean;
  className?: string;
}

export default function LiveKitLocalVideo({
  participant,
  source = Track.Source.Camera,
  mirror = true,
  className = "h-full w-full object-cover",
}: LiveKitLocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    const publication = participant.getTrackPublication(source);

    if (!publication) {
      return;
    }

    const track = publication.track;

    if (!track) {
      return;
    }

    track.attach(videoElement);

    return () => {
      track.detach(videoElement);
    };
  }, [participant, source]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className={`${className} ${
        mirror && source === Track.Source.Camera ? "-scale-x-100" : ""
      }`}
    />
  );
}
