import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { auth } from "../utils/db";

export function useAuth() {
  return useContext(AuthContext)
}

export function doSignOut() {
  return auth.signOut();
}