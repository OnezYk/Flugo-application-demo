import { Box, Typography } from "@mui/material"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"

export function TestPage() {
  const { userLoggedIn, loading } = useAuth()

  console.log('loading:', loading)
  console.log('userLoggedIn:', userLoggedIn)

  if (loading) return <div>Carregando...</div>
  if (!userLoggedIn) return <Navigate to="/login" />

  return (

  <Typography variant="body1" sx={{ fontSize: '20px' }}>aaa</Typography>

  )
}