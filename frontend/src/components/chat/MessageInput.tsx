"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Smile,
  Paperclip,
  SendHorizontal,
  Loader2,
  X,
  FileIcon,
  Ban,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  AudioLines,
} from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";

interface MessageInputProps {
  conversationId?: string;
  isReadOnly?: boolean;
  isPlanExpired?: boolean;
  editingMessage?: MessageResponseDTO | null;
  onCancelEdit?: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendFile: (file: File) => Promise<void>;
  onSaveEdit?: (messageId: string, newText: string) => Promise<void>;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_RECORDING_SECONDS = 120;

const AUDIO_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

const getSupportedAudioMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") return "";
  return AUDIO_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
};

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const getAudioExtension = (mimeType: string): string => {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
};

const ICON_BTN =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:opacity-40";

const PRIMARY_BTN =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

export default function MessageInput({
  isReadOnly = false,
  isPlanExpired = false,
  editingMessage,
  onCancelEdit,
  onSendMessage,
  onSendFile,
  onSaveEdit,
}: MessageInputProps) {
  const editingId = editingMessage?.id ?? null;

  const [text, setText] = useState("");
  const [prevEditingId, setPrevEditingId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingSecondsRef = useRef(0);
  const discardRecordingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Sync draft text when the edited message changes (render-phase adjustment,
  // avoids setState-in-effect).
  if (editingId !== prevEditingId) {
    setPrevEditingId(editingId);
    setText(editingMessage?.text ?? "");
  }

  const isBusy = sending || isRecording;
  const hasDraft = Boolean(text.trim() || selectedFile);
  const controlsLocked = isBusy || Boolean(selectedFile) || Boolean(editingId);

  const stopMediaStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const releaseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.stop();
    }

    mediaRecorderRef.current = null;
    stopMediaStream();
    audioChunksRef.current = [];
    recordingStartedAtRef.current = null;
    recordingSecondsRef.current = 0;
  }, [stopMediaStream]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      releaseRecording();
    };
  }, [releaseRecording]);

  useEffect(() => {
    if (editingId) textareaRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  }, [text]);

  useEffect(() => {
    if (!showEmojis) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showEmojis]);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview !== "file") {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  useEffect(() => {
    if (!isRecording) return;

    const intervalId = window.setInterval(() => {
      const startedAt = recordingStartedAtRef.current;
      if (!startedAt) return;

      const seconds = Math.floor((Date.now() - startedAt) / 1000);

      recordingSecondsRef.current = seconds;
      setRecordingSeconds(seconds);

      if (seconds >= MAX_RECORDING_SECONDS) {
        const recorder = mediaRecorderRef.current;
        if (recorder?.state === "recording") recorder.stop();
        setIsRecording(false);
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const element = textareaRef.current;
    const cursor = element?.selectionStart ?? text.length;

    setText(text.slice(0, cursor) + emojiData.emoji + text.slice(cursor));

    requestAnimationFrame(() => {
      element?.focus();
      const next = cursor + emojiData.emoji.length;
      element?.setSelectionRange(next, next);
    });
  };

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    setAudioPreviewUrl(null);
    setAudioDuration(0);
    setIsPlayingPreview(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const resetState = useCallback(() => {
    setText("");
    clearSelectedFile();
    setShowEmojis(false);
    setErrorMessage(null);
  }, [clearSelectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size must be under 25 MB.");
      event.target.value = "";
      return;
    }

    clearSelectedFile();
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type.startsWith("audio/")) {
      setAudioPreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreview("file");
    }
  };

  const startRecording = async () => {
    if (controlsLocked) return;

    setErrorMessage(null);

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setErrorMessage("Audio recording is not supported in this browser.");
      return;
    }

    let stream: MediaStream | null = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const mimeType = getSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      discardRecordingRef.current = false;
      recordingSecondsRef.current = 0;
      recordingStartedAtRef.current = Date.now();

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        if (isMountedRef.current) {
          setErrorMessage("Recording failed. Please try again.");
          setIsRecording(false);
        }
        stopMediaStream();
      };

      recorder.onstop = () => {
        const chunks = audioChunksRef.current;
        const shouldDiscard = discardRecordingRef.current;
        const duration = recordingSecondsRef.current;
        const actualMimeType = recorder.mimeType || mimeType || "audio/webm";

        audioChunksRef.current = [];
        mediaRecorderRef.current = null;
        recordingStartedAtRef.current = null;
        stopMediaStream();

        if (!isMountedRef.current || shouldDiscard) return;

        const blob = new Blob(chunks, { type: actualMimeType });

        if (blob.size === 0) {
          setErrorMessage("No audio was recorded. Please try again.");
          setIsRecording(false);
          return;
        }

        if (blob.size > MAX_FILE_SIZE) {
          setErrorMessage("Recording exceeds the 25 MB file limit.");
          setIsRecording(false);
          return;
        }

        const audioFile = new File(
          [blob],
          `voice-message-${Date.now()}.${getAudioExtension(actualMimeType)}`,
          { type: actualMimeType },
        );

        setSelectedFile(audioFile);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setAudioDuration(duration);
        setRecordingSeconds(0);
        setIsPlayingPreview(false);
        setIsRecording(false);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());

      if (!isMountedRef.current) return;

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage(
          "Microphone access was denied. Allow access and try again.",
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setErrorMessage("No microphone was found on this device.");
      } else {
        setErrorMessage("Could not start recording. Please try again.");
      }

      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
    setIsRecording(false);
  };

  const cancelRecording = () => {
    discardRecordingRef.current = true;

    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      releaseRecording();
    }

    setIsRecording(false);
    setRecordingSeconds(0);
    setErrorMessage(null);
  };

  const toggleAudioPreview = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlayingPreview(true);
      } catch {
        setErrorMessage("Could not play the audio preview.");
      }
    } else {
      audio.pause();
      setIsPlayingPreview(false);
    }
  };

  const handleSubmit = async () => {
    if (isReadOnly || isPlanExpired || isBusy) return;

    const trimmed = text.trim();

    if (editingMessage && onSaveEdit && trimmed) {
      setSending(true);
      setErrorMessage(null);

      try {
        await onSaveEdit(editingMessage.id, trimmed);
        onCancelEdit?.();
        resetState();
      } catch {
        setErrorMessage("Could not save the edited message. Please try again.");
      } finally {
        setSending(false);
      }
      return;
    }

    if (selectedFile) {
      setSending(true);
      setErrorMessage(null);

      try {
        await onSendFile(selectedFile);
        resetState();
      } catch {
        setErrorMessage("Could not send the attachment. Please try again.");
      } finally {
        setSending(false);
      }
      return;
    }

    if (!trimmed) return;

    setSending(true);
    setErrorMessage(null);

    try {
      await onSendMessage(trimmed);
      resetState();
    } catch {
      setErrorMessage("Could not send the message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (isPlanExpired || isReadOnly) {
    return (
      <div
        className={`flex items-center justify-center gap-2 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs font-semibold ${
          isPlanExpired
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-slate-200 bg-slate-100/80 text-slate-500"
        }`}
      >
        <Ban className="h-4 w-4 shrink-0" />
        <span>
          {isPlanExpired
            ? "Your coaching plan has expired. Messaging is unavailable."
            : "This conversation is no longer active. You can still view previous messages."}
        </span>
      </div>
    );
  }

  const isAudioAttachment =
    Boolean(audioPreviewUrl) &&
    Boolean(selectedFile?.type.startsWith("audio/"));

  return (
    <div className="relative flex flex-col gap-2 border-t border-slate-200/80 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-4 sm:pb-4">
      {editingMessage && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50 py-1 pr-1.5 pl-3 text-xs text-emerald-800">
          <span className="font-semibold">Editing message</span>
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100"
            aria-label="Cancel editing"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2 pr-2 pl-3 text-xs text-rose-700"
        >
          <span className="min-w-0 break-words">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="shrink-0 rounded p-0.5 hover:bg-rose-100"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-2.5 sm:gap-3 sm:p-3">
          <span className="relative ml-1 flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-600" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-rose-700">
              Recording voice message
            </p>
            <p className="text-xs tabular-nums text-rose-600">
              {formatDuration(recordingSeconds)} /{" "}
              {formatDuration(MAX_RECORDING_SECONDS)}
            </p>
          </div>

          <button
            type="button"
            onClick={cancelRecording}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-rose-600"
            aria-label="Cancel recording"
            title="Cancel recording"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={stopRecording}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white transition-colors hover:bg-rose-700"
            aria-label="Stop recording"
            title="Stop recording"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        </div>
      )}

      {selectedFile && !isRecording && (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:gap-3 sm:p-2.5">
          {audioPreviewUrl ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <AudioLines className="h-5 w-5" />
            </div>
          ) : filePreview && filePreview !== "file" ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <Image
                src={filePreview}
                alt="Attachment preview"
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <FileIcon className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
              {isAudioAttachment ? "Voice message" : selectedFile.name}
            </p>
            <p className="text-[11px] tabular-nums text-slate-500">
              {audioDuration > 0
                ? formatDuration(audioDuration)
                : `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`}
            </p>
          </div>

          {audioPreviewUrl && (
            <button
              type="button"
              onClick={() => void toggleAudioPreview()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
              aria-label={
                isPlayingPreview ? "Pause audio preview" : "Play audio preview"
              }
            >
              {isPlayingPreview ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={clearSelectedFile}
            disabled={sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-rose-500 disabled:opacity-40"
            aria-label="Remove attachment"
          >
            <X className="h-4 w-4" />
          </button>

          {audioPreviewUrl && (
            <audio
              ref={audioRef}
              src={audioPreviewUrl}
              preload="metadata"
              className="hidden"
              onLoadedMetadata={(event) => {
                const { duration } = event.currentTarget;
                if (Number.isFinite(duration)) {
                  setAudioDuration(Math.floor(duration));
                }
              }}
              onEnded={() => setIsPlayingPreview(false)}
              onPause={() => setIsPlayingPreview(false)}
              onError={() => {
                setIsPlayingPreview(false);
                setErrorMessage(
                  "This audio format could not be previewed in your browser.",
                );
              }}
            />
          )}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex min-w-0 flex-1 items-end gap-0.5 rounded-3xl border border-slate-200/80 bg-slate-100/90 py-1 pr-3 pl-1 transition-all focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15">
          <div ref={emojiRef} className="relative shrink-0">
            {showEmojis && (
              <div className="fixed inset-x-3 bottom-24 z-50 flex justify-center sm:absolute sm:inset-x-auto sm:bottom-12 sm:left-0 sm:block">
                <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={Theme.LIGHT}
                    width="min(320px, calc(100vw - 1.5rem))"
                    height={360}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => setShowEmojis((previous) => !previous)}
              className={ICON_BTN}
              aria-label="Add emoji"
              aria-expanded={showEmojis}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            disabled={controlsLocked}
            onClick={() => fileInputRef.current?.click()}
            className={ICON_BTN}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
          />

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            disabled={isBusy || Boolean(selectedFile)}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              selectedFile ? "Attachment ready to send" : "Type a message..."
            }
            aria-label="Message"
            enterKeyHint="send"
            className="max-h-[120px] min-w-0 flex-1 resize-none self-center bg-transparent px-1.5 py-2 text-base leading-snug font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 sm:text-sm"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void handleSubmit();
              }
            }}
          />
        </div>

        {hasDraft ? (
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isBusy}
            className={PRIMARY_BTN}
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizontal className="h-5 w-5" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startRecording()}
            disabled={controlsLocked}
            className={PRIMARY_BTN}
            aria-label="Record voice message"
            title="Record voice message"
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
      </div>

      {!isRecording && !selectedFile && (
        <p className="hidden px-1 text-[11px] text-slate-400 sm:block">
          {editingMessage
            ? "Press Enter to save changes"
            : "Enter to send · Shift + Enter for a new line"}
        </p>
      )}
    </div>
  );
}
