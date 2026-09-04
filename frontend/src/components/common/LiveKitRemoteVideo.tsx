"use client";

import { useEffect, useRef, useState } from "react";
import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Track,
  TrackPublication,
} from "livekit-client";

interface LiveKitRemoteVideoProps {
  participant: RemoteParticipant;
  source?: Track.Source;
  className?: string;
  fallback?: React.ReactNode;
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

    if (!videoElement || !audioElement) {
      return;
    }

    let attachedVideoTrack: RemoteTrack | null = null;
    let attachedAudioTrack: RemoteTrack | null = null;

    const getVideoPublication = (): RemoteTrackPublication | undefined =>
      participant.getTrackPublication(source);

    const getAudioPublication = (): RemoteTrackPublication | undefined =>
      participant.getTrackPublication(Track.Source.Microphone);

    const syncVideo = () => {
      const publication = getVideoPublication();

      const track =
        publication?.isSubscribed && publication.track
          ? publication.track
          : null;

      if (track === attachedVideoTrack) {
        setIsVideoMuted(publication?.isMuted ?? false);
        return;
      }

      if (attachedVideoTrack) {
        attachedVideoTrack.detach(videoElement);
      }

      attachedVideoTrack = track;

      if (track) {
        track.attach(videoElement);
        setHasVideo(true);
      } else {
        setHasVideo(false);
      }

      setIsVideoMuted(publication?.isMuted ?? false);
    };

    const syncAudio = () => {
      const publication = getAudioPublication();

      const track =
        publication?.isSubscribed && publication.track
          ? publication.track
          : null;

      if (track === attachedAudioTrack) {
        return;
      }

      if (attachedAudioTrack) {
        attachedAudioTrack.detach(audioElement);
      }

      attachedAudioTrack = track;

      if (track) {
        track.attach(audioElement);
        audioElement.autoplay = true;
        audioElement.muted = false;

        void audioElement.play().catch((error: unknown) => {
          console.warn("Unable to autoplay remote audio:", error);
        });
      }
    };

    const syncTracks = () => {
      syncVideo();
      syncAudio();
    };

    const handleTrackSubscribed = (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
    ) => {
      if (
        publication.source === source ||
        publication.source === Track.Source.Microphone
      ) {
        syncTracks();
      }
    };

    const handleTrackUnsubscribed = (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
    ) => {
      if (
        publication.source === source ||
        publication.source === Track.Source.Microphone
      ) {
        syncTracks();
      }
    };

    const handleMuteChange = (publication: TrackPublication) => {
      if (publication.source === source) {
        setIsVideoMuted(publication.isMuted);
      }

      if (publication.source === Track.Source.Microphone) {
        syncAudio();
      }
    };

    const handleTrackPublished = (publication: RemoteTrackPublication) => {
      if (
        publication.source === source ||
        publication.source === Track.Source.Microphone
      ) {
        syncTracks();
      }
    };

    const handleTrackUnpublished = (publication: RemoteTrackPublication) => {
      if (
        publication.source === source ||
        publication.source === Track.Source.Microphone
      ) {
        syncTracks();
      }
    };

    syncTracks();

    participant
      .on("trackSubscribed", handleTrackSubscribed)
      .on("trackUnsubscribed", handleTrackUnsubscribed)
      .on("trackMuted", handleMuteChange)
      .on("trackUnmuted", handleMuteChange)
      .on("trackPublished", handleTrackPublished)
      .on("trackUnpublished", handleTrackUnpublished);

    return () => {
      participant
        .off("trackSubscribed", handleTrackSubscribed)
        .off("trackUnsubscribed", handleTrackUnsubscribed)
        .off("trackMuted", handleMuteChange)
        .off("trackUnmuted", handleMuteChange)
        .off("trackPublished", handleTrackPublished)
        .off("trackUnpublished", handleTrackUnpublished);

      if (attachedVideoTrack) {
        attachedVideoTrack.detach(videoElement);
      }

      if (attachedAudioTrack) {
        attachedAudioTrack.detach(audioElement);
      }
    };
  }, [participant, source]);

  const showVideo = hasVideo && !isVideoMuted;

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={className}
        style={{
          display: showVideo ? undefined : "none",
        }}
      />

      <audio
        ref={audioRef}
        autoPlay
        playsInline
        controls={false}
        muted={false}
        className="hidden"
      />

      {!showVideo && fallback}
    </div>
  );
}
