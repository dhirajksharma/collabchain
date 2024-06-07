import { useCookies } from "react-cookie";

const useAuth = (): boolean => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const jwtToken = cookies.token;
  return !!jwtToken;
};

export default useAuth;
