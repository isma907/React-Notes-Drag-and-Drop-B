# 📝 High-Performance Sticky Notes

A professional, senior-level Sticky Notes application built with **React**, **TypeScript**, and **Zustand**, focusing on extreme performance and scalable architecture.

## 🚀 Live Demo

[https://isma907.github.io/React-Notes-Drag-and-Drop/](https://isma907.github.io/React-Notes-Drag-and-Drop/)

---

## 🏛️ Architecture Description

The Sticky Notes application employs a highly decoupled, state-driven architecture built primarily around React and Zustand. At its core, the state management leverages a **normalized dictionary structure** (`Record<string, StickyNote>`) to maintain an immutable collection of note objects. By decoupling the global state from individual components and using atomic selectors, the application ensures that updates to a single note's content or bounds are persisted efficiently without forcing the entire application tree or the note list to re-render.

To ensure smooth 60fps performance, high-frequency user interactions such as dragging and resizing are **implemented natively** (without external libraries) and bypass the React render cycle entirely. Custom hooks (`useDrag` and `useResize`) mutate the DOM directly via refs using **CSS GPU-accelerated transforms**, syncing the final values back to the store only upon completion (i.e., pointer up). This hybrid approach combines the predictability of a centralized state with the raw performance of direct DOM manipulation.

Finally, user experience and data safety are baked directly into the design. Persistence is achieved natively through Zustand's middleware, syncing the notes map to `localStorage`. Rather than relying on intrusive confirmation modals, the application implements an **optimistic UI pattern**: dropping a note on the trash deletes it instantly, but an ephemeral `UndoToast` allows the user to restore the last deleted note within a 5-second window, achieving a perfect balance between immediate feedback and accidental deletion affordance.

---

## ✨ Key Features

- **Multiple Creation Methods**: Generate new notes by **double-clicking** anywhere on the empty board (centered at cursor) or by using the **floating ToolBar**.
- Creation by **Press Click and Drag** in board - Live Coding technical interview feature.
- **Dynamic Interactions**: Drag and drop notes using the top handler and resize them from the bottom-right corner.
- **Smart Stacking**: Interacting with any note automatically brings it to the front (`z-index` management).
- **Undo System**: Deleted a note by mistake? Use the **Undo Toast** to restore it instantly within 5 seconds.
- **Boundary Enforcement**: Notes are strictly constrained within the board limits, preventing them from being dragged or created off-screen.
- **Auto-Persistence**: All changes are automatically saved to `localStorage`.

---

## ⚡ Performance Optimizations

- **O(1) State Lookups**: Refactored the state from an array to a Record/Dictionary. This ensures that deletions, updates, and "bring to front" operations run in constant time regardless of the number of notes.
- **GPU Acceleration**: Dragging uses `transform: translate(x, y)` to avoid browser layout reflows, ensuring smooth movement even on low-end devices.
- **Shallow Selectors**: The main `NotesList` component only tracks note keys, preventing a full list re-render when a single note's content changes.
- **Pointer Capture**: Uses `setPointerCapture` to maintain stable interactions even when the mouse moves faster than the element.

---

## 📦 Tech Stack

- **Framework**: React 19 + Vite
- **State Management**: Zustand (with Persist & Devtools)
- **Styling**: Vanilla CSS (Modern CSS variables & animations)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

---

## 🛠️ Installation & Build

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run development server**:
   ```bash
   npm run dev
   ```
3. **Run tests**:
   ```bash
   npm run test
   ```
