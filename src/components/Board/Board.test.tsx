import { fireEvent, render, screen } from "@testing-library/react";
import Board from "./Board";
import { useNotesStore } from "../../store/useNotes";

describe("Board integration", () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: {},
      lastZIndex: 0,
      toolbarConfig: { width: 200, height: 200 },
      lastDeletedNote: null,
    });
    localStorage.clear();
  });

  it("loads the app with no notes", () => {
    render(<Board />);

    expect(Object.keys(useNotesStore.getState().notes)).toHaveLength(0);
    expect(
      screen.queryByPlaceholderText("Write your note here..."),
    ).not.toBeInTheDocument();
  });

  it("creates a new note after double click", () => {
    const { container } = render(<Board />);
    const board = container.querySelector(".board");
    expect(board).toBeTruthy();

    Object.defineProperty(board!, "getBoundingClientRect", {
      value: () => ({
        left: 10,
        top: 20,
        right: 800,
        bottom: 600,
        width: 790,
        height: 580,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      }),
    });

    fireEvent.doubleClick(board!, { clientX: 110, clientY: 220 });

    const { notes } = useNotesStore.getState();
    expect(Object.keys(notes).length).toBe(1);
    expect(
      screen.getByPlaceholderText("Write your note here..."),
    ).toBeVisible();

    const note = Object.values(notes)[0];
    // x = 110 (clientX) - 10 (rect.left) - 100 (half width) = 0
    // y = 220 (clientY) - 20 (rect.top) - 100 (half height) = 100
    expect(note.position).toEqual({ x: 0, y: 100 });
  });
});
