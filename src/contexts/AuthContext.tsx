import type { User } from "firebase/auth";
import { createContext} from "react";

interface AuthContextType {
  currentUser: User | null
  userLoggedIn: boolean
  loading: boolean
}

// Declara o useContext para AuthProvider
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userLoggedIn: false,
  loading: true  
});

