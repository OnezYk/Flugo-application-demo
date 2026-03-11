// MUI
import { Box, Button, TextField, Typography } from '@mui/material'

// MUI Icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// Hooks
import { useState, type ReactNode } from 'react'
import MUISwitch from '../components/Switch';

type FormData ={
  nome: string
  email: string
  departamento: string
  status: boolean
}

type PassoProps = {
  passo: number
  form?: FormData
  setForm?: React.Dispatch<React.SetStateAction<FormData>>
  children?: React.ReactNode
}

const Formulario = () => {
  const [passo, setPasso] = useState(1)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    departamento: '',
    status: false
  })

  return (
    <>
      <Box sx={{
        m: 4,
        mr: 5,
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
          gridTemplateColumns: '97% 1fr',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Box sx={{
            position: 'relative',
            borderRadius: 2,
            height: '4px',
            bgcolor: 'success.light'
          }}>

            <Box sx={{
              height: '100%',
              position: 'absolute',
              bgcolor: 'success.main',
              transition: 'all 1s',
              width: `${passo == 1 ? '0%' : passo == 2 ? '50%' : '100%' }`
            }}>

            </Box>

          </Box>

          <Typography> 0% </Typography>

        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '15% 1fr',
          mt: 4
        }}>

        <StepTab passo={passo}/>
        {passo === 1 && <PassoUm form={form} setForm={setForm} passo={passo}/>}
        {passo === 2 && <PassoDois passo={passo}/>}
        {passo === 3 && <PassoTres passo={passo}/>}

        </Box>

      </Box>
      <Box>
      </Box>

      <Button onClick={() => setPasso(passo + 1)}>Próximo</Button>
      {passo > 1 && <Button onClick={() => setPasso(passo - 1)}>Voltar</Button>}
    </>
  )
}

//Seção de passos:
const PassoUm = ({form, setForm} : PassoProps) => {

  return (
    <PassoFrame title='Infos Básicas'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <InputField
          info="Título"
          value={form!.nome}
          onChange={(e) => setForm!(prev => ({ ...prev, nome: e.target.value }))}/>
        <InputField
          info="E-mail"
          value={form!.email}
          onChange={(e) => setForm!(prev => ({ ...prev, email: e.target.value }))}/>
      </Box>

      <Box sx={{
        mt: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <MUISwitch/>
        <Typography>Ativar ao criar</Typography>
      </Box>

    </PassoFrame>
  )

}

const PassoDois = ({form, setForm} : PassoProps) => {

  return (
    <PassoFrame title='Infos Profissionais'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <InputField
          info="Título"
          value={form!.nome}
          onChange={(e) => setForm!(prev => ({ ...prev, nome: e.target.value }))}/>
      </Box>

    </PassoFrame>
  )

}

const PassoTres = ({passo} : PassoProps) => {

  return (
    <PassoFrame passo={passo}></PassoFrame>
  )

}
//-----------------------------------------------------

//Corpo principal do formulário
const PassoFrame = ({children, title} : {children: ReactNode, title: string}) => {

  return (
    <Box sx={{
      minHeight: '500px',
    }}> 
    
      <Typography sx={{
        position: 'relative',
        bottom: 3,
        mb:3,
        fontWeight: 600,
        fontSize: 25,
        color: 'text.secondary'
      }}> 
      {title}
      </Typography> 

      {children}

    </Box>
  )

}

// Input de infos
const InputField = ({info, value, onChange} : {
  info: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <TextField
      label={info}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
    />
  )
}

// Barra lateral do formulário
const StepTab = ({passo} : PassoProps) => {

  return (
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
            bgcolor: `${passo == 1 ? 'text.disabled' : passo == 2 ? 'text.secondary' : 'success.main'}`,
            width: 2,
            minHeight: `${passo == 1 ? '100px' : passo == 2 ? '50px' : '0px'}`,
            ml: 1.5,
            transition: 'all 1s ease'
          }}></Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center'
              }}>
                {passo < 3 ?                   
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
                    transition: 'all 1s'
                  }}>2</Typography>
                :
                <CheckCircleRoundedIcon sx={{
                  fontSize: 32,
                  position: 'relative',
                  right: 2,
                  color: 'success.main'
                }}/>
                }
              
              </Box>
              <Typography sx={{
                fontWeight: '600',
                fontSize: '15px'
              }}>Infos Profissionais</Typography>
            </Box>

          </Box>
  )

}

export default Formulario