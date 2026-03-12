// React
import { Navigate, Route, Routes } from 'react-router-dom';

// Pages
import Colaboradores from './pages/Colaboradores';
import Layout from './Layout';
import Formulario from './pages/Formulario';
import Login from './pages/cadastro/Login';
import Registro from './pages/cadastro/Registro';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/NotFound';
import Departamentos from './pages/Departamentos';

const App = () => {

  const { userLoggedIn  } = useAuth()

  return (
    <Routes>

        {userLoggedIn ? (
          <Route path="*" element={<Navigate replace to="/404" />} />
        ) : (
          <Route path="*" element={<Navigate replace to="/login" />} />
        )}

        <Route path="/login" element={<Login />} />
        <Route path="/registre-se" element={<Registro />} />
      <Route element={<Layout/>}>
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/departamentos" element={<Departamentos />} />
      </Route>


        <Route path="/404" element={<NotFound />} />
    </Routes>
  )
}

export default App