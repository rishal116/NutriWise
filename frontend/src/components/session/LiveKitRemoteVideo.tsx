"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ParticipantEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
} from "livekit-client";

interface LiveKitRemoteVideoProps {
  participant: RemoteParticipant;
  source?: Track.Source;
  className?: string;
  fallback?: ReactNode;
}

export default function LiveKitRemoteVideo({
  participant,
  source = Track.Source.Camera,
  className = "h-full w-full object-cover",
  fallback = null,
}: LiveKitRemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [hasVideo, setHasVideo] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const audioElement = audioRef.current;
    if (!videoElement || !audioElement) return;

    let attachedVideo: RemoteTrack | null = null;
    let attachedAudio: RemoteTrack | null = null;

    const syncVideo = () => {
      const publication = participant.getTrackPublication(source);
      const track =
        publication?.isSubscribed && publication.track
          ? publication.track
          : null;

      if (track !== attachedVideo) {
        attachedVideo?.detach(videoElement);
        attachedVideo = track;
        track?.attach(videoElement);
      }

      setHasVideo(track !== null);
      setIsVideoMuted(publication?.isMuted ?? false);
    };

    const syncAudio = () => {
      const publication = participant.getTrackPublication(
        Track.Source.Microphone,
      );
      const track =
        publication?.isSubscribed && publication.track
          ? publication.track
          : null;

      if (track === attachedAudio) return;

      attachedAudio?.detach(audioElement);
      attachedAudio = track;

      if (track) {
        track.attach(audioElement);
        void audioElement.play().catch((error: unknown) => {
          console.warn("Unable to autoplay remote audio:", error);
        });
      }
    };

    // Re-reading publication state is cheap, so every relevant event
    // just re-syncs both tracks.
    const sync = () => {
      syncVideo();
      syncAudio();
    };

    sync();

    participant
      .on(ParticipantEvent.TrackPublished, sync)
      .on(ParticipantEvent.TrackUnpublished, sync)
      .on(ParticipantEvent.TrackSubscribed, sync)
      .on(ParticipantEvent.TrackUnsubscribed, sync)
      .on(ParticipantEvent.TrackMuted, sync)
      .on(ParticipantEvent.TrackUnmuted, sync);

    return () => {
      participant
        .off(ParticipantEvent.TrackPublished, sync)
        .off(ParticipantEvent.TrackUnpublished, sync)
        .off(ParticipantEvent.TrackSubscribed, sync)
        .off(ParticipantEvent.TrackUnsubscribed, sync)
        .off(ParticipantEvent.TrackMuted, sync)
        .off(ParticipantEvent.TrackUnmuted, sync);

      attachedVideo?.detach(videoElement);
      attachedAudio?.detach(audioElement);
    };
  }, [participant, source]);

  const showVideo = hasVideo && !isVideoMuted;

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`block ${className} ${showVideo ? "" : "hidden"}`}
      />

      <audio ref={audioRef} autoPlay className="hidden" />

      {!showVideo && fallback}
    </div>
  );
}