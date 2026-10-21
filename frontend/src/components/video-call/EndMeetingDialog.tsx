"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { CircleOff } from "lucide-react";
import { controlButtonClass } from "./ControlButton";

interface EndMeetingDialogProps {
  onConfirm: () => void;
}

const EndMeetingDialog = ({ onConfirm }: EndMeetingDialogProps) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger
      aria-label="End meeting for everyone"
      title="End meeting for everyone"
      className={controlButtonClass("softDanger")}
    >
      <CircleOff size={20} />
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-5 text-white shadow-2xl">
        <AlertDialog.Title className="text-base font-semibold">
          End meeting?
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-2 text-sm text-neutral-400">
          The meeting will be marked as completed. Use Leave instead if you
          plan to rejoin.
        </AlertDialog.Description>
        <div className="mt-5 flex justify-end gap-2">
          <AlertDialog.Cancel className="rounded-xl px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800">
            Cancel
          </AlertDialog.Cancel>
          <AlertDialog.Action
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
          >
            End meeting
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default EndMeetingDialog;