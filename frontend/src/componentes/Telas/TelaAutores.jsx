import { useState, useEffect, useContext } from 'react';
import Pagina from '../Templates/Pagina';
import FormCadAutor from './Formularios/FormCadAutor';
import TabelaAutores from './Tabelas/TabelaAutores';
import { consultarTodos } from '../../servicos/autorService';
import { ContextoUsuarioLogado } from '../../App';

export default function TelaAutores() {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atualizarTela, setAtualizarTela] = useState(false);
  const [autorSelecionado, setAutorSelecionado] = useState({
    codigo: 0,
    nome: '',
    biografia: '',
  });
  const [listaDeAutores, setListaDeAutores] = useState([]);

  useEffect(() => {
    consultarTodos(token)
      .then((resposta) => {
        if (resposta.status) {
          setListaDeAutores(resposta.listaAutores);
          setAtualizarTela(false);
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao consultar autores: ' + erro.message);
      });
  }, [atualizarTela, token]);

  return (
    <Pagina>
      {exibirTabela ? (
        <TabelaAutores
          listaDeAutores={listaDeAutores}
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setAutorSelecionado={setAutorSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      ) : (
        <FormCadAutor
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          modoEdicao={modoEdicao}
          autorSelecionado={autorSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      )}
    </Pagina>
  );
}
