import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../src/context/UserContext";
import { useEffect, useState } from "react";
import PageNotFound from "./pages/404Page";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import MainFeed from "./pages/MainFeed";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (jwtToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<MainFeed />} /> */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route element={<ProtectedRoutes />} path="/">
              <Route element={<Home />} path="app/*" index={true} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
