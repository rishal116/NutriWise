"use client";

import { useCallback, useRef, useState } from "react";
import { MEDIA_CONSTRAINTS } from "@/lib/webrtc/config";

const applyEnabled = (media: MediaStream, audio: boolean, video: boolean) => {
  media.getAudioTracks().forEach((track) => {
    track.enabled = audio;
  });
  media.getVideoTracks().forEach((track) => {
    track.enabled = video;
  });
};

/** Mic and camera both start OFF; the stream is acquired on first camera-on or on join. */
export const useLocalMedia = () => {
  const streamRef = useRef<MediaStream | null>(null);
  const audioOnRef = useRef(false);
  const videoOnRef = useRef(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const acquire = useCallback(async (): Promise<MediaStream> => {
    if (streamRef.current) return streamRef.current;

    const media = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
    applyEnabled(media, audioOnRef.current, videoOnRef.current);
    streamRef.current = media;
    setStream(media);
    return media;
  }, []);

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioOnRef.current = false;
    videoOnRef.current = false;
    setStream(null);
    setIsAudioOn(false);
    setIsVideoOn(false);
  }, []);

  const toggleAudio = useCallback(() => {
    const next = !audioOnRef.current;
    audioOnRef.current = next;
    setIsAudioOn(next);
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
  }, []);

  const toggleVideo = useCallback(async () => {
    const next = !videoOnRef.current;
    videoOnRef.current = next;
    setIsVideoOn(next);

    try {
      if (next && !streamRef.current) {
        await acquire();
      } else {
        streamRef.current?.getVideoTracks().forEach((track) => {
          track.enabled = next;
        });
      }
    } catch (err) {
      videoOnRef.current = false;
      setIsVideoOn(false);
      throw err;
    }
  }, [acquire]);

  return { stream, isAudioOn, isVideoOn, acquire, release, toggleAudio, toggleVideo };
};