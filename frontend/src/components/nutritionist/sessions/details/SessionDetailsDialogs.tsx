
import { Send, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface SessionDetailsDialogsProps {
  showPublishConfirm: boolean;
  showDeleteConfirm: boolean;
  publishing: boolean;
  deleting: boolean;
  onPublishOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onPublish: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function SessionDetailsDialogs({
  showPublishConfirm,
  showDeleteConfirm,
  publishing,
  deleting,
  onPublishOpenChange,
  onDeleteOpenChange,
  onPublish,
  onDelete,
}: SessionDetailsDialogsProps) {
  return (
    <>
      <ConfirmDialog
        open={showPublishConfirm}
        onOpenChange={onPublishOpenChange}
        title="Publish this session?"
        description="Once published, the session becomes visible and bookable by users. You can still edit details afterward."
        confirmLabel="Publish"
        variant="default"
        loading={publishing}
        onConfirm={onPublish}
        icon={<Send className="h-5 w-5" />}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={onDeleteOpenChange}
        title="Delete this session?"
        description="This action is permanent and cannot be undone. All session data will be lost."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={onDelete}
        icon={<Trash2 className="h-5 w-5" />}
      />
    </>
  );
}
