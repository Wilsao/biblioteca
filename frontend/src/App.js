import React, { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import TelaLogin from './componentes/Telas/TelaLogin';
import TelaMenu from './componentes/Telas/TelaMenu';
import TelaAutores from './componentes/Telas/TelaAutores';
import TelaGeneros from './componentes/Telas/TelaGeneros';
import TelaLivros from './componentes/Telas/TelaLivros';
import TelaLeitores from './componentes/Telas/TelaLeitores';
import TelaEmprestimos from './componentes/Telas/TelaEmprestimos';
import Tela404 from './componentes/Telas/Tela404';

export const ContextoUsuarioLogado = createContext(null);

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState({
    nome: '',
    logado: false,
    token: '',
  });

  return (
    <ContextoUsuarioLogado.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      {!usuarioLogado.logado ? (
        <Routes>
          <Route path="*" element={<TelaLogin />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<TelaMenu />} />
          <Route path="/autores" element={<TelaAutores />} />
          <Route path="/generos" element={<TelaGeneros />} />
          <Route path="/livros" element={<TelaLivros />} />
          <Route path="/leitores" element={<TelaLeitores />} />
          <Route path="/emprestimos" element={<TelaEmprestimos />} />
          <Route path="*" element={<Tela404 />} />
        </Routes>
      )}
    </ContextoUsuarioLogado.Provider>
  );
}

export default App;
