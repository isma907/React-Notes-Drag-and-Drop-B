import { createContext, useContext, type RefObject } from "react";

type BoardContextType = {
  trashRef: RefObject<HTMLDivElement | null>;
};

const BoardContext = createContext<BoardContextType | null>(null);

export function BoardProvider({
  children,
  trashRef,
}: {
  children: React.ReactNode;
  trashRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <BoardContext.Provider value={{ trashRef }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}
