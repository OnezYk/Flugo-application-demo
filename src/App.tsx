// React
import { Route, Routes } from 'react-router-dom';

// Pages
import Colaboradores from './pages/Colaboradores';
import Layout from './Layout';
import Formulario from './pages/Formulario';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Colaboradores />} />
        <Route path="/formulario" element={<Formulario />} />
      </Route>
    </Routes>
  )
}

export default App