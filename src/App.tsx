import { Route, Routes } from 'react-router-dom'
import Colaboradores from './pages/Colaboradores'
import { Layout } from './Layout'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Colaboradores />} />
      </Route>
    </Routes>
  )
}

export default App