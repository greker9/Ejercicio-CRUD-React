import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ShowUsuarios from './components/ShowUsuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
