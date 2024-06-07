import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import PageNotFound from "./pages/404Page";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import Welcome from "./pages/Welcome";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verifymail/:id" element={<VerifyEmail />} />
          <Route path="password/reset/:id" element={<ResetPassword />} />
          <Route element={<ProtectedRoutes />} path="/">
            <Route element={<Home />} path="app/*" index={true} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
