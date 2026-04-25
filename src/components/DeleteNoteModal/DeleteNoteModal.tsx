import { useNotesStore } from "../../store/useNotes";
import "./DeleteNoteModal.css";

const DeleteNoteModal = () => {
  const isDeleteModalOpen = useNotesStore((s) => s.isDeleteModalOpen);
  const deleteNoteId = useNotesStore((s) => s.deleteNoteId);
  const hideDeleteNoteModal = useNotesStore((s) => s.hideDeleteNoteModal);
  const removeNote = useNotesStore((s) => s.removeNote);

  if (!isDeleteModalOpen || !deleteNoteId) {
    return null;
  }

  const onCancel = () => {
    hideDeleteNoteModal();
  };

  const onConfirm = () => {
    removeNote(deleteNoteId);
    hideDeleteNoteModal();
  };

  return (
    <div className="delete-note-modal-backdrop" role="dialog" aria-modal="true">
      <div className="delete-note-modal">
        <h3>Delete this StickyNote?</h3>
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
