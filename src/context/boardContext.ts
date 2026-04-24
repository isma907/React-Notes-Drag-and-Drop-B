import { createContext, useContext, type RefObject } from "react";

export type BoardContextType = {
  trashRef: RefObject<HTMLDivElement | null>;
};

export const BoardContext = createContext<BoardContextType | null>(null);

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}
