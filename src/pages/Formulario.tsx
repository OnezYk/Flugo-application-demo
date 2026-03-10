import { Box, Button, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useState } from 'react'

const Formulario = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    departamento: '',
    status: 'Ativo'
  })

  return (
    <>
      <Box>
        <stepCounter passo={step}/>
        {step === 1 && <PassoUm passo={step}/>}
        {step === 2 && <PassoDois />}
        {step === 3 && <PassoTres />}
      </Box>

      <Button onClick={() => setStep(step + 1)}>Próximo</Button>
      {step > 1 && <Button onClick={() => setStep(step - 1)}>Voltar</Button>}
    </>
  )
}

const PassoUm = ({passo} : {passo:number}) => {

  return (
    <PassoFrame passo={passo}></PassoFrame>
  )

}

const PassoDois = ({passo} : {passo:number}) => {

  return (
    <PassoFrame passo={passo}></PassoFrame>
  )

}

const PassoTres = ({passo} : {passo:number}) => {

  return (
    <PassoFrame passo={passo}></PassoFrame>
  )

}

const PassoFrame = ({passo}: {passo:number}) => {

  console.log(passo)

  return (
      <Box sx={{
        m: 4,
        display: 'flex',
        flexDirection: 'column',
        color: 'text.primary',
      }}>
        <Typography sx={{
          fontWeight: 600,
        }}>Colaboradores
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 400 }}>
          •
          </Typography>
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 600 }}>Cadastrar colaborador</Typography>
      
        </Typography>
        
        <Box sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: '93% 6%',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Box sx={{
            borderRadius: 2,
            height: '4px',
            bgcolor: 'success.light'
          }}></Box>

          <Typography> 0% </Typography>

        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '15% 1fr',
          mt: 4
        }}>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>

          {
          passo == 1 ? 
            <Box sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center'
            }}>

                <Typography color='primary.contrastText' sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.main',
                  borderRadius: '50%',
                  fontWeight: '600',
                  width: 27,
                  height: 27,
                  textAlign: 'center',
                }}>1</Typography> 
                
            </Box>

          :
          <CheckCircleRoundedIcon sx={{
            fontSize: 32,
            position: 'relative',
            right: 2,
            color: 'success.main'
          }}/>
          }


            <Typography sx={{
              fontWeight: '600',
              fontSize: '15px'
            }}>Infos Básicas</Typography>

          </Box>
          
          <Box sx={{
            bgcolor: 'text.disabled',
            width: 2,
            minHeight: `${passo == 1 ? '100px' : '50px'}`,
            ml: 1.5,
            transition: 'all 1s ease'
          }}></Box>

            <Box sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center'
            }}>

                <Typography sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${passo == 1 ? 'text.disabled' : 'success.main'}`,
                  color:  `${passo == 1 ? 'text.secondary' : 'primary.contrastText'}`,
                  fontWeight: '600',
                  borderRadius: '50%',
                  width: 27,
                  height: 27,
                  textAlign: 'center',
                }}>2</Typography> 
                
            </Box>

          </Box>

          <Box>RECEBIDO COMO CHILDREN</Box>

        </Box>

      </Box>
  )

}
export default Formulario