export interface StickyNote {
  id: string;
  textContent: string;
  backgroundColor: string;
  position: StickyNotePosition;
  size?: StickyNoteSize;
}

export interface StickyNotePosition {
  x: number;
  y: number;
}

export interface StickyNoteSize {
  width: number;
  height: number;
}
