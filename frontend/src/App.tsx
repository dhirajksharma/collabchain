import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="app">
          <Route index element={<Navigate to="home/dashboard" replace />} />
          <Route path="home/dashboard" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
