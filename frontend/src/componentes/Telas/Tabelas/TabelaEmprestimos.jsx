import { Table, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { excluir } from '../../../servicos/emprestimoService';
import { ContextoUsuarioLogado } from '../../../App';

export default function TabelaEmprestimos(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function excluirEmprestimo(emprestimo) {
    if (window.confirm(`Deseja excluir o empréstimo de código ${emprestimo.codigo}?`)) {
      excluir({ codigo: emprestimo.codigo }, token)
        .then((resposta) => {
          alert(resposta.mensagem);
          props.setAtualizarTela(true);
        })
        .catch((erro) => {
          alert('Erro ao excluir empréstimo: ' + erro.message);
        });
    }
  }

  function editarEmprestimo(emprestimo) {
    props.setEmprestimoSelecionado(emprestimo);
    props.setModoEdicao(true);
    props.setExibirTabela(false);
  }

  return (
    <div>
      <Button
        className="mb-3"
        variant="primary"
        onClick={() => {
          props.setExibirTabela(false);
          props.setModoEdicao(false);
          props.setEmprestimoSelecionado({
            codigo: 0,
            dataEmprestimo: '',
            dataDevolucao: '',
            leitor: {},
            livros: [],
          });
        }}
      >
        Registrar Empréstimo
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Data Empréstimo</th>
            <th>Data Devolução</th>
            <th>Leitor</th>
            <th>Livros</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaDeEmprestimos?.map((emprestimo) => (
            <tr key={emprestimo.codigo}>
              <td>{emprestimo.codigo}</td>
              <td>{emprestimo.dataEmprestimo}</td>
              <td>{emprestimo.dataDevolucao}</td>
              <td>{emprestimo.leitor.nome}</td>
              <td>{emprestimo.livros.map((l) => l.titulo).join(', ')}</td>
              <td>
                <Button variant="warning" onClick={() => editarEmprestimo(emprestimo)}>
                  Editar
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => excluirEmprestimo(emprestimo)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
