import { Table, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { excluir } from '../../../servicos/generoService';
import { ContextoUsuarioLogado } from '../../../App';

export default function TabelaGeneros(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function excluirGenero(genero) {
    if (window.confirm(`Deseja excluir o gênero ${genero.descricao}?`)) {
      excluir({ codigo: genero.codigo }, token)
        .then((resposta) => {
          alert(resposta.mensagem);
          props.setAtualizarTela(true);
        })
        .catch((erro) => {
          alert('Erro ao excluir gênero: ' + erro.message);
        });
    }
  }

  function editarGenero(genero) {
    props.setGeneroSelecionado(genero);
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
          props.setGeneroSelecionado({ codigo: 0, descricao: '' });
        }}
      >
        Adicionar Gênero
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaDeGeneros?.map((genero) => (
            <tr key={genero.codigo}>
              <td>{genero.codigo}</td>
              <td>{genero.descricao}</td>
              <td>
                <Button variant="warning" onClick={() => editarGenero(genero)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => excluirGenero(genero)}>
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
