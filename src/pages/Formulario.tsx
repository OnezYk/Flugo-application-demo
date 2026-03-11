// React
import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Assets
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme, type SelectChangeEvent } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// Componentes
import MUISwitch from '../components/Switch';
import PrimaryBtn from '../components/PrimaryBtn';

// AOS Animation
import AOS from 'aos';
import 'aos/dist/aos.css';

// Routes
import { postColaborador } from '../utils/postColaborador';

// Export da FormData
export type FormData ={
  nome: string,
  email: string,
  departamento: string,
  status: boolean
}

// Criação de tipo flexível, reduzindo código verboso
type PassoProps = {
  passo: number,
  form?: FormData,
  setForm?: React.Dispatch<React.SetStateAction<FormData>>,
  children?: React.ReactNode
}

// Extensão para se encaixar ao PassoUm
type PassoUmProps = PassoProps & {
  erroEmail: boolean,
  erroNome: boolean
}

// Formulário
const Formulario = () => {

  const [passo, setPasso] = useState(1);
  const [erroEmail, setErroEmail] = useState(false);
  const [erroNome, setErroNome] = useState(false);

  const navigate = useNavigate();

  // Inicialização de form como obj
  const [form, setForm] = useState({
    nome: '',
    email: '',
    departamento: '',
    status: false
  });

  // Testes de regex para prevenção de inputs indesejados
  const isValidEmail = (email:string) => /^\S+[@]\S+(\.\S+)+$/.test(email);
  const isValidNome = (nome: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(nome);
  
  const isValid = () => {
    if (passo === 1) return isValidNome(form.nome) && isValidEmail(form.email);
    if (passo === 2) return form.departamento !== '';
    return true
  };

  // Caso clique com o botão ainda desabilitado
  const handleClick = () => {

    if(!isValidEmail(form.email)) {

      setErroEmail(true);
      setTimeout(() => {
        setErroEmail(false)
      }, 3000)

    }

    if (!isValidNome(form.nome)) {

      setErroNome(true);
      setTimeout(() => {
        setErroNome(false)
      }, 3000)

    }

  };

  // Handle do POST ao Firebase após "Concluido" 
  const handleSubmit = async () => {
    await postColaborador(form);
    return navigate("/");
  }

  // Inicialização da biblioteca de animação
  useEffect(() => {
    AOS.init()
  }, [])

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
        <Typography data-aos="fade-right" data-aos-duration='500' sx={{
          fontWeight: 600,
          textAlign: {sm: 'start', xs: 'center'},
        }}>Colaboradores
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 400 }}>
          •
          </Typography>
          <Typography component="span" sx={{ml: 2, color: 'text.secondary', fontWeight: 600 }}>Cadastrar colaborador</Typography>
      
        </Typography>
        
        <Box data-aos="fade-in" data-aos-duration="800" sx={{
          mt: 2,
          display: {sm:'grid'},
          gridTemplateColumns: {sm: '97% 1fr'},
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>

          {/* Barra de progresso */}
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
          {/* ------------------- */}

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

        {/* Índice de passo atual */}
        <StepTab passo={passo}/>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* Display dinâmico de acordo com "passo" para formulário */}
          {passo === 1 && <PassoUm erroEmail={erroEmail} erroNome={erroNome} form={form} setForm={setForm} passo={passo}/>}
          {passo === 2 && <PassoDois form={form} setForm={setForm} passo={passo}/>}
          {passo === 3 && <PassoTres/>}

          <Box  sx={{
            display: 'flex',
            justifyContent: passo > 1 ? 'space-between' : 'end',
            mt: 4
          }}>

            {/* Botões */}
            {passo > 1 && // Se user em passo 2+
            <Button sx={{color:'text.primary', fontWeight: 600}} onClick={() => setPasso(passo - 1)}>Voltar</Button>}
            <Box onClick={handleClick}>
              {passo < 3 ? // Se em passo < 3
              <Box data-aos="fade-in" data-aos-duration="500" data-aos-delay="150">
                <PrimaryBtn disabled={!isValid()} onClick={() => setPasso(passo + 1)}>Próximo</PrimaryBtn>
              </Box>
              : // Se estiver em passo > 3 (display do botão "Concluir" ) 
              <Box onClick={handleSubmit}>
                <PrimaryBtn disabled={!isValid()} onClick={() => setPasso(passo + 1)}>Concluir</PrimaryBtn> 
              </Box>
              }
            {/* ------------------------- */}

            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </>
  )
}

//Seção de passos:
const PassoUm = ({form, setForm, erroEmail, erroNome} : PassoUmProps) => {

  const [nomeError, setNomeError] = useState(false);
  const nameNegator = /[^a-zA-ZÀ-ÿ\s]/g;

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
        error={erroNome || nomeError}
        errorCall={erroNome ? 'Insira um nome' : 'caractere inválido'}
        // Ao digitar, insere valor em val e testa de imediato para prever erro
        onChange={(e) => {
          const val = e.target.value;
          setNomeError(/[^a-zA-ZÀ-ÿ\s]/.test(val))
          // Spread do obj formulário, alterando para e.target, não permitindo caracteres especiais (nameNegator)
          setForm!(prev => ({ ...prev, nome: e.target.value.replace(nameNegator, '') }));
          }}/>

        <InputField
          info="E-mail"
          value={form!.email}
          error={erroEmail}
          errorCall='Insira um e-mail válido!'
          // Mesma lógica em input de nome..
          onChange={(e) => {
            const emailInput = e.target.value.toLocaleLowerCase();
            setForm!(prev => ({ ...prev, email: emailInput }));
          }}/>

      </Box>

      <Box sx={{
        mt: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>

      {/* Switch atualiza o valor de status alternadamente p => !p */}
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
      {/* Foi necessário PropLifting para não ter conflito de eventos no componente */}
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
    <Box data-aos="fade-in" data-aos-duration="500" data-aos-delay="150" sx={{
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

// Input de infos (text)
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

// Input de infos (select)
const InputSelect = ({onChange, value} : {onChange: (e: SelectChangeEvent) => void, value: string}) => {

  // Disparando o evento ao parent
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="select-label">Departamento</InputLabel>
        <Select
          labelId="select-label"
          id="select"
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

// Componente índice de passo atual
const StepTab = ({passo} : PassoProps) => {
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // True se media < 600px 

  return (
          <Box data-aos="fade-right" data-aos-duration="500" data-aos-delay="100" sx={{
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

export default Formulario;