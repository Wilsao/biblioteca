import { Table, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { excluir } from '../../../servicos/autorService';
import { ContextoUsuarioLogado } from '../../../App';

export default function TabelaAutores(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function excluirAutor(autor) {
    if (window.confirm(`Deseja excluir o autor ${autor.nome}?`)) {
      excluir({ codigo: autor.codigo }, token)
        .then((resposta) => {
          alert(resposta.mensagem);
          props.setAtualizarTela(true);
        })
        .catch((erro) => {
          alert('Erro ao excluir autor: ' + erro.message);
        });
    }
  }

  function editarAutor(autor) {
    props.setAutorSelecionado(autor);
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
          props.setAutorSelecionado({ codigo: 0, nome: '', biografia: '' });
        }}
      >
        Adicionar Autor
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Biografia</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaDeAutores?.map((autor) => (
            <tr key={autor.codigo}>
              <td>{autor.codigo}</td>
              <td>{autor.nome}</td>
              <td>{autor.biografia}</td>
              <td>
                <Button variant="warning" onClick={() => editarAutor(autor)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => excluirAutor(autor)}>
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
