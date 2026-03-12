// React
import { Route, Routes } from 'react-router-dom';

// Pages
import Colaboradores from './pages/Colaboradores';
import Layout from './Layout';
import Formulario from './pages/Formulario';
import Login from './pages/cadastro/Login';
import Registro from './pages/cadastro/Registro';
import { TestPage } from './pages/testPage';

const App = () => {
  return (
    <Routes>
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registre-se" element={<Registro />} />
      <Route element={<Layout/>}>
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/formulario" element={<Formulario />} />
      </Route>
    </Routes>
  )
}

export default App