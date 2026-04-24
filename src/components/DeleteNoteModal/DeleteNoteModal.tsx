import { useNotesStore } from "../../store/useNotes";
import "./DeleteNoteModal.css";

const DeleteNoteModal = () => {
  const pendingDeleteNoteId = useNotesStore((s) => s.pendingDeleteNoteId);
  const resetPendingDeleteNoteId = useNotesStore(
    (s) => s.resetPendingDeleteNoteId,
  );
  const removeNote = useNotesStore((s) => s.removeNote);

  if (!pendingDeleteNoteId) {
    return null;
  }

  const onCancel = () => {
    resetPendingDeleteNoteId();
  };

  const onConfirm = () => {
    removeNote(pendingDeleteNoteId);
  };

  return (
    <div className="delete-note-modal-backdrop" role="dialog" aria-modal="true">
      <div className="delete-note-modal">
        <p>Delete this StickyNote?</p>
        <div className="delete-note-modal-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNoteModal;
