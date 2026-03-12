import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { auth } from "../utils/db";
import { AuthContext } from "./AuthContext";

export function AuthProvider ({ children }: {children: ReactNode}) {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

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