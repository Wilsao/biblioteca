import { useState, useEffect, useContext } from 'react';
import Pagina from '../Templates/Pagina';
import FormCadGenero from './Formularios/FormCadGenero';
import TabelaGeneros from './Tabelas/TabelaGeneros';
import { consultarTodos } from '../../servicos/generoService';
import { ContextoUsuarioLogado } from '../../App';

export default function TelaGeneros() {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atualizarTela, setAtualizarTela] = useState(false);
  const [generoSelecionado, setGeneroSelecionado] = useState({
    codigo: 0,
    descricao: '',
  });
  const [listaDeGeneros, setListaDeGeneros] = useState([]);

  useEffect(() => {
    consultarTodos(token)
      .then((resposta) => {
        if (resposta.status) {
          setListaDeGeneros(resposta.listaGeneros);
          setAtualizarTela(false);
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao consultar gêneros: ' + erro.message);
      });
  }, [atualizarTela, token]);

  return (
    <Pagina>
      {exibirTabela ? (
        <TabelaGeneros
          listaDeGeneros={listaDeGeneros}
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setGeneroSelecionado={setGeneroSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      ) : (
        <FormCadGenero
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          modoEdicao={modoEdicao}
          generoSelecionado={generoSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      )}
    </Pagina>
  );
}
