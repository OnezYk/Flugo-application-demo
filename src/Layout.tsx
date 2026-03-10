import { Avatar, Box } from "@mui/material";
import Navbar from "./components/Navbar.tsx"
import { Outlet } from "react-router-dom";
import { notionists } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";

const avatar = createAvatar(notionists, { 
  seed: 'Amanda',
  backgroundColor: ['2ec1f2']
 }).toDataUri();

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden"}}>
      
      <Navbar />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        
        <Box sx={{
          height: 80,
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 5,
        }}>
          <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};