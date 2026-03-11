import { Box, Typography} from "@mui/material"
import flugoLogo from '../assets/flugoLogo.png'

import '../globals.css'

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate()

  return (
    <Box sx={{
      minWidth: 300,
      borderRight: (theme) => `1px dashed ${theme.palette.text.disabled}`
    }}> 

    <Box sx={{
      padding: 3,
    }}>
      <img src={flugoLogo} className="imgCover" onClick={()=> navigate("/")}/>
    </Box>
    
    <Card>
      Colaboradores
    </Card>

    </Box>
  )
}

export default Navbar

const Card = ({children}: {children:string}) => {
  const navigate = useNavigate()

  return(
    <Box sx={{     
      height: '40px',
      display: "flex",
      borderRadius: 2,
      paddingLeft: 3,
      alignItems: "center",
      justifyContent: "space-between",
      color: "text.secondary",
      transition: 'all 0.2s ease',
      ":hover": {cursor: 'pointer', paddingLeft: 4 , bgcolor: (theme) => theme.palette.text.disabled}
    }}>
      <Box onClick={() => navigate('/')} sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <AccountBoxIcon/>
        <Typography sx={{
          fontWeight: 600,
          fontSize: '16px'
        }}>
            {children}
        </Typography>
      <KeyboardArrowRightRoundedIcon sx={{paddingLeft: 7, fontSize: 20, color: "text.secondary"}}/>
      </Box>
    </Box>
  )
}