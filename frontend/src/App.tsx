import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../src/context/UserContext";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import PageNotFound from "./pages/404Page";
import SideMenu from "./components/SideMenu";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";

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
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route element={<ProtectedRoutes />} path="/">
              <Route element={<Home />} path="app/*" index={true} />
              {/* <Route element={<Profile />} path="app/profile" /> */}
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

// const ProtectedApp: React.FC = () => {
//   // Your entire application can be rendered inside this component
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route exact path="/" component={Home} />
//         {/* Add more routes for different pages of your application */}
//       </Routes>
//     </BrowserRouter>
//   );
// };

export default App;
