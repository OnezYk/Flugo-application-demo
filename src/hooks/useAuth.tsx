import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../utils/db";

// Facilita import de AuthProvider nos componentes
export function useAuth() {
  return useContext(AuthContext)
};

// Método para logout do firebase
export function doSignOut() {
  return auth.signOut();
};