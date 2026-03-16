// React
import {useEffect, useState} from "react";

// MUI copmonents
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
  Tabs,
  Tab,
  Button,
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


import {useAuth} from "../hooks/useAuth";

import {getColaboradores} from "../utils/getColaborador";
import {Navigate} from "react-router-dom";
import {deleteColaborador} from "../utils/deleteColaborador";

import Crud from "../components/Crud";
import InputField from "../components/InputField";
import CreateCrud from "../components/CreateCrud";
import DeleteTab from "../components/DeleteTab";
import DeleteGestor from "../components/DeleteGestor";

import {fuzzySearch} from "../utils/filterTabela";
import { getDepartamentos, type DepartamentoType } from "../utils/routesDepartamento";

// O fetch contém id além dos dados enviados, por isso extenção do tipo
export type ColaboradorProp = ColaboradorFormData & {id: string};
import type {ColaboradorFormData} from "./Formulario";

type DepartamentosTableProps = {
  query: string;
  filter: string;
  activeTab: string;
  refreshParent: () => void;
  openCreateCrud: boolean;
  setOpenCreateCrud: (v: boolean) => void;
  colaboradores: ColaboradorProp[]; 
  setColaboradores: React.Dispatch<React.SetStateAction<ColaboradorProp[]>>;
}

type DepartamentosTabProps = {
  query: string;
  filter: string;
  activeTab: string;
  setActiveTab: (v: string) => void;
  refreshDepartamentos: () => void;
}

const Colaboradores = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);

  const {userLoggedIn} = useAuth();

  const isSmall = useMediaQuery("(max-width: 660px)"); // True quando media < 660px
  const isXSmall = useMediaQuery("(max-width: 500px)"); // True quando media < 660px

  // Inicialização da biblioteca de animação
  useEffect(() => {
    getColaboradores().then(data => {
      setActiveTab(data[0]?.departamento ?? '')
    })

    getDepartamentos().then(data => {
      setDepartamentos(data)
    })

    AOS.init()
  }, [])

  // Redirect Auth
  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  const refreshDepartamentos = () => {
    getDepartamentos().then((data) => {
      setDepartamentos(data);
    });
  };

  return (
    <>
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
            Departamentos
          </Typography>

          <Box
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="250"
          >
            <PrimaryBtn to="/newdepartamento"> Novo Departamento </PrimaryBtn>
          </Box>
        </Box>

        {departamentos.length >= 1 ? (
          <>
            <Box
              data-aos="fade-right"
              sx={{display: "flex", gap: 2, height: 50, alignItems: "center"}}
            >
              <FilterBtn
                filter={filter}
                handleFilter={(value) => setFilter(value)}
              />

              <InputField
                placeholder="Pesquise um colaborador do departamento"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Box>
            <DepartamentosTab
              query={query}
              filter={filter}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              refreshDepartamentos={refreshDepartamentos}
            />
          </>
        ) : (
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
            Sem departamentos por enquanto, experimente criar um!
          </Typography>
        )}
      </Box>
    </>
  );
};

// Tabela de colabDoradores
const DepartamentosTable = ({
  query,
  filter,
  activeTab,
  refreshParent,
  setOpenCreateCrud,
  colaboradores,
  setColaboradores,
}: DepartamentosTableProps) => {

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // CRUD
  const [openCrud, setOpenCrud] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorProp | null>(null);
  const [openDeleteGestor, setOpenDeleteGestor] = useState(false);
  const [gestorId, setGestorId] = useState("false");

  useEffect(() => {
    AOS.init();
  }, []);

  // Handle da biblioteca fuzzy search para InputField de colaboradores
  const results = () => {
    return fuzzySearch(colaboradores, filter, query).filter(
      (c) => activeTab === "" || c.departamento === activeTab,
    );
  };

  const gestores = results().filter((c) => c.senioridade === "Gestor");
  const regular = results().filter((c) => c.senioridade !== "Gestor");
  //-------------------------------------------------------------------

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

  const handleDeleteColaborador = (id: string, senioridade: string) => {
    if (senioridade == "Gestor") {
      setOpenDeleteGestor(true);
      setGestorId(id);
      return;
    }
    deleteColaborador(id);
    getColaboradores().then((data) => setColaboradores(data));
    refreshParent();
    setSelected([]);
  };

  const handleBulkSelect = (id: string) => {
    // Toggle de pushes em array
    setSelected((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id], // Se array p já tem o id, ele remove
    );
  };

  const handleBulkDelete = () => {
    selected.forEach((selection) => {
      deleteColaborador(selection);
    });
    getColaboradores().then((data) => setColaboradores(data));

    setSelected([]);
  };

  const handleAddCrud = () => {
    setOpenCreateCrud(true);
  };

  const refresh = () => {
    getColaboradores().then((data) => {
      setColaboradores(data);
      refreshParent();
    });
  };
  return (
    <>
      <>
        <DeleteGestor
          selectedId={gestorId}
          refresh={refresh}
          open={openDeleteGestor}
          handleClose={() => setOpenDeleteGestor(false)}
        />

        <Crud
          refresh={() =>
            getColaboradores().then((data) => setColaboradores(data))
          }
          colaboradores={colaboradores}
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
                {["", "Nome", "Email", "Cargo", "Ações", "Status"].map(
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
              {/* Display de gestor do departamento */}
              {gestores.length > 0 && (
                <>
                  <TableRow></TableRow>
                  {gestores.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{"&:last-child td": {border: 0}}}
                    >
                      <TableCell sx={{width: 40, fontWeight: 600}}>
                        Gestor:
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
                      <TableCell>{row.cargo}</TableCell>

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
                            onClick={() =>
                              handleDeleteColaborador(row.id, row.senioridade)
                            }
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
                  ))}
                </>
              )}
              {colaboradores.filter((obj) => obj.senioridade !== "Gestor")
                .length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      fontWeight: 600,
                      bgcolor: "white",
                      color: "text.primary",
                      fontSize: 18,
                    }}
                  >
                    Colaboradores:
                  </TableCell>
                </TableRow>
              )}
              {/* Loop dos colaboradores econtrados na fuzzy search (todos se InputField vazio) */}
              {regular.map((row: ColaboradorProp, index) => (
                // Animação em cascata de acordo com qtd de elementos
                <Fade in={true} timeout={300 + index * 200} key={row.id}>
                  {/* Seu sx determina o último elemento renderizado do array e estiliza */}
                  <TableRow key={row.id} sx={{"&:last-child td": {border: 0}}}>
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
                    <TableCell>{row.cargo}</TableCell>

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
                          onClick={() =>
                            handleDeleteColaborador(row.id, row.senioridade)
                          }
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
                          bgcolor: row.status ? "success.light" : "error.light",
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
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
          <Box data-aos="fade-in" data-aos-duration="800">
            <PrimaryBtn
              onClick={handleBulkDelete}
              disabled={selected.length < 1}
            >
              Deletar selecionados
            </PrimaryBtn>
          </Box>
          <Box data-aos="fade-in" data-aos-duration="800">
            <PrimaryBtn onClick={handleAddCrud}>
              Adicionar colaborador
            </PrimaryBtn>
          </Box>
        </Box>
      </>
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
        <MenuItem value="" disabled>
          Pesquisar por
        </MenuItem>
        <MenuItem value="nome">Nome</MenuItem>
        <MenuItem value="email">Email</MenuItem>
      </Select>
    </FormControl>
  );
};

// Tabs da table de acordo com departamentos
const DepartamentosTab = ({
  query,
  filter,
  activeTab,
  setActiveTab,
  refreshDepartamentos,
}: DepartamentosTabProps) => {

  const [openDeleteTab, setOpenDeleteTab] = useState(false);
  const [openCreateCrud, setOpenCreateCrud] = useState(false);

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([]);
  
  useEffect(() => {
    getDepartamentos().then((data) => {
      const deps = data.map((d) => d.nome); // Transforma o fetch em um array de strings com o nome dos departamentos
      setDepartamentos(deps);
      setActiveTab(deps[0] ?? ""); // Pré seleciona o primeiro elemento do fetch
    });
    getColaboradores().then((data) => setColaboradores(data));
  }, []);

  const refreshColaboradores = () => {
    getColaboradores().then((data) => setColaboradores(data));
    refreshDepartamentos();
  };

  return (
    <>
      <CreateCrud
        refresh={() =>
          getColaboradores().then((data) => setColaboradores(data))
        }
        selectedDepartamento={String(activeTab)}
        colaborador={null}
        open={openCreateCrud}
        handleClose={() => setOpenCreateCrud(false)}
      />

      <DeleteTab
        open={openDeleteTab}
        handleClose={() => setOpenDeleteTab(false)}
        activeTab={activeTab}
        refresh={() =>
          getDepartamentos().then((data) => {
            const deps = data.map((d) => d.nome);
            setDepartamentos(deps);
            setActiveTab(deps[0] ?? "");
            refreshDepartamentos();
            getColaboradores().then((d) => setColaboradores(d));
          })
        }
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Tabs
          value={activeTab || departamentos[0] || ""}
          onChange={(_, v) => setActiveTab(v)}
          scrollButtons="auto"
          variant="scrollable"
          sx={{mb: 1, mt: 3, flex: 1}}
        >
          {departamentos.map((dep, i) => (
            <Tab key={`${dep}-${i}`} label={dep} value={dep} />
          ))}
        </Tabs>
        <Button
          data-aos="fade-in"
          data-aos-duration="1500"
          onClick={() => setOpenDeleteTab(true)}
          sx={{
            bgcolor: "error.main",
            fontWeight: 600,
            color: "white",
            py: 1.6,
            px: 2,
            transition: "all 0.2s",
            ":hover": {transform: "scale(1.02)"},
            ":active": {transform: "scale(0.95)"},
          }}
        >
          Excluir departamento
        </Button>
      </Box>

      {colaboradores.filter((c) => c.departamento === activeTab).length > 0 ? (
        <DepartamentosTable
          query={query}
          filter={filter}
          activeTab={activeTab}
          refreshParent={refreshColaboradores}
          openCreateCrud={openCreateCrud}
          setOpenCreateCrud={setOpenCreateCrud}
          colaboradores={colaboradores}
          setColaboradores={setColaboradores}
        />
      ) : (
        <>
          <Typography
            data-aos="fade-in"
            data-aos-duration="800"
            sx={{
              mt: 4,
              mb: 4,
              color: "text.secondary",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Nenhum colaborador neste departamento.
          </Typography>
          <Box data-aos="fade-in" data-aos-duration="800">
            <PrimaryBtn onClick={() => setOpenCreateCrud(true)}>
              Adicionar colaborador
            </PrimaryBtn>
          </Box>
        </>
      )}
    </>
  );
};
export default Colaboradores;
