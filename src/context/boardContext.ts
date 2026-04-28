import { createContext, type RefObject } from "react";

export type BoardContextType = {
  trashRef: RefObject<HTMLDivElement | null>;
  boardRef: RefObject<HTMLDivElement | null>;
};

export const BoardContext = createContext<BoardContextType | null>(null);
