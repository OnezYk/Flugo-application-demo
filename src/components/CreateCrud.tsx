import {useForm} from "../hooks/useForm";
import {useEffect, useState} from "react";

import { Dialog, DialogContent, DialogActions, Button, Box, IconButton, Typography, DialogTitle, Chip, Divider} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {getDepartamentos} from "../utils/routesDepartamento";
import {postColaborador} from "../utils/postColaborador";
import {getColaboradores} from "../utils/getColaborador";

import InputField from "./InputField";
import InputSelect from "./InputSelect";

import type {ColaboradorProp} from "../pages/Colaboradores";
import type {ColaboradorFormData} from "../pages/Formulario";

type CrudInfoProps = {
  colaboradorInfo?: string | number;
  title?: string;
};

type CrudProps = CrudInfoProps & {
  open: boolean;
  colaborador: ColaboradorProp | null;
  handleClose?: () => void;
  refresh: () => void;
  selectedDepartamento: string;
};

// Floating tab para post de colaboradores 
export const CreateCrud = ({
  open,
  handleClose,
  refresh,
  selectedDepartamento,
}: CrudProps) => {

  const {toBRL, onChangeFunc, stringError, salarioError, erroSalarioReason} = useForm();

  const [newColaborador, setNewColaborador] = useState<ColaboradorFormData>({
    nome: "",
    email: "",
    departamento: selectedDepartamento,
    cargo: "",
    senioridade: "",
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false,
  });

  // Reinicia o formulário caso a tab é fechada
  const resetColaborador = {
    nome: "",
    email: "",
    departamento: "",
    cargo: "",
    senioridade: "",
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false,
  };

  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [errorBtn, setErrorBtn] = useState(false);

  const handleReset = () => {
    setNewColaborador(resetColaborador);
    handleClose?.();
  };

  // Define os campos para qual departamento está sendo criado / fetch de info para formulário
  useEffect(() => {
    getDepartamentos().then((data) =>
      setDepartamentos(data.map((e) => e.nome)),
    );
    getColaboradores().then((data) => setColaboradores(data));
  }, [open]);

  // condição de disable para 'Adicionar colaborador' btn
  const isAllValid =
    newColaborador.nome.trim() !== "" &&
    newColaborador.email.trim() !== "" &&
    newColaborador.cargo.trim() !== "" &&
    !!newColaborador.salarioBase &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newColaborador.email);

  // Aplica 'departamento' para o departamento em que o colaborador foi criado 
  const handleSubmit = async () => {
    if (isAllValid) {
      await postColaborador({
        ...newColaborador,
        departamento: selectedDepartamento,
      });

      // Dispara refresh (func prop para atualizar as infos no parent)
      refresh();

      // Reinicia o formulário e fecha a tab
      handleReset();
    }
  };

  const handleClick = () => {
    setErrorBtn(true);

    setTimeout(() => {
      setErrorBtn(false);
    }, 1500);
  };

  // Método checando se há Gestor para aquele departamento, permitindo ou não a criação do gestor
  const hasGestor = colaboradores.some(
    (c) => c.departamento === selectedDepartamento && c.senioridade === "Gestor",
  );

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            padding: 1,
            boxShadow: "0px 20px 50px rgba(0,0,0,0.1)",
          },
        },
      }}
    >

      <DialogTitle
        component="div"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Typography variant="h6" fontWeight="bold" sx={{ml: 1}}>
            {`Colaborador: ${newColaborador?.nome}`}
          </Typography>
          <Chip
            label={newColaborador?.status ? "Ativo" : "Inativo"}
            size="medium"
            sx={{
              borderRadius: 1.5,
              bgcolor: newColaborador?.status ? "success.light" : "error.light",
              color: newColaborador?.status ? "success.main" : "error.main",
              fontWeight: 600,
              fontSize: 12,
            }}
          />

        </Box>
        <IconButton onClick={handleReset}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mb: 0,
        }}
      >
        <Box
          component="form"
          sx={{display: "grid", gridTemplateRows: "1fr 1fr", gap: 3, mt: 1}}
        >
          
          {/* Input do formulário: --------------------------------------*/}
          <InputField
            info="Nome"
            value={newColaborador.nome}
            error={Boolean(stringError["nome"] || errorBtn)}
            errorCall={
              stringError["nome"] ? "caractere inválido" : "Insira um nome"
            }
            onChange={(e) => {
              onChangeFunc(
                e,
                (val) =>
                  setNewColaborador!((prev) => ({...prev!, nome: String(val)})),
                "string",
                "nome",
              );
            }}
          />

          <InputField
            info="E-mail"
            type="email"
            value={newColaborador!.email}
            error={
              (errorBtn && stringError["email"]) ||
              (errorBtn && newColaborador!.email == "")
            }
            errorCall={
              newColaborador!.email == ""
                ? "Insira um e-mail"
                : "Insira um e-mail válido!"
            }
            onChange={(e) =>
              onChangeFunc(
                e,
                (val) =>
                  setNewColaborador!((prev) => ({
                    ...prev!,
                    email: String(val),
                  })),
                "email",
                "email",
              )
            }
          />
        </Box>

        <Divider></Divider>

        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            mt: 1,
          }}
        >

          <InputField
            info="Cargo"
            value={newColaborador!.cargo}
            error={stringError["cargo"] || errorBtn}
            errorCall={
              stringError["cargo"] ? "Caractere inválido!" : "Insira um cargo!"
            }
            onChange={(e) =>
              onChangeFunc(
                e,
                (val) =>
                  setNewColaborador!((prev) => ({
                    ...prev!,
                    cargo: String(val),
                  })),
                "string",
                "cargo",
              )
            }
          />

          <InputSelect
            title="Departamento"
            items={departamentos}
            value={String(selectedDepartamento)}
            onChange={(e) =>
              setNewColaborador((prev) => ({
                ...prev!,
                departamento: e.target.value,
              }))
            }
            isEdit={false}
          />

          <InputField
            info="Salário"
            value={toBRL(Number(newColaborador!.salarioBase))}
            error={salarioError || errorBtn}
            errorCall={salarioError ? erroSalarioReason : "Insira um valor"}
            onChange={(e) =>
              onChangeFunc(
                e,
                (salarioInput) =>
                  setNewColaborador!((prev) => ({
                    ...prev!,
                    salarioBase: Number(salarioInput),
                  })),
                "number",
                "number",
              )
            }
          />

          <InputSelect
            title="Senioridade"
            items={
              newColaborador.senioridade === "Gestor"
                ? ["Gestor"]
                : hasGestor
                  ? ["Estagiário", "Júnior", "Pleno", "Sênior"]
                  : ["Estagiário", "Júnior", "Pleno", "Sênior", "Gestor"]
            }
            value={
              newColaborador.senioridade === ""
                ? "Estagiário"
                : newColaborador.senioridade
            }
            onChange={(e) =>
              setNewColaborador((prev) => ({
                ...prev!,
                senioridade: e.target.value,
              }))
            }
          />
        </Box>

      {/* ---------------------------------------------- */}

      </DialogContent>

      <DialogActions sx={{p: 3, justifyContent: "space-between"}}>
        <Button
          onClick={handleReset}
          variant="contained"
          sx={{
            borderRadius: "10px",
            px: 4,
            fontWeight: "bold",
            color: "text.primary",
            bgcolor: "text.disabled",
            ":hover": {bgcolor: "#cfcfcf"},
          }}
        >
          Cancelar
        </Button>
        <Box sx={{position: "relative", display: "inline-flex"}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !newColaborador?.nome.trim() ||
              !newColaborador?.email.trim() ||
              !newColaborador?.cargo.trim() ||
              !newColaborador?.salarioBase ||
              stringError["email"]
            }
            sx={{borderRadius: "10px", px: 4, fontWeight: "bold"}}
          >
            Adicionar colaborador
          </Button>

          {/* Overlay que permite callbacks mesmo com botão disabled */}
          {!isAllValid && (
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
      </DialogActions>
    </Dialog>
  );
};

export default CreateCrud;
