import { useMemo, type RefObject } from "react";
import { BoardContext } from "./boardContext";

interface BoardProviderProps {
  children: React.ReactNode;
  trashRef: RefObject<HTMLDivElement | null>;
  boardRef: RefObject<HTMLDivElement | null>;
}

export function BoardProvider({ children, trashRef, boardRef }: BoardProviderProps) {
  const contextValue = useMemo(
    () => ({
      trashRef,
      boardRef,
    }),
    [trashRef, boardRef],
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}
