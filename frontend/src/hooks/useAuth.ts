const useAuth = (): boolean => {
  const jwtToken = localStorage.getItem("authToken");
  return !!jwtToken;
};

export default useAuth;
