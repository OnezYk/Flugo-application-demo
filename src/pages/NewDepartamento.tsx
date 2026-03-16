// React
import React, {useEffect, useRef, useState, type ReactNode} from "react";
import {useNavigate} from "react-router-dom";

// MUI Assets
import {
  Box,
  Button,
  Divider,
  Fade,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// Componentes
import PrimaryBtn from "../components/PrimaryBtn";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";

// Routes
import {postColaborador} from "../utils/postColaborador";
import {useForm} from "../hooks/useForm";
import InputField from "../components/InputField";
import {postDepartamento} from "../utils/routesDepartamento";

// Export da FormData
export type ColaboradorFormData = {
  nome: string;
  email: string;
  departamento: string;
  cargo: string;
  senioridade: string;
  salarioBase: number;
  dataDeAdmissao: Date;
  status: boolean;
};

type DepartamentoData = {
  nome: string;
  gestor: string;
};

// Criação de tipo flexível, reduzindo código verboso
type PassoProps = {
  passo: number;
  form?: ColaboradorFormData;
  setForm?: React.Dispatch<React.SetStateAction<ColaboradorFormData>>;
  setDepartamento?: React.Dispatch<
    React.SetStateAction<{nome: string; gestor: string}>
  >;
  departamento?: DepartamentoData;
  children?: React.ReactNode;
  fireErrorBtn: boolean;
};

type StepProps = {
  passo: number;
};

// Formulário
const Formulario = () => {
  const isSmallY = useMediaQuery("(max-height: 800px)"); // True quando media < 660px

  const [passo, setPasso] = useState(1);
  const [fireErrorBtn, setFireErrorBtn] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(true);

  const navigate = useNavigate();

  const [departamento, setDepartamento] = useState({
    nome: "",
    gestor: "",
  });

  // Inicialização de form como obj
  const [form, setForm] = useState({
    nome: "",
    email: "",
    departamento: "",
    cargo: "",
    senioridade: "",
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false,
  });

  // Testes de regex para prevenção de inputs indesejados

  const {isValid} = useForm(form);

  // Caso clique com o botão ainda desabilitado
  const handleClick = () => {
    setFireErrorBtn(true);
    setTimeout(() => {
      setFireErrorBtn(false);
    }, 1500);
  };

  // Prevenção de click duplo
  const submitting = useRef(false);

  // Handle do POST ao Firebase após "Concluido"
  const handleSubmit = async () => {
    if (submitting.current) return;
    submitting.current = true;

    const finalForm = {
      ...form,
      departamento: departamento.nome,
      senioridade: "Gestor",
    };

    try {
      await postDepartamento(departamento);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao criar departamento",
      );
      navigate("/departamentos");
      return;
    }

    setExitAnimation(false);

    await postColaborador(finalForm);

    setTimeout(() => {
      return navigate("/departamentos");
    }, 500);
  };

  // Inicialização da biblioteca de animação
  useEffect(() => {
    AOS.init();
  }, []);

  const isAllValid =
    form.nome.trim() !== "" &&
    form.email.trim() !== "" &&
    form.cargo.trim() !== "" &&
    !!form.salarioBase &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  return (
    <Fade in={exitAnimation} timeout={500}>
      <Box
        sx={{
          m: 4,
          mr: 5,
          ml: {lg: "340px", md: "140px", xs: "40px"},
          display: "flex",
          flexDirection: "column",
          color: "text.primary",
          overflowX: "hidden",
          overflowY: isSmallY ? "auto" : "hidden",
          maxHeight: isSmallY ? "80dvh" : "100dvh",
          pb: 4,
        }}
      >
        <Typography
          data-aos="fade-right"
          data-aos-duration="500"
          sx={{
            fontWeight: 600,
            textAlign: {sm: "start", xs: "center"},
          }}
        >
          Departamentos
          <Typography
            component="span"
            sx={{ml: 2, color: "text.secondary", fontWeight: 400}}
          >
            •
          </Typography>
          <Typography
            component="span"
            sx={{ml: 2, color: "text.secondary", fontWeight: 600}}
          >
            Novo departamento
          </Typography>
        </Typography>

        <Box
          data-aos="fade-in"
          data-aos-duration="800"
          sx={{
            mt: 2,
            display: {sm: "grid"},
            gridTemplateColumns: {sm: "97% 1fr"},
            gap: 2,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {/* Barra de progresso */}
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              height: "4px",
              bgcolor: "success.light",
            }}
          >
            <Box
              sx={{
                height: "100%",
                position: "absolute",
                bgcolor: "success.main",
                transition: "all 1s",
                width: `${passo == 1 ? "0%" : passo == 2 ? "50%" : "100%"}`,
              }}
            >
              {/* ------------------- */}
            </Box>
          </Box>

          <Typography sx={{textAlign: "center"}}>
            {" "}
            {passo == 1 ? "0%" : passo == 2 ? "50%" : "100%"}{" "}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {sm: "200px 1fr", xs: "1fr"},
            gridTemplateRows: {sm: "auto", xs: "200px, 200px"},
            mt: 4,
          }}
        >
          {/* Índice de passo atual */}
          <StepTab passo={passo} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Display dinâmico de acordo com "passo" para formulário */}
            {passo === 1 && (
              <PassoUm
                departamento={departamento}
                fireErrorBtn={fireErrorBtn}
                form={form}
                setDepartamento={setDepartamento}
                passo={passo}
              />
            )}
            {passo === 2 && (
              <PassoDois
                departamento={departamento}
                fireErrorBtn={fireErrorBtn}
                form={form}
                setForm={setForm}
                passo={passo}
              />
            )}
            {passo === 3 && <PassoTres />}

            <Box
              sx={{
                display: "flex",
                justifyContent: passo > 1 ? "space-between" : "end",
                mt: 4,
              }}
            >
              {/* Botões */}
              {passo > 1 && ( // Se user em passo 2+
                <Button
                  sx={{color: "text.primary", fontWeight: 600}}
                  onClick={() => setPasso(passo - 1)}
                >
                  Voltar
                </Button>
              )}

              {passo < 3 ? ( // Se em passo < 3
                <Fade in={true} timeout={500}>
                  <Box sx={{position: "relative", display: "inline-block"}}>
                    <PrimaryBtn
                      disabled={
                        passo == 1
                          ? !/^[a-zA-ZÀ-ÿ\s]+$/.test(departamento?.nome ?? "")
                          : !isAllValid
                      }
                      onClick={() => setPasso(passo + 1)}
                    >
                      Próximo
                    </PrimaryBtn>

                    {(passo == 1
                      ? !/^[a-zA-ZÀ-ÿ\s]+$/.test(departamento?.nome ?? "")
                      : !isAllValid) && (
                      <Box
                        onClick={handleClick}
                        sx={{
                          position: "absolute",
                          inset: 0,
                          cursor: "not-allowed",
                        }}
                      />
                    )}
                  </Box>
                </Fade>
              ) : (
                <PrimaryBtn disabled={!isValid} onClick={handleSubmit}>
                  Concluir
                </PrimaryBtn>
              )}
              {/* ------------------------- */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

//Seção de passos:
const PassoUm = ({setDepartamento, departamento, fireErrorBtn}: PassoProps) => {
  const {stringError, onChangeFunc} = useForm();

  return (
    <PassoFrame title="Criar departamento">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <InputField
          info="Nome do departamento"
          value={departamento!.nome}
          error={
            stringError["nome"] ||
            (departamento!.nome.trim() == "" && fireErrorBtn)
          }
          errorCall={
            departamento!.nome == ""
              ? "Insira um departamento"
              : "caractere inválido"
          }
          onChange={(e) =>
            onChangeFunc(
              e,
              (val) =>
                setDepartamento!((prev) => ({...prev, nome: String(val)})),
              "string",
              "nome",
            )
          }
        />
      </Box>
    </PassoFrame>
  );
};

const PassoDois = ({setForm, form, departamento, fireErrorBtn}: PassoProps) => {
  const {toBRL, onChangeFunc, salarioError, erroSalarioReason, stringError} =
    useForm();

  return (
    <PassoFrame title="Criar gestor">
      {/* Foi necessário PropLifting para não ter conflito de eventos no componente */}
      <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
        <TextField
          label="Departamento"
          value={departamento!.nome}
          slotProps={{
            htmlInput: {readOnly: true},
          }}
        />

        <TextField
          label="Senioridade"
          value={"Gestor"}
          slotProps={{
            htmlInput: {readOnly: true},
          }}
        />

        <Divider></Divider>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <InputField
            info="Nome do gestor"
            value={form!.nome}
            error={
              stringError["nome"] || (fireErrorBtn && form!.nome.trim() === "")
            }
            errorCall={
              stringError["nome"] ? "caractere inválido" : "Insira um nome"
            }
            // Ao digitar, insere valor em val e testa de imediato para prever erro
            onChange={(e) =>
              onChangeFunc(
                e,
                (val) => setForm!((prev) => ({...prev, nome: String(val)})),
                "string",
                "nome",
              )
            }
          />

          <InputField
            info="Cargo"
            value={form!.cargo}
            error={
              stringError["cargo"] ||
              (fireErrorBtn && form!.cargo.trim() === "")
            }
            errorCall={
              form!.cargo.trim() === ""
                ? "Insira um cargo"
                : "caractere inválido"
            }
            onChange={(e) =>
              onChangeFunc(
                e,
                (val) => setForm!((prev) => ({...prev, cargo: String(val)})),
                "string",
                "cargo",
              )
            }
          />

          <InputField
            info="E-mail"
            value={form!.email}
            error={
              (fireErrorBtn && stringError["email"]) ||
              (fireErrorBtn && form!.email.trim() === "")
            }
            errorCall={
              form!.email.trim() === "" ? "Insira um Email" : "Email inválido"
            }
            onChange={(e) =>
              onChangeFunc(
                e,
                (val) => setForm!((prev) => ({...prev, email: String(val)})),
                "email",
                "email",
              )
            }
          />

          <InputField
            info="Salário"
            value={toBRL(form!.salarioBase)}
            error={salarioError || (fireErrorBtn && form!.salarioBase === 0)}
            errorCall={salarioError ? erroSalarioReason : "Insira um número"}
            onChange={(e) =>
              onChangeFunc(
                e,
                (salarioInput) =>
                  setForm!((prev) => ({
                    ...prev,
                    salarioBase: Number(salarioInput),
                  })),
                "number",
                "number",
              )
            }
          />
        </Box>
      </Box>
    </PassoFrame>
  );
};

const PassoTres = () => {
  return (
    <PassoFrame title="Parabéns!">
      <Typography
        sx={{
          fontWeight: "600",
          textAlign: {sm: "start", xs: "center"},
        }}
      >
        Cadastro realizado com sucesso!
      </Typography>
    </PassoFrame>
  );
};

//-----------------------------------------------------

//Corpo principal do formulário
const PassoFrame = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => {
  return (
    <Box
      data-aos="fade-in"
      data-aos-duration="500"
      data-aos-delay="150"
      sx={{}}
    >
      <Typography
        sx={{
          position: "relative",
          bottom: 3,
          mb: 4,
          fontWeight: 600,
          fontSize: 25,
          color: "text.secondary",
          textAlign: {sm: "start", xs: "center"},
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
};

// Input de infos (select)

// Componente índice de passo atual
const StepTab = ({passo}: StepProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // True se media < 600px

  return (
    <Box
      data-aos="fade-right"
      data-aos-duration="500"
      data-aos-delay="100"
      sx={{
        display: "flex",
        flexDirection: {sm: "column", xs: "row"},
        gap: {sm: 1, xs: 15},
        mb: {sm: 0, xs: 3},
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {passo == 1 ? (
          <Box
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              color="primary.contrastText"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "success.main",
                borderRadius: "50%",
                fontWeight: "600",
                width: 27,
                height: 27,
                textAlign: "center",
              }}
            >
              1
            </Typography>
          </Box>
        ) : (
          <CheckCircleRoundedIcon
            sx={{
              fontSize: 32,
              position: "relative",
              right: 2,
              color: "success.main",
            }}
          />
        )}

        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Definir departamento
        </Typography>
      </Box>

      {!isMobile && (
        <Box
          sx={{
            bgcolor: `${passo == 1 ? "text.disabled" : passo == 2 ? "text.secondary" : "success.main"}`,
            width: 2,
            minHeight: `${passo == 1 ? "100px" : passo == 2 ? "50px" : "0px"}`,
            ml: 1.5,
            transition: "all 1s ease",
          }}
        ></Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
          }}
        >
          {passo < 3 ? (
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${passo == 1 ? "text.disabled" : "success.main"}`,
                color: `${passo == 1 ? "text.secondary" : "primary.contrastText"}`,
                fontWeight: "600",
                borderRadius: "50%",
                width: 27,
                height: 27,
                textAlign: "center",
                transition: "all 1s",
              }}
            >
              2
            </Typography>
          ) : (
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 32,
                position: "relative",
                right: 2,
                color: "success.main",
              }}
            />
          )}
        </Box>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Gestor
        </Typography>
      </Box>
    </Box>
  );
};

export default Formulario;
