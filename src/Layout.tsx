// React
import {Outlet} from "react-router-dom";

// MUI assets
import {Box} from "@mui/material";

// Componentes
import Navbar from "./components/Navbar.tsx";
import Profile from "./components/Profile.tsx";

// Layout persistente entre páginas
const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Navbar />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <Profile />

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
