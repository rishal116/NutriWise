"use client";

import VideoTile from "./VideoTile";

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoOn: boolean;
}

// Phone: fill the screen. md+: a centered 16:9 tile that always fits above the controls.
const MAIN_TILE =
  "relative h-full w-full md:h-auto md:aspect-video md:w-[min(100%,calc((100dvh_-_9rem)*1.7778))]";

const PIP_TILE =
  "absolute bottom-24 right-4 z-10 aspect-[3/4] w-24 shadow-2xl ring-1 ring-white/10 md:right-8 md:aspect-video md:w-60";

const VideoGrid = ({ localStream, remoteStream, isVideoOn }: VideoGridProps) => (
  <div className="relative flex h-full w-full items-center justify-center p-3 pb-24 md:p-4 md:pb-24">
    {remoteStream && (
      <VideoTile
        stream={remoteStream}
        label="Partner"
        fit="contain"
        className={`${MAIN_TILE} bg-black`}
      />
    )}
    <VideoTile
      stream={localStream}
      label="You"
      muted
      mirrored
      videoOff={!localStream || !isVideoOn}
      className={remoteStream ? PIP_TILE : MAIN_TILE}
    />
  </div>
);

export default VideoGrid;