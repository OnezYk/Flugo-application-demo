import { Box, Avatar, Button } from '@mui/material'
import { useState } from 'react'

// Avatares
import { notionists } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";
import { doSignOut } from '../hooks/useAuth';

// Criação de um avatar random
const avatar = createAvatar(notionists, { 
  seed: 'Amanda',
  backgroundColor: ['2ec1f2']
 }).toDataUri();

const Profile = () => {

  const [open, setOpen] = useState (false)

  return (
    <>

    {open && 
    <Box onClick={() => setOpen(false)} sx={{width: '100vw', height: '100vh', position: 'absolute', zIndex: '10'}}></Box>
    }

    <FloatingTab open={open}/>

    <Box sx={{
      position: 'relative',
      height: 80,
      minHeight: 80,
      display: "flex",
      alignItems: "center",
      justifyContent:'flex-end',
      pl: 3,
      pr: 5
    }}>
      
      <Avatar onClick={() => setOpen(p => !p)} src={avatar} sx={{ 
        width: 40,
        height: 40, 
        transition: 'all 0.2s', 
        mr: {sm: 0, xs: 2.5},
        ':hover': {transform: 'scale(1.15)',cursor: 'pointer'}, 
        ':active': {transform: 'scale(0.95)'
        
        }}} />
    </Box>
    </>
  )
}

export default Profile

const FloatingTab = ({open}: {open:boolean}) => {

  return (

    <>
        <Box onClick={(e) => e.stopPropagation()} sx={{
          position:'absolute',
          overflow: 'hidden',
          width: open ? 170 : 0, height:open ? 40 : 0, top:45, right: 70,
          zIndex: '15',
          bgcolor: 'text.disabled',
          borderRadius: 2,
          boxShadow: 4,
          transition: 'all 0.3s ease'
        }}>
          <Button onClick={doSignOut} sx={{width: '100%', color:'text.primary'}}>
            Desconectar?
          </Button>
        </Box>
    </>

  )

}