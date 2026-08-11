import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest, ENDPOINTS } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const response = await apiRequest(
        ENDPOINTS.currentUser,
        "GET"
      );

      console.log("Current user:", response);

      setUser(response.data);
    } catch (error) {
      // 401 simply means user is not logged in
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}