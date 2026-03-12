// React
import { Outlet } from "react-router-dom";

// MUI assets
import { Box, useMediaQuery} from "@mui/material";



// Componentes
import Navbar from "./components/Navbar.tsx";
import Profile from "./components/Profile.tsx";


// Layout persistente entre páginas
const Layout = () => {

  const isXSmall = useMediaQuery('(max-width: 400px)');

  return (
    <Box sx={{ display: "flex", height: "100vh", width: isXSmall ? '125%' : '100%', overflow: "hidden", transform: isXSmall ? 'scale(0.8)' : 'scale(1)', position: 'relative', right: isXSmall ? 40 : 0}}>
      
      <Navbar />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1}}>
        
        <Profile/>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default Layout;