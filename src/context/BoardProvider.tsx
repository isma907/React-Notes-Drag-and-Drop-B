import { useState, useMemo, type RefObject } from "react";
import { BoardContext } from "./boardContext";

interface BoardProviderProps {
  children: React.ReactNode;
  trashRef: RefObject<HTMLDivElement | null>;
}

export function BoardProvider({ children, trashRef }: BoardProviderProps) {
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState<string | null>(
    null,
  );

  const openDeleteModal = (id: string) => {
    setPendingDeleteNoteId(id);
  };

  const closeDeleteModal = () => {
    setPendingDeleteNoteId(null);
  };

  const contextValue = useMemo(
    () => ({
      trashRef,
      pendingDeleteNoteId,
      openDeleteModal,
      closeDeleteModal,
    }),
    [trashRef, pendingDeleteNoteId],
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}
