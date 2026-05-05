import "./App.css";
import Board from "./components/Board/Board";

function App() {
  return (
    <>
      <small className="info-text">
        Double-click in an empty space to add a note or keep pressing click and drag
      </small>
      <Board />
    </>
  );
}

export default App;
