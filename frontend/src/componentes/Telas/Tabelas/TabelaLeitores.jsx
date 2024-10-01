import { Table, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { excluir } from '../../../servicos/leitorService';
import { ContextoUsuarioLogado } from '../../../App';

export default function TabelaLeitores(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function excluirLeitor(leitor) {
    if (window.confirm(`Deseja excluir o leitor ${leitor.nome}?`)) {
      excluir({ codigo: leitor.codigo }, token)
        .then((resposta) => {
          alert(resposta.mensagem);
          props.setAtualizarTela(true);
        })
        .catch((erro) => {
          alert('Erro ao excluir leitor: ' + erro.message);
        });
    }
  }

  function editarLeitor(leitor) {
    props.setLeitorSelecionado(leitor);
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
          props.setLeitorSelecionado({ codigo: 0, nome: '', email: '', telefone: '' });
        }}
      >
        Adicionar Leitor
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaDeLeitores?.map((leitor) => (
            <tr key={leitor.codigo}>
              <td>{leitor.codigo}</td>
              <td>{leitor.nome}</td>
              <td>{leitor.email}</td>
              <td>{leitor.telefone}</td>
              <td>
                <Button variant="warning" onClick={() => editarLeitor(leitor)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => excluirLeitor(leitor)}>
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
