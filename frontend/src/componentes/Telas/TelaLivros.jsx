import { useState, useEffect, useContext } from 'react';
import Pagina from '../Templates/Pagina';
import FormCadLivro from './Formularios/FormCadLivro';
import TabelaLivros from './Tabelas/TabelaLivros';
import { consultarTodos } from '../../servicos/livroService';
import { ContextoUsuarioLogado } from '../../App';

export default function TelaLivros() {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atualizarTela, setAtualizarTela] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState({
    codigo: 0,
    titulo: '',
    isbn: '',
    anoPublicacao: '',
    autor: {},
    generos: [],
  });
  const [listaDeLivros, setListaDeLivros] = useState([]);

  useEffect(() => {
    consultarTodos(token)
      .then((resposta) => {
        if (resposta.status) {
          setListaDeLivros(resposta.listaLivros);
          setAtualizarTela(false);
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao consultar livros: ' + erro.message);
      });
  }, [atualizarTela, token]);

  return (
    <Pagina>
      {exibirTabela ? (
        <TabelaLivros
          listaDeLivros={listaDeLivros}
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setLivroSelecionado={setLivroSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      ) : (
        <FormCadLivro
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          modoEdicao={modoEdicao}
          livroSelecionado={livroSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      )}
    </Pagina>
  );
}
