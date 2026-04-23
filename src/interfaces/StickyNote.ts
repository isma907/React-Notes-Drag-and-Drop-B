export interface StickyNote {
    id: string;
    textContent: string;
    position: StickyNotePosition
}

export interface StickyNotePosition {
    x: number;
    y: number;
}