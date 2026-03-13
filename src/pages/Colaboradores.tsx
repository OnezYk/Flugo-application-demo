// React
import { useEffect, useState } from "react";


// MUI copmonents
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
Avatar, Chip, Box, Typography, useMediaQuery, Fade} from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';

// AOS Animation
import AOS from 'aos';
import 'aos/dist/aos.css';

// Notionists
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import PrimaryBtn from "../components/PrimaryBtn";

// Types
import type { ColaboradorFormData } from "./Formulario";

// O fetch contém id além dos dados enviados, por isso extenção do tipo
export type ColaboradorProp = ColaboradorFormData & { id: string };

// JWT
import { useAuth } from "../hooks/useAuth";

// Routes
import {getColaboradores} from '../utils/getColaborador';
import { Navigate } from 'react-router-dom'
import { deleteColaborador } from "../utils/deleteColaborador";

import Crud from "../components/Crud";

const Colaboradores = () => {

  const { userLoggedIn  } = useAuth()
  
  const isSmall = useMediaQuery('(max-width: 660px)'); // True quando media < 660px
  const isXSmall = useMediaQuery('(max-width: 500px)'); // True quando media < 660px
  
  // Inicialização da biblioteca de animação
  useEffect(() => {
    AOS.init()
  }, [])
  

  if (!userLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <Box
      sx={{
        position: 'relative',
        right: isXSmall ? 5 : 0,
        p: isSmall ? 0 : 3,
        flexGrow: 0,
        ml: {lg: '300px', md: '100px', xs: 0},
        transform: !isSmall ?'scale(1)':'scale(0.8)',
        transition: 'all 1s'
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          color="text.primary"
          variant="h1"
          sx={{
            fontSize: 27,
            fontWeight: 600,
          }}
          data-aos="fade-right" data-aos-duration="800"
        >
          Colaboradores
        </Typography>

        <Box data-aos="fade-right" data-aos-duration="800" data-aos-delay="250">
          <PrimaryBtn to="/formulario"> Novo Colaborador </PrimaryBtn>
        </Box>

      </Box>

      <ColaboradoresTable />
    </Box>
  );
};

// Tabela de colaboradores
const ColaboradoresTable = () => {

  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // CRUD
  const [openCrud, setOpenCrud] = useState(false)
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorProp | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  // Fetch na montagem do componente
  useEffect(() => {

    getColaboradores().then(data => setColaboradores(data));
    
  },[])

  // Criação procedural de avatar
  const getAvatar = (seed: string) => {
    return createAvatar(notionists, { 
      seed, // usa nome como seed aleatória
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'] // CorBG aleatória
    }).toString();
  }
  
  // Função para fetch filtrado na Firestore 
  const handleGetColaborador = (col: string) => {

  const field = col.toLowerCase()

  // Alternação entre asc e desc
  const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'

  setSortOrder(newOrder)
  getColaboradores(field, newOrder).then(data => setColaboradores(data))

  }

  const handleOpenCrud = (colaborador: ColaboradorProp, isEdit:boolean) => {

    setSelectedColaborador(colaborador);
    setIsEdit(isEdit);
    setOpenCrud(true);

  }

  const handleDeleteColaborador = (id : string) => {

    deleteColaborador(id);
    getColaboradores().then(data => setColaboradores(data));
    
  }
  
  const handleBulkSelect = (id: string) => {
    
    setSelected(p => 
      p.includes(id) ? p.filter(i => i !== id) : [...p, id]
    )
  }
  
  const handleBulkDelete = () => {
    
    selected.forEach(selection => {
      deleteColaborador(selection);
    })
    getColaboradores().then(data => setColaboradores(data));
    
  }

  return (
   <>
   {colaboradores.length >= 1 ?  // Caso tenha colaboradores na Firestore ->

  <>
  <Crud 
    refresh={() => getColaboradores().then(data => setColaboradores(data))}
    key={selectedColaborador?.id} // força remontagem ao trocar colaborador
    isEdit={isEdit} 
    colaborador={selectedColaborador} 
    open={openCrud} 
    handleClose={() => setOpenCrud(false)}
  />
   <TableContainer data-aos="fade-in" data-aos-duration="800"
      sx={{
        boxShadow: 3,
        borderColor: "text.disabled",
        borderRadius: 2,
        marginTop: 2,
        maxHeight: 'calc(100vh - 200px)',
        overflowY: colaboradores.length >= 6 ? 'scroll' : 'hidden',
        mb: 4
      }}
    >
      <Table>
        <TableHead>

          {/* Loop entre os elementos do array */}
          <TableRow sx={{bgcolor: "text.disabled"}}>
            {["","Nome", "Email", "Departamento", "Ações", "Status"].map((col, i) => (

              <TableCell
                onClick={() => {if (col !== "Ações") {handleGetColaborador(col)}}} // Faz o fetch filtrado de acordo com o elemento do array clicado
                key={i}
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: col === "Status" ? "right" : "left",
                  transition: 'all 0.2s',
                  ':hover': col !== "Ações" ? { cursor: 'pointer', bgcolor: 'action.hover' } : undefined
                }}
                >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent:
                      col === "Status" || col === "Ações" ? "flex-end" : "flex-start",
                  }}
                >
                  {col !== '' && <>{col} <SouthRoundedIcon sx={{fontSize: 14}} /></>}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>

          {/* Loop de todos os colaboradores da firestore */}
          {colaboradores.map((row:ColaboradorProp, index) => (
            // Animação em cascata de acordo com qtd de elementos
            <Fade in={true} timeout={300 + index * 200} key={row.id}>

              {/* Seu sx determina o último elemento renderizado do array e estiliza */}
              <TableRow key={row.id} sx={{"&:last-child td": {border: 0}}}>
                <TableCell sx={{maxWidth: 0}}><Checkbox onClick={() => handleBulkSelect(row.id)} size="large"/></TableCell>
                <TableCell>
                  <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>

                    {/* Coleta o svg criado de getAvatar, codifica assegurando o uso da string SVG em src={...} */}
                    <Avatar src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.nome))}`} sx={{width: 36, height: 36}} />
                    <Typography fontWeight={500}>{row.nome}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.departamento}</TableCell>

                {/* Icons CRUD */}
                <TableCell sx={{textAlign: "right", width: 120}}>

                  <Box sx={{display: 'flex', justifyContent: 'end', gap: 2}}>
                    <VisibilityIcon onClick={() => handleOpenCrud(row, false)} sx={{color: '#06A9F4', transition: 'all 0.2s', ':hover': {color: '#0437c2', cursor: 'pointer', transform: 'scale(1.15)'}}}/>
                    <EditIcon onClick={() => handleOpenCrud(row, true)}  sx={{transition: 'all 0.2s', ':hover': {cursor: 'pointer', transform: 'scale(1.15)'}}}/>
                    <DeleteIcon onClick={() => handleDeleteColaborador(row.id)}  sx={{color: 'error.main', transition: 'all 0.2s', ':hover': {color: '#a70f0f', cursor: 'pointer', transform: 'scale(1.15)'}}}/>
                  </Box>

                </TableCell>
                <TableCell sx={{textAlign: "right"}}>

                  {/* Responsividade com o estado de status */}
                  <Chip
                    label={row.status ? "Ativo" : "Inativo"}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      bgcolor:
                        row.status ? 'success.light' : "error.light",
                      color:
                        row.status ? "success.main" : "error.main",
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
    <PrimaryBtn onClick={handleBulkDelete} disabled={selected.length < 1} >Deletar selecionados</PrimaryBtn>
    </>
    : // Caso não há colaboradores na Firestore ->
    <Typography data-aos="fade-right" data-aos-delay="150" data-aos-duration="800" variant="h2" sx={{
      mt: {sm:2, xs:7},
      fontSize: 20,
      fontWeight: 600,
      color: 'text.secondary',
      textAlign: {sm: 'start', xs: 'center'},
    }}>Sem colaboradores por enquanto, experimente cadastrar um!</Typography>}
    </>
  );
};

export default Colaboradores;
