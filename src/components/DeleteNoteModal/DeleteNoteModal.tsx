import { useNotesStore } from "../../store/useNotes";
import "./DeleteNoteModal.css";

const DeleteNoteModal = () => {
  const pendingDeleteNoteId = useNotesStore((s) => s.pendingDeleteNoteId);
  const setPendingDeleteNoteId = useNotesStore((s) => s.setPendingDeleteNoteId);
  const removeNote = useNotesStore((s) => s.removeNote);

  if (!pendingDeleteNoteId) {
    return null;
  }

  const onCancel = () => {
    setPendingDeleteNoteId(null);
  };

  const onConfirm = () => {
    removeNote(pendingDeleteNoteId);
    setPendingDeleteNoteId(null);
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
