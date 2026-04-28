import { useEffect, useState } from "react";
import {
  STICKY_NOTE_MIN_WIDTH,
  STICKY_NOTE_MAX_WIDTH,
  STICKY_NOTE_MIN_HEIGHT,
  STICKY_NOTE_MAX_HEIGHT,
} from "../../constants/stickyNotes.constants";
import { useNotesStore } from "../../store/useNotes";
import "./ToolBar.css";

const DEBOUNCE_MS = 500;

export const ToolBar = () => {
  const toolbarConfig = useNotesStore((s) => s.toolbarConfig);
  const updateToolbarConfig = useNotesStore((s) => s.updateToolbarConfig);
  const createNote = useNotesStore((s) => s.createNote);

  const [width, setWidth] = useState<number>(toolbarConfig.width);
  const [height, setHeight] = useState<number>(toolbarConfig.height);

  useEffect(() => {
    const id = setTimeout(() => {
      updateToolbarConfig({ width });
    }, DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [width, updateToolbarConfig]);

  useEffect(() => {
    const id = setTimeout(() => {
      updateToolbarConfig({ height });
    }, DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [height, updateToolbarConfig]);

  const handleCreateNote = () => {
    // Create note near the center of the screen
    createNote({ x: window.innerWidth / 2 - width / 2, y: window.innerHeight / 2 - height / 2 });
  };

  return (
    <section className="toolbar">
      <div>
        <div className="toolbar-slidecontainer">
          <label htmlFor="width" className="toolbar-label">
            Width: {width}px
          </label>
          <input
            type="range"
            id="width"
            min={STICKY_NOTE_MIN_WIDTH}
            max={STICKY_NOTE_MAX_WIDTH}
            className="toolbar-slider"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>

        <div className="toolbar-slidecontainer">
          <label htmlFor="height" className="toolbar-label">
            Height: {height}px
          </label>
          <input
            type="range"
            id="height"
            min={STICKY_NOTE_MIN_HEIGHT}
            max={STICKY_NOTE_MAX_HEIGHT}
            className="toolbar-slider"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
        <button className="toolbar-create-btn" onClick={handleCreateNote}>
          Create Note
        </button>
      </div>
    </section>
  );
};
