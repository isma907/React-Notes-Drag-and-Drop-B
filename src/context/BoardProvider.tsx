import { type RefObject } from "react";
import { BoardContext } from "./boardContext";

interface BoardProviderProps {
  children: React.ReactNode;
  trashRef: RefObject<HTMLDivElement | null>;
  boardRef: RefObject<HTMLDivElement | null>;
}

export function BoardProvider({
  children,
  trashRef,
  boardRef,
}: BoardProviderProps) {
  return (
    <BoardContext.Provider value={{ trashRef, boardRef }}>
      {children}
    </BoardContext.Provider>
  );
}
