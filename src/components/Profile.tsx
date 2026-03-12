import { Box, Avatar } from '@mui/material'
import React, { useState } from 'react'

// Avatares
import { notionists } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";

// Criação de um avatar random
const avatar = createAvatar(notionists, { 
  seed: 'Amanda',
  backgroundColor: ['2ec1f2']
 }).toDataUri();

const Profile = () => {

  const [open, setOpen] = useState(false)

  return (
        <Box onClick={() => setOpen(p => !p)} sx={{
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
  )
}

export default Profile