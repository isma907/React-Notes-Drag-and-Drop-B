export interface StickyNote {
    id: string;
    textContent: string;
    backgroundColor: string;
    position: StickyNotePosition,
    size?: SticyNoteSize;
}

export interface StickyNotePosition {
    x: number;
    y: number;
}

export interface SticyNoteSize {
    width: number;
    height: number;
}