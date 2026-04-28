import { render, screen, fireEvent, act } from "@testing-library/react";
import { UndoToast } from "./UndoToast";
import { useNotesStore } from "../../store/useNotes";
import { vi } from "vitest";

describe("UndoToast", () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: {},
      lastDeletedNote: null,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not render if there is no lastDeletedNote", () => {
    render(<UndoToast />);
    expect(screen.queryByText("Note deleted")).not.toBeInTheDocument();
  });

  it("renders when a note is deleted and handles undo", () => {
    useNotesStore.setState({
      lastDeletedNote: {
        id: "123",
        textContent: "Deleted Note",
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
        backgroundColor: "#fff",
        zIndex: 1,
      },
    });

    render(<UndoToast />);
    expect(screen.getByText("Note deleted")).toBeInTheDocument();

    const undoButton = screen.getByText("Undo");
    fireEvent.click(undoButton);

    const state = useNotesStore.getState();
    expect(state.notes["123"]).toBeDefined();
    expect(state.lastDeletedNote).toBeNull();
  });

  it("auto-clears the deleted note after 5 seconds", () => {
    useNotesStore.setState({
      lastDeletedNote: {
        id: "123",
        textContent: "To disappear",
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
        backgroundColor: "#fff",
        zIndex: 1,
      },
    });

    render(<UndoToast />);
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const state = useNotesStore.getState();
    expect(state.lastDeletedNote).toBeNull();
  });
});
