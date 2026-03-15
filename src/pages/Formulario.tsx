// React
import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Assets
import { Box, Button, Fade, Typography, useMediaQuery, useTheme} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// Componentes
import MUISwitch from '../components/Switch';
import PrimaryBtn from '../components/PrimaryBtn';
import InputField from '../components/InputField';
import InputSelect from '../components/InputSelect';

// AOS Animation
import AOS from 'aos';
import 'aos/dist/aos.css';

// Routes
import { postColaborador } from '../utils/postColaborador';
import { getDepartamentos } from '../utils/routesDepartamento';

// Hooks
import { useForm } from '../hooks/useForm';

// Export da FormData
export type ColaboradorFormData = {
  nome: string,
  email: string,
  departamento: string,
  cargo: string,
  senioridade: string,
  salarioBase: number,
  dataDeAdmissao: Date,
  status: boolean
}

// Criação de tipo flexível, reduzindo código verboso
type PassoProps = {
  passo: number,
  form?: ColaboradorFormData,
  setForm?: React.Dispatch<React.SetStateAction<ColaboradorFormData>>,
  children?: React.ReactNode,
  fireErrorBtn: boolean,
  departamentos?: string[]
}

type StepProps = {
  passo:number
}

// Formulário
const Formulario = () => {

  const [passo, setPasso] = useState(1);
  const [fireErrorBtn, setFireErrorBtn] = useState(false);

  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [exitAnimation, setExitAnimation] = useState(true);
 
  const navigate = useNavigate();

  // Inicialização de form como obj
  const [form, setForm] = useState({
    nome: '',
    email: '',
    departamento: '',
    cargo: '',
    senioridade: '',
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false
  });

  // Testes de regex para prevenção de inputs indesejados

  const {isValid} = useForm(form)

  // Caso clique com o botão ainda desabilitado
  const handleClick = () => {

      setFireErrorBtn(true);
      setTimeout(() => {
        setFireErrorBtn(false)
      }, 1500)

  };

  // Handle do POST ao Firebase após "Concluido" 
  const handleSubmit = async () => {
    await postColaborador(form);
    setExitAnimation(false);
    setTimeout(() => {
      return navigate("/colaboradores");
    }, 500)
  }

  // Inicialização da biblioteca de animação
  useEffect(() => {
    getDepartamentos().then(data => 
      setDepartamentos(data.map(e => e.nome))
    )
    AOS.init()
  }, [])

  return (
    <Fade in={exitAnimation} timeout={500}>
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
          {passo === 1 && <PassoUm fireErrorBtn={fireErrorBtn} form={form} setForm={setForm} passo={passo}/>}
          {passo === 2 && <PassoDois departamentos={departamentos} fireErrorBtn={fireErrorBtn} form={form} setForm={setForm} passo={passo}/>}
          {passo === 3 && <PassoTres/>}

          <Box  sx={{
            display: 'flex',
            justifyContent: passo > 1 ? 'space-between' : 'end',
            mt: 4
          }}>

            {/* Botões */}
            {passo > 1 && // Se user em passo 2+
            <Button sx={{color:'text.primary', fontWeight: 600}} onClick={() => setPasso(passo - 1)}>Voltar</Button>}
            <Box onClick={() => console.log("clicked")}>
              {passo < 3 ? // Se em passo < 3
              <Fade in={true} timeout={500}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <PrimaryBtn disabled={!isValid} onClick={() => isValid && setPasso(passo + 1)}>
                    Próximo
                  </PrimaryBtn>
                  {!isValid && (
                    <Box
                      onClick={handleClick}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        cursor: 'not-allowed',
                      }}
                    />
                  )}
                </Box>
              </Fade>
              : // Se estiver em passo > 3 (display do botão "Concluir" ) 
                <PrimaryBtn disabled={!isValid} onClick={handleSubmit}>Concluir</PrimaryBtn>
                }
            {/* ------------------------- */}

            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </Fade>
  )
}

//Seção de passos:
const PassoUm = ({form, setForm, fireErrorBtn} : PassoProps) => {

  const {stringError, onChangeFunc} = useForm()

  return (
    <PassoFrame title='Infos Básicas'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>

      <InputField
        info="Nome do colaborador"
        value={form!.nome}
        error={stringError['nome'] || (form!.nome == '' && fireErrorBtn)}
        errorCall={stringError['nome'] ? 'caractere inválido' : 'Insira um nome'}
        // Ao digitar, insere valor em val e testa de imediato para prever erro
        onChange={(e) => onChangeFunc(e, (val) => setForm!(prev => ({...prev, nome: String(val)})), 'string', 'nome')}
        />

        <InputField
          type='email'
          info="E-mail"
          value={form!.email}
          error={(stringError['email'] && fireErrorBtn) || (form!.email == '' && fireErrorBtn)}
          errorCall={form!.email == '' ? 'Insira um e-mail' : 'Insira um e-mail válido!' }
          onChange={(e) => onChangeFunc(e, (val) => setForm!(prev => ({ ...prev, email: String(val) })), 'email', 'email')}
          />

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

const PassoDois = ({setForm, form, departamentos} : PassoProps) => {

  const {toBRL, onChangeFunc, salarioError, erroSalarioReason, stringError} = useForm()

  return (

    <PassoFrame title='Infos Profissionais'>
      {/* Foi necessário PropLifting para não ter conflito de eventos no componente */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <InputSelect 
          title='Departamento' 
          items={departamentos!} 
          value={form!.departamento} 
          onChange={(e) => setForm!(prev => ({ ...prev, departamento: e.target.value }))}
        />

        <InputField
          info="Cargo"
          value={form!.cargo}
          error={stringError['cargo']}
          errorCall={!stringError ? 'Insira um cargo' : 'caractere inválido'}
          // Ao digitar, insere valor em val e testa de imediato para prever erro
          onChange={(e) => onChangeFunc(e, (val) => setForm!(prev => ({...prev, cargo: String(val)})), 'string', 'cargo')}
        />

        <InputSelect 
          title='Senioridade' 
          items={['Estagiário', 'Júnior', 'Pleno', 'Sênior']} 
          value={form!.senioridade} 
          onChange={(e) => setForm!(prev => ({ ...prev, senioridade: e.target.value }))}
        />

        <InputField
          info="Salário"
          value={toBRL(form!.salarioBase)}
          error={salarioError}
          errorCall={erroSalarioReason}
          onChange={(e) => onChangeFunc(e, (salarioInput) => setForm!(prev => ({ ...prev, salarioBase: Number(salarioInput)})),'number', 'number')}
        />

      </Box>
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


// Input de infos (select)


// Componente índice de passo atual
const StepTab = ({passo} : StepProps) => {
  
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