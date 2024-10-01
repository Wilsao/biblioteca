import { useState, useEffect, useContext } from 'react';
import Pagina from '../Templates/Pagina';
import FormCadLeitor from './Formularios/FormCadLeitor';
import TabelaLeitores from './Tabelas/TabelaLeitores';
import { consultarTodos } from '../../servicos/leitorService';
import { ContextoUsuarioLogado } from '../../App';

export default function TelaLeitores() {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atualizarTela, setAtualizarTela] = useState(false);
  const [leitorSelecionado, setLeitorSelecionado] = useState({
    codigo: 0,
    nome: '',
    email: '',
    telefone: '',
  });
  const [listaDeLeitores, setListaDeLeitores] = useState([]);

  useEffect(() => {
    consultarTodos(token)
      .then((resposta) => {
        if (resposta.status) {
          setListaDeLeitores(resposta.listaLeitores);
          setAtualizarTela(false);
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao consultar leitores: ' + erro.message);
      });
  }, [atualizarTela, token]);

  return (
    <Pagina>
      {exibirTabela ? (
        <TabelaLeitores
          listaDeLeitores={listaDeLeitores}
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setLeitorSelecionado={setLeitorSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      ) : (
        <FormCadLeitor
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          modoEdicao={modoEdicao}
          leitorSelecionado={leitorSelecionado}
          setAtualizarTela={setAtualizarTela}
        />
      )}
    </Pagina>
  );
}
