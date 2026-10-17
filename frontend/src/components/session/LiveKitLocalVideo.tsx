"use client";

import { useEffect, useRef } from "react";
import { LocalParticipant, ParticipantEvent, Track } from "livekit-client";

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
    if (!videoElement) return;

    // Remember what we attached so cleanup still works after the
    // publication is gone (getTrackPublication would return undefined).
    let attached: Track | null = null;

    const detach = () => {
      attached?.detach(videoElement);
      attached = null;
    };

    const sync = () => {
      const track = participant.getTrackPublication(source)?.track;

      if (!track || track.kind !== Track.Kind.Video) {
        detach();
        return;
      }
      if (track === attached) return;

      detach();
      track.attach(videoElement);
      attached = track;
    };

    sync();

    participant
      .on(ParticipantEvent.LocalTrackPublished, sync)
      .on(ParticipantEvent.LocalTrackUnpublished, sync);

    return () => {
      participant
        .off(ParticipantEvent.LocalTrackPublished, sync)
        .off(ParticipantEvent.LocalTrackUnpublished, sync);
      detach();
    };
  }, [participant, source]);

  const shouldMirror = mirror && source === Track.Source.Camera;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className={`block ${className} ${shouldMirror ? "-scale-x-100" : ""}`}
    />
  );
}