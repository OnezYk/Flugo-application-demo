// React
import { Outlet } from "react-router-dom";

// MUI assets
import { Avatar, Box, useMediaQuery} from "@mui/material";

// Avatares
import { notionists } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";

// Componentes
import Navbar from "./components/Navbar.tsx";

// Criação de um avatar random
const avatar = createAvatar(notionists, { 
  seed: 'Amanda',
  backgroundColor: ['2ec1f2']
 }).toDataUri();

// Layout persistente entre páginas
const Layout = () => {

  const isXSmall = useMediaQuery('(max-width: 400px)');

  return (
    <Box sx={{ display: "flex", height: "100vh", width: isXSmall ? '125%' : '100%', overflow: "hidden", transform: isXSmall ? 'scale(0.8)' : 'scale(1)', position: 'relative', right: isXSmall ? 40 : 0}}>
      
      <Navbar />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1}}>
        
        <Box sx={{
          height: 80,
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          justifyContent:'flex-end',
          pl: 3,
          pr: 5
        }}>

          <Avatar src={avatar} sx={{ 
            width: 40,
            height: 40, 
            transition: 'all 0.2s', 
            mr: {sm: 0, xs: 2.5},
            ':hover': {transform: 'scale(1.15)',cursor: 'pointer'}, 
            ':active': {transform: 'scale(0.95)'
            
            }}} />
        </Box>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default Layout;