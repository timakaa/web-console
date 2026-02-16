import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import { ScreenSocketProvider } from "./context/ScreenSocketContext";
import Home from "./pages/Home";
import Screen from "./pages/Screen";
import Controller from "./pages/Controller";
import GameRepository from "./pages/GameRepository";

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <ScreenSocketProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/screen/:roomCode' element={<Screen />} />
            <Route path='/controller' element={<Controller />} />
            <Route
              path='/game-repository/:roomCode'
              element={<GameRepository />}
            />
          </Routes>
        </ScreenSocketProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
