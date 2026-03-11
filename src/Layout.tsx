import { Avatar, Box, useMediaQuery} from "@mui/material";
import Navbar from "./components/Navbar.tsx"
import { Outlet } from "react-router-dom";
import { notionists } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";

const avatar = createAvatar(notionists, { 
  seed: 'Amanda',
  backgroundColor: ['2ec1f2']
 }).toDataUri();

export const Layout = () => {

  const isSmall = useMediaQuery('(max-width: 660px)')

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden"}}>
      

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
            mr: !isSmall ? 0 : 7,
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