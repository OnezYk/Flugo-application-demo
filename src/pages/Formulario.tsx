// MUI
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme, type SelectChangeEvent } from '@mui/material'

// MUI Icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// Hooks
import React, { useState, type ReactNode } from 'react'
import MUISwitch from '../components/Switch';
import PrimaryBtn from '../components/PrimaryBtn';
import { useNavigate } from 'react-router-dom';
import { postColaborador } from '../utils/postColaborador';

export type FormData ={
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

type PassoUmProps = PassoProps & {
  erroEmail: boolean
}

const Formulario = () => {
  const [passo, setPasso] = useState(1)
  const [erroEmail, setErroEmail] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    departamento: '',
    status: false
  })

  const isValidEmail = (email:string) => /^\S+[@]\S+(\.\S+)+$/.test(email)
  const isValidNome = (nome: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(nome)
  
  const isValid = () => {
    if (passo === 1) return isValidNome(form.nome) && isValidEmail(form.email)
    if (passo === 2) return form.departamento !== ''
    return true
  }

  const handleClick = () => {
    if(!isValidEmail(form.email)) {
      setErroEmail(true)
    }
  }

  const navigate = useNavigate()

  const handleSubmit = async () => {
    await postColaborador(form);
    return navigate("/");
  }

  return (
    <>
      <Box sx={{
        m: 4,
        mr: 5,
        ml: {lg: '340px', md: '140px', xs: '40px'},
        display: 'flex',
        flexDirection: 'column',
        color: 'text.primary',
      }}>
        <Typography sx={{
          fontWeight: 600,
          textAlign: {sm: 'start', xs: 'center'},
        }}>Colaboradores
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 400 }}>
          •
          </Typography>
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 600 }}>Cadastrar colaborador</Typography>
      
        </Typography>
        
        <Box sx={{
          mt: 2,
          display: {sm:'grid'},
          gridTemplateColumns: {sm: '97% 1fr'},
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

          <Typography sx={{textAlign: 'center'}}> { passo == 1 ? '0%' : passo == 2 ? '50%' : '100%' } </Typography>

        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {sm: '200px 1fr', xs: '1fr'},
          gridTemplateRows: {sm: 'auto', xs: '200px, 200px'},
          mt: 4
        }}>

        <StepTab passo={passo}/>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>

          {passo === 1 && <PassoUm erroEmail={erroEmail} form={form} setForm={setForm} passo={passo}/>}
          {passo === 2 && <PassoDois form={form} setForm={setForm} passo={passo}/>}
          {passo === 3 && <PassoTres/>}

          <Box  sx={{
            display: 'flex',
            justifyContent: passo > 1 ? 'space-between' : 'end',
            mt: 4
          }}>
            {passo > 1 && <Button sx={{color:'text.primary', fontWeight: 600}} onClick={() => setPasso(passo - 1)}>Voltar</Button>}
            <Box onClick={handleClick}>
              {
              passo < 3 ? <PrimaryBtn disabled={!isValid()} onClick={() => setPasso(passo + 1)}>Próximo</PrimaryBtn> 
              :
              <Box onClick={handleSubmit}>
                <PrimaryBtn disabled={!isValid()} onClick={() => setPasso(passo + 1)}>Concluir</PrimaryBtn> 
              </Box>
              }
            </Box>
          </Box>

        </Box>

        </Box>

      </Box>

    </>
  )
}

//Seção de passos:
const PassoUm = ({form, setForm, erroEmail} : PassoUmProps) => {

  const [nomeError, setNomeError] = useState(false)
  const nameNegator = /[^a-zA-ZÀ-ÿ\s]/g

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
        error={nomeError}
        errorCall='Caractere inválido'
        onChange={(e) => {
          const val = e.target.value;
          setNomeError(/[^a-zA-ZÀ-ÿ\s]/.test(val))
          setForm!(prev => ({ ...prev, nome: e.target.value.replace(nameNegator, '') }));
          }}/>
        <InputField
          info="E-mail"
          value={form!.email}
          error={erroEmail}
          errorCall='Insira um e-mail válido!'
          onChange={(e) => {
            setForm!(prev => ({ ...prev, email: e.target.value }));
          }}/>
      </Box>

      <Box sx={{
        mt: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>

      <Box onClick={() => setForm!(prev => ({ ...prev, status: !prev.status }))}>
        <MUISwitch/>
      </Box>
        <Typography>Ativar ao criar</Typography>
      </Box>

    </PassoFrame>
  )

}

const PassoDois = ({setForm, form} : PassoProps) => {

  return (
    <PassoFrame title='Infos Profissionais'>
      <InputSelect value={form!.departamento} onChange={(e) => setForm!(prev => ({ ...prev, departamento: e.target.value }))}/>
    </PassoFrame>
  )

}

const PassoTres = () => {

  return (
    <PassoFrame title='Parabéns!'>
      <Typography sx={{
        fontWeight: '600',
        textAlign: {sm: 'start', xs: 'center'}
      }}>Cadastro realizado com sucesso!</Typography>
    </PassoFrame>
  )

}

//-----------------------------------------------------

//Corpo principal do formulário
const PassoFrame = ({children, title} : {children: ReactNode, title?: string}) => {

  return (
    <Box sx={{
      minHeight: {sm:'400px', xs:'300'},
    }}> 
    
      <Typography sx={{
        position: 'relative',
        bottom: 3,
        mb:4,
        fontWeight: 600,
        fontSize: 25,
        color: 'text.secondary',
        textAlign: {sm: 'start', xs: 'center'}
      }}> 
      {title}
      </Typography> 

      {children}

    </Box>
  )

}

// Input de infos
const InputField = ({info, value, onChange, error, errorCall} : {
  info: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error: boolean,
  errorCall: string
}) => {
  return (
    <TextField
      label={info}
      variant="outlined"
      fullWidth
      error={error}
      helperText={error ? errorCall : ''}
      autoComplete='off'
      value={value}
      onChange={onChange}
    />
  )
}

// Input select MUI
const InputSelect = ({onChange, value} : {onChange: (e: SelectChangeEvent) => void, value: string}) => {

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Departamento"
          onChange={handleChange}
        >
          <MenuItem value={"Design"}>Design</MenuItem>
          <MenuItem value={"TI"}>TI</MenuItem>
          <MenuItem value={"Marketing"}>Marketing</MenuItem>
          <MenuItem value={"Produto"}>Produto</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

// Barra lateral do formulário
const StepTab = ({passo} : PassoProps) => {
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
              <Box sx={{
            display: 'flex',
            flexDirection: {sm: 'column', xs: 'row'},
            gap: {sm: 1, xs: 15},
            mb: {sm:0, xs:3}
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
          
          {!isMobile &&
            <Box sx={{
              bgcolor: `${passo == 1 ? 'text.disabled' : passo == 2 ? 'text.secondary' : 'success.main'}`,
              width: 2,
              minHeight: `${passo == 1 ? '100px' : passo == 2 ? '50px' : '0px'}`,
              ml: 1.5,
              transition: 'all 1s ease'
            }}></Box>          
            }

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