import { useState, useEffect, useContext } from 'react';
import Pagina from '../Templates/Pagina';
import FormCadEmprestimo from './Formularios/FormCadEmprestimo';
import TabelaEmprestimos from './Tabelas/TabelaEmprestimos';
import { consultarTodos } from '../../servicos/emprestimoService';
import { ContextoUsuarioLogado } from '../../App';

export default function TelaEmprestimos() {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atualizarTela, setAtualizarTela] = useState(false);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState({
    codigo: 0,
    dataEmprestimo: '',
    dataDevolucao: '',
    leitor: {},
    livros: [],
  });
  const [listaDeEmprestimos, setListaDeEmprestimos] = useState([]);

  useEffect(() => {
    consultarTodos(token)
      .then((resposta) => {
        if (resposta.status) {
          setListaDeEmprestimos(resposta.listaEmprestimos);
          setAtualizarTela(false);
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao consultar empréstimos: ' + erro.message);
      });
  }, [atualizarTela, token]);

  return (
    <Pagina>
      {exibirTabela ? (
        <TabelaEmprestimos
          listaDeEmprestimos={listaDeEmprestimos}
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setEmprestimoSelecionado={setEmprestimoSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      ) : (
        <FormCadEmprestimo
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          modoEdicao={modoEdicao}
          emprestimoSelecionado={emprestimoSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      )}
    </Pagina>
  );
}
