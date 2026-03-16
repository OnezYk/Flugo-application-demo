// React
import {Navigate, Route, Routes} from "react-router-dom";
import Layout from "./Layout";

// Pages
import Registro from "./pages/cadastro/Registro";
import Login from "./pages/cadastro/Login";
import Colaboradores from "./pages/Colaboradores";
import Formulario from "./pages/Formulario";
import Departamentos from "./pages/Departamentos";
import NewDepartamento from "./pages/NewDepartamento";
import NotFound from "./pages/NotFound";

// Hooks
import {useAuth} from "./hooks/useAuth";

const App = () => {
  const {userLoggedIn} = useAuth();

  return (
    // Routing em rotas 404
    <Routes>
      {userLoggedIn ? (
        <Route path="*" element={<Navigate replace to="/404" />} />
      ) : (
        <Route path="*" element={<Navigate replace to="/login" />} />
      )}

      <Route path="/login" element={<Login />} />
      <Route path="/registre-se" element={<Registro />} />
      <Route element={<Layout />}>
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/newdepartamento" element={<NewDepartamento />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
};

export default App;
