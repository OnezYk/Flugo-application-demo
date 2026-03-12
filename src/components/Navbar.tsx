// React
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Logos
import flugoLogo from '../assets/flugoLogo.png';
import flugoLogoSm from '../assets/mobileLogo.png';

// MUI assets
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

// Outros
import '../globals.css';

// Navbar
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // true quando media < 900px
  const isXSmall = useMediaQuery('(max-width: 500px)'); // true quando media < 500px

  return (
    <>
      {/* Condições de abertura navbar */}
      {(!isMobile || open) && 
      <>
      
      {/* Overlay para fechar tela clicando fora de foco */}
      <Box onClick={() => setOpen(false)} sx={{
        position: 'absolute',
        height: '100vh',
        width: '100vw',
      }}>
        <BigNav setOpen={() => isMobile && setOpen(false)} open={open} />
      </Box>

      </>
      }
      
      {/* Condição de aparição de ícone mobile */}
      {isMobile && (
        <Box 
          onClick={() => setOpen(p => !p)} 
          sx={{
            position: 'absolute', 
            top: 20, 
            left: !isXSmall ? {sm: 'calc(5% - 10px)', xs: 45} : 35,
            color: 'text.primary', 
            transition: 'all 0.3s ease',
            ':hover': {cursor: "pointer"}
          }}
        >
          <MenuRoundedIcon fontSize="large"/>
        </Box>
      )}
    </>
  )
}

// Estrutura navbar
const BigNav = ({open, setOpen} : {open:boolean, setOpen: () => void}) => {

  const theme = useTheme();
  const navigate = useNavigate();

  const isSmall = useMediaQuery(theme.breakpoints.down('lg')); // true quando media < 1200px
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // true quando media < 900px

  return (
    <Box onClick={(e) => e.stopPropagation()} sx={{
      position: 'absolute',
      zIndex: 10,
      bgcolor: 'white',
      height: '100vh',
      transition: 'all, 1s ease',
      overflow: 'hidden',
      width: isMobile || open ? '100px' : {lg: 300, md: 100, xs: 0},
      borderRight: (theme) => `1px dashed ${theme.palette.text.disabled}`
      }}> 

      <Box sx={{
        width: '300px',
        px: {lg: 3, xs: 0},
        py: 2,
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s'
      }}>
        <Box
          component="img"
          onClick={() => {navigate('/colaboradores'); setOpen()}}
          sx={{
            width: '100px',
            transition: 'all 0.2s',
            ':hover': {transform: 'scale(1.05)', cursor: 'pointer'},
            ':active': {transform: 'scale(0.95)'}
          }}
          // Alternação entre as duas logos de acordo com media
          src={isSmall ? flugoLogoSm : flugoLogo}
        />
      </Box>
      
      <Card setOpen={setOpen}>Colaboradores</Card>

    </Box> 
  )
}

const Card = ({children, setOpen}: {children:string, setOpen: () => void}) => {

  const navigate = useNavigate();
  const theme = useTheme();

  const isSmall = useMediaQuery(theme.breakpoints.down('lg')); // true quando media < 1200px

  return(
    <Box sx={{     
      height: '40px',
      display: "flex",
      borderRadius: 2,
      paddingLeft: 3,
      alignItems: "center",
      justifyContent: {lg: 'space-between'},
      color: "text.secondary",
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      ":hover": {cursor: 'pointer', paddingLeft: isSmall ? 3 : 4, bgcolor: (theme) => theme.palette.text.disabled}
    }}>
      <Box onClick={() => {navigate('/colaboradores'); setOpen()}} sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <AccountBoxIcon sx={{
          fontSize: isSmall ? 50 : 30
        }}/>
        {!isSmall && (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
              {children}
            </Typography>
            <KeyboardArrowRightRoundedIcon sx={{paddingLeft: 7, fontSize: 20, color: "text.secondary"}}/>
          </>
        )}
      </Box>
    </Box>
  )
}

export default Navbar;