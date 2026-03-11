// React
import { useEffect, useState } from "react";

// MUI copmonents
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
Avatar, Chip, Box, Typography, useMediaQuery, Fade, } from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";

// AOS Animation
import AOS from 'aos';
import 'aos/dist/aos.css';

// Notionists
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import PrimaryBtn from "../components/PrimaryBtn";

// Types
import type { FormData } from "./Formulario";

// O fetch contém id além dos dados enviados, por isso extenção do tipo
type ColaboradorProp = FormData & { id: string };

// Routes
import {getColaboradores} from '../utils/getColaborador';

const Colaboradores = () => {

  const isSmall = useMediaQuery('(max-width: 660px)'); // True quando media < 660px

  // Inicialização da biblioteca de animação
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <Box
      sx={{
        p: 4,
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

  return (
   <>
   {colaboradores.length >= 1 ?  // Caso tenha colaboradores na Firestore ->
   <TableContainer data-aos="fade-in" data-aos-duration="800"
      sx={{
        boxShadow: 3,
        borderColor: "text.disabled",
        borderRadius: 2,
        marginTop: 2,
        maxHeight: 'calc(100vh - 200px)',
        overflowY: colaboradores.length >= 6 ? 'scroll' : 'hidden',
      }}
    >
      <Table>
        <TableHead>

          {/* Loop entre os elementos do array */}
          <TableRow sx={{bgcolor: "text.disabled"}}>
            {["Nome", "Email", "Departamento", "Status"].map((col, i) => (
              <TableCell
                onClick={() => handleGetColaborador(col)} // Faz o fetch filtrado de acordo com o elemento do array clicado
                key={i}
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: col === "Status" ? "right" : "left",
                  transition: 'all 0.2s',
                  ':hover': {cursor: 'pointer', bgcolor: 'action.hover'},
                }}
                >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent:
                      col === "Status" ? "flex-end" : "flex-start",
                  }}
                >
                  {col} <SouthRoundedIcon sx={{fontSize: 14}} />
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
                <TableCell>
                  <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>

                    {/* Coleta o svg criado de getAvatar, codifica assegurando o uso da string SVG em src={...} */}
                    <Avatar src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.nome))}`} sx={{width: 36, height: 36}} />
                    <Typography fontWeight={500}>{row.nome}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.departamento}</TableCell>
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
    : // Caso não há colaboradores na Firestore ->
    <Typography data-aos="fade-right" data-aos-delay="150" data-aos-duration="800" variant="h2" sx={{
      mt:2,
      fontSize: 20,
      fontWeight: 600,
      color: 'text.secondary'
    }}>Sem colaboradores por enquanto, experimente cadastrar um!</Typography>}
    </>
  );
};

export default Colaboradores;
