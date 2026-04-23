import { STICKY_NOTE_MIN_HEIGHT, STICKY_NOTE_MIN_WIDTH } from "../constants/stickyNotes.constants";
import type { StickyNote, StickyNotePosition } from "../interfaces/StickyNote";

export const generateColor = (): string => {
    const color = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");

    return `#${color}`;
};


export const createStickyNote = (position: StickyNotePosition): StickyNote => {
    return {
        id: crypto.randomUUID(),
        textContent: "",
        position,
        backgroundColor: generateColor(),
        size: {
            width: STICKY_NOTE_MIN_WIDTH,
            height: STICKY_NOTE_MIN_HEIGHT,
        }
    }
}