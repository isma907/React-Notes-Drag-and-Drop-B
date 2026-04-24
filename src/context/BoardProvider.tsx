import { useMemo, type RefObject } from "react";
import { BoardContext } from "./boardContext";

interface BoardProviderProps {
  children: React.ReactNode;
  trashRef: RefObject<HTMLDivElement | null>;
}

export function BoardProvider({ children, trashRef }: BoardProviderProps) {
  const contextValue = useMemo(
    () => ({
      trashRef,
    }),
    [trashRef],
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}

