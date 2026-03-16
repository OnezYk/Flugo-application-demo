import {useEffect, useState} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  Typography,
  useMediaQuery,
  Fade,
  Select,
  MenuItem,
  FormControl,
  type SelectChangeEvent,
} from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";

import AOS from "aos";
import "aos/dist/aos.css";

import {createAvatar} from "@dicebear/core";
import {notionists} from "@dicebear/collection";

import PrimaryBtn from "../components/PrimaryBtn";
import Crud from "../components/Crud";
import InputField from "../components/InputField";

import {useAuth} from "../hooks/useAuth";

import {getColaboradores} from "../utils/getColaborador";
import {Navigate, useNavigate} from "react-router-dom";
import {deleteColaborador} from "../utils/deleteColaborador";
import {fuzzySearch} from "../utils/filterTabela";
import {
  getDepartamentos,
  type DepartamentoType,
} from "../utils/routesDepartamento";

import type {ColaboradorFormData} from "./Formulario";
import DeleteGestor from "../components/DeleteGestor";

// O fetch de colaboradores tem id além de ColaboradorFormData.
export type ColaboradorProp = ColaboradorFormData & {id: string};

const Colaboradores = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("nome");
  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [hasColaboradores, setHasColaboradores] = useState(false);

  const {userLoggedIn} = useAuth();
  const navigate = useNavigate();

  const isSmall = useMediaQuery("(max-width: 660px)"); // True quando media < 660px
  const isXSmall = useMediaQuery("(max-width: 500px)"); // True quando media < 660px

  useEffect(() => {
    AOS.init(); // Init da biblioteca de animação
    getDepartamentos().then((data) => {
      setDepartamentos(data);
      console.log(data);
    });
  }, [query]);

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  const handleNewColaborador = () => {
    if (departamentos.length == 0) {
      alert("Crie um departamento primeiro!");
      return;
    }
    navigate("/formulario");
  };

  return (
    <Box
      sx={{
        position: "relative",
        right: isXSmall ? 5 : 0,
        p: isSmall ? 0 : 3,
        flexGrow: 0,
        ml: {lg: "300px", md: "100px", xs: 0},
        transform: !isSmall ? "scale(1)" : "scale(0.8)",
        transition: "all 1s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          color="text.primary"
          variant="h1"
          sx={{
            fontSize: 27,
            fontWeight: 600,
          }}
          data-aos="fade-right"
          data-aos-duration="800"
        >
          Colaboradores
        </Typography>

        <Box data-aos="fade-right" data-aos-duration="800" data-aos-delay="250">
          <PrimaryBtn onClick={handleNewColaborador}>
            Novo Colaborador
          </PrimaryBtn>
        </Box>
      </Box>

      {hasColaboradores && (
        <Box
          data-aos="fade-right"
          sx={{display: "flex", gap: 2, height: 50, alignItems: "center"}}
        >
          <FilterBtn
            filter={filter}
            handleFilter={(value) => setFilter(value)}
          />

          <InputField
            placeholder="Pesquise um colaborador"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
      )}
      <ColaboradoresTable
        query={query}
        filter={filter}
        onLoad={setHasColaboradores}
      />
    </Box>
  );
};

// Tabela de colaboradores
const ColaboradoresTable = ({
  query,
  filter,
  onLoad,
}: {
  query: string;
  filter: string;
  onLoad: (value: boolean) => void;
}) => {
  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([]);

  // Sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const results = fuzzySearch(colaboradores, filter, query);

  // CRUD
  const [openCrud, setOpenCrud] = useState(false);
  const [selectedColaborador, setSelectedColaborador] =
    useState<ColaboradorProp | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [openDeleteGestor, setOpenDeleteGestor] = useState(false)
  const [gestorId, setGestorId] = useState('')

  useEffect(() => {
    getColaboradores().then((data) => {
      setColaboradores(data);
      onLoad(data.length > 0); // ← avisa o pai após o fetch
    });
  }, []);

  const deleteRefresh = () => {
    getColaboradores().then((data) => {
      setColaboradores(data);
      onLoad(data.length > 0);
    });
  };

  const refresh = () => {
    getColaboradores().then((data) => setColaboradores(data));
  };

  // Criação procedural de avatar
  const getAvatar = (seed: string) => {
    return createAvatar(notionists, {
      seed, // usa nome como seed aleatória
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"], // CorBG aleatória
    }).toString();
  };

  // Função para fetch filtrado na Firestore
  const handleGetColaborador = (col: string) => {
    const field = col.toLowerCase();

    // Alternação entre asc e desc
    const newOrder = sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newOrder);
    getColaboradores(field, newOrder).then((data) => setColaboradores(data));
  };

  const handleOpenCrud = (colaborador: ColaboradorProp, isEdit: boolean) => {
    setSelectedColaborador(colaborador);
    setIsEdit(isEdit);
    setOpenCrud(true);
  };

  const handleDeleteColaborador = (id: string) => {
    deleteColaborador(id);
    deleteRefresh();
    setSelected([]);
  };
  
  const handleBulkSelect = (id: string) => {
    // Toggle de pushes em array
    setSelected(
      (p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]), // Se array p já tem o id, ele remove
    );
  };
  
  const handleBulkDelete = () => {
    selected.forEach((selection) => {
      deleteColaborador(selection);
    });
    deleteRefresh();
    
    setSelected([]);
  };
  
    const handleDeleteGestor = (id: string) => {
      setGestorId(id)
      setOpenDeleteGestor(true)
    }

  const gestores = results.filter(c => c.senioridade === 'Gestor')
  const regular = results.filter(c => c.senioridade !== 'Gestor')

  return (
    <>
      {colaboradores.length >= 1 ? ( // Caso tenha colaboradores na Firestore ->
        <>

          <DeleteGestor
            open={openDeleteGestor}
            handleClose={() => setOpenDeleteGestor(false)}
            selectedId={gestorId}
            refresh={deleteRefresh}
          />

          <Crud
            colaboradores={colaboradores}
            refresh={refresh}
            key={selectedColaborador?.id} // força remontagem ao trocar colaborador
            isEdit={isEdit}
            colaborador={selectedColaborador}
            open={openCrud}
            handleClose={() => setOpenCrud(false)}
          />
          <TableContainer
            data-aos="fade-in"
            data-aos-duration="800"
            sx={{
              boxShadow: 3,
              borderColor: "text.disabled",
              borderRadius: 2,
              marginTop: 2,
              maxHeight: "calc(100vh - 200px)",
              overflowY: colaboradores.length >= 6 ? "scroll" : "hidden",
              mb: 4,
            }}
          >
            <Table>
              <TableHead>
                {/* Loop entre os elementos do array */}
                <TableRow sx={{bgcolor: "text.disabled"}}>
                  {["", "Nome", "Email", "Departamento", "Ações", "Status"].map(
                    (col, i) => (
                      <TableCell
                        onClick={() => {
                          if (col !== "Ações") {
                            handleGetColaborador(col);
                          }
                        }} // Faz o fetch filtrado de acordo com o elemento do array clicado
                        key={i}
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          textAlign: col === "Status" ? "right" : "left",
                          transition: "all 0.2s",
                          ":hover":
                            col !== "Ações"
                              ? {cursor: "pointer", bgcolor: "action.hover"}
                              : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            justifyContent:
                              col === "Status" || col === "Ações"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          {col !== "" && (
                            <>
                              {col} <SouthRoundedIcon sx={{fontSize: 14}} />
                            </>
                          )}
                        </Box>
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                
                {/* Loop de todos os colaboradores da firestore */}
                  {gestores.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ fontWeight: 600, fontSize: 18 }}>
                        Gestores:
                      </TableCell>
                    </TableRow>
                    {gestores.map((row) => (
                    <TableRow key={row.id} sx={{"&:last-child td": {border: 0}}}>
                      <TableCell sx={{width: 40, p: 0}}>
                        <Checkbox onClick={() => handleBulkSelect(row.id)} size="large" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                          <Avatar
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.nome))}`}
                            sx={{width: 36, height: 36}}
                          />
                          <Typography fontWeight={500}>{row.nome}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.departamento}</TableCell>
                      <TableCell sx={{textAlign: "right", width: 120}}>
                        <Box sx={{display: "flex", justifyContent: "end", gap: 2}}>
                          <VisibilityIcon onClick={() => handleOpenCrud(row, false)} sx={{color: "#06A9F4", transition: "all 0.2s", ":hover": {color: "#0437c2", cursor: "pointer", transform: "scale(1.15)"}}} />
                          <EditIcon onClick={() => handleOpenCrud(row, true)} sx={{transition: "all 0.2s", ":hover": {cursor: "pointer", transform: "scale(1.15)"}}} />
                          <DeleteIcon onClick={() => handleDeleteGestor(row.id)} sx={{color: "error.main", transition: "all 0.2s", ":hover": {color: "#a70f0f", cursor: "pointer", transform: "scale(1.15)"}}} />
                        </Box>
                      </TableCell>
                      <TableCell sx={{textAlign: "right"}}>
                        <Chip
                          label={row.status ? "Ativo" : "Inativo"}
                          size="small"
                          sx={{borderRadius: 1.5, bgcolor: row.status ? "success.light" : "error.light", color: row.status ? "success.main" : "error.main", fontWeight: 600, fontSize: 12}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  </>
                )}
                {regular.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ fontWeight: 600, fontSize: 18 }}>
                      Colaboradores:
                    </TableCell>
                  </TableRow>
                )}
                {regular.map((row: ColaboradorProp, index) => (
                  // Animação em cascata de acordo com qtd de elementos
                  <Fade in={true} timeout={300 + index * 200} key={row.id}>
                    {/* Seu sx determina o último elemento renderizado do array e estiliza */}
                    <TableRow
                      key={row.id}
                      sx={{"&:last-child td": {border: 0}}}
                    >
                      <TableCell sx={{width: 40, p: 0}}>
                        <Checkbox
                          onClick={() => handleBulkSelect(row.id)}
                          size="large"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{display: "flex", alignItems: "center", gap: 1.5}}
                        >
                          {/* Coleta o svg criado de getAvatar, codifica assegurando o uso da string SVG em src={...} */}
                          <Avatar
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.nome))}`}
                            sx={{width: 36, height: 36}}
                          />
                          <Typography fontWeight={500}>{row.nome}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.departamento}</TableCell>

                      {/* Icons CRUD */}
                      <TableCell sx={{textAlign: "right", width: 120}}>
                        <Box
                          sx={{display: "flex", justifyContent: "end", gap: 2}}
                        >
                          <VisibilityIcon
                            onClick={() => handleOpenCrud(row, false)}
                            sx={{
                              color: "#06A9F4",
                              transition: "all 0.2s",
                              ":hover": {
                                color: "#0437c2",
                                cursor: "pointer",
                                transform: "scale(1.15)",
                              },
                            }}
                          />
                          <EditIcon
                            onClick={() => handleOpenCrud(row, true)}
                            sx={{
                              transition: "all 0.2s",
                              ":hover": {
                                cursor: "pointer",
                                transform: "scale(1.15)",
                              },
                            }}
                          />
                          <DeleteIcon
                            onClick={() => handleDeleteColaborador(row.id)}
                            sx={{
                              color: "error.main",
                              transition: "all 0.2s",
                              ":hover": {
                                color: "#a70f0f",
                                cursor: "pointer",
                                transform: "scale(1.15)",
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{textAlign: "right"}}>
                        {/* Responsividade com o estado de status */}
                        <Chip
                          label={row.status ? "Ativo" : "Inativo"}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            bgcolor: row.status
                              ? "success.light"
                              : "error.light",
                            color: row.status ? "success.main" : "error.main",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PrimaryBtn onClick={handleBulkDelete} disabled={selected.length < 1}>
            Deletar selecionados
          </PrimaryBtn>
        </>
      ) : (
        // Caso não há colaboradores na Firestore ->
        <Typography
          data-aos="fade-right"
          data-aos-delay="150"
          data-aos-duration="800"
          variant="h2"
          sx={{
            mt: {sm: 2, xs: 7},
            fontSize: 20,
            fontWeight: 600,
            color: "text.secondary",
            textAlign: {sm: "start", xs: "center"},
          }}
        >
          Sem colaboradores por enquanto, experimente cadastrar um!
        </Typography>
      )}
    </>
  );
};

// Componente botão de search
const FilterBtn = ({
  handleFilter,
  filter,
}: {
  handleFilter: (value: string) => void;
  filter: string;
}) => {
  return (
    <FormControl sx={{minWidth: 185}}>
      <Select
        labelId="filter-label"
        value={filter}
        displayEmpty
        onChange={(e: SelectChangeEvent) => handleFilter(e.target.value)}
      >
        <MenuItem value="nome">Nome</MenuItem>
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="departamento">Departamento</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Colaboradores;
