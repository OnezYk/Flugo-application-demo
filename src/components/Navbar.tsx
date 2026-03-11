import { Box, Typography} from "@mui/material"
import flugoLogo from '../assets/flugoLogo.png'
import flugoLogoSm from '../assets/1200x630wa-Photoroom.png'

import '../globals.css'

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { useNavigate } from "react-router-dom";

import { useMediaQuery, useTheme } from '@mui/material'
import { useState } from "react"


const Navbar = () => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery('(max-width: 660px)')

  return (
    <>
      {(!isMobile || open) && 
      <>
      
      <Box onClick={() => setOpen(false)} sx={{
        position: 'absolute',
        height: '100vh',
        width: '100vw',
      }}>
        <BigNav setOpen={() => isMobile && setOpen(false)} open={open} />
      </Box>

      </>
      }
      
      {isMobile && (
        <Box 
          onClick={() => setOpen(p => !p)} 
          sx={{
            position: 'absolute', 
            top: 20, 
            left: !isSmall ? {sm: 'calc(5% - 10px)'} : 80,
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

export default Navbar


const BigNav = ({open, setOpen} : {open:boolean, setOpen: () => void}) => {

  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

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
          onClick={() => {navigate('/'); setOpen()}}
          sx={{
            width: '100px',
            transition: 'all 0.2s',
            ':hover': {transform: 'scale(1.05)', cursor: 'pointer'},
            ':active': {transform: 'scale(0.95)'}
          }}
          src={isSmall ? flugoLogoSm : flugoLogo}
        />
      </Box>
      
      <Card setOpen={setOpen}>
        Colaboradores
      </Card>

    </Box> 
  )
}

const Card = ({children, setOpen}: {children:string, setOpen: () => void}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('lg'))

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
      ":hover": {cursor: 'pointer', paddingLeft: isSmall ? 3 : 4, bgcolor: (theme) => theme.palette.text.disabled}
    }}>
      <Box onClick={() => {navigate('/'); setOpen()}} sx={{
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