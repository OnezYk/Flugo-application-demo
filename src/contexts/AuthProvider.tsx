import { useEffect, useState, type ReactNode } from "react";

import { AuthContext } from "./AuthContext";

import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../utils/db";

// UseContext do JWT autentication do firebase.
export function AuthProvider ({ children }: {children: ReactNode}) {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ativa quando componente monta, ou em "authStateChanged" disparado pelo firebase  
  async function initializeUser (user : User | null) {

    if (user) {
      setCurrentUser({...user});
      setUserLoggedIn(true)
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, [])


  const value = {
    currentUser,
    userLoggedIn,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )

}