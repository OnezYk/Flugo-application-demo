import { Box, Typography } from '@mui/material'
import PrimaryBtn from '../components/PrimaryBtn'

const NotFound = () => {
  return (
    <Box sx={{bgcolor: 'text.disabled', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{width: 700,display: 'flex', flexDirection: 'column', gap: 3, color: 'text.primary', justifyContent: 'center', alignItems: 'center'}}>
        <Typography sx={{color: 'text.secondary', textAlign: 'center', fontWeight: 600, fontSize: 20}}>404 Não Encontrado</Typography>
        <Typography variant='h2' fontSize='sm' sx={{fontWeight: 600, fontSize: 50, mt:1, textAlign: 'center'}}>Oops! Página não encontrada</Typography>
        <Typography sx={{color: 'text.secondary', textAlign: 'center', fontSize: 25, wordBreak: 'break-word', mb: 7}}>A página que você está procurando não existe. Clique no botão abaixo para voltar ao página inicial</Typography>
        <Box sx={{width: 250}}>
          <PrimaryBtn fullWidth={true} to='/colaboradores'>Voltar à tela inicial</PrimaryBtn>
        </Box>
      </Box>
    </Box>
  )
}

export default NotFound