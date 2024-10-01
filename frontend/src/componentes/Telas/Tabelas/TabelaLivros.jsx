import { Table, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { excluir } from '../../../servicos/livroService';
import { ContextoUsuarioLogado } from '../../../App';

export default function TabelaLivros(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function excluirLivro(livro) {
    if (window.confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
      excluir({ codigo: livro.codigo }, token)
        .then((resposta) => {
          alert(resposta.mensagem);
          props.setAtualizarTela(true);
        })
        .catch((erro) => {
          alert('Erro ao excluir livro: ' + erro.message);
        });
    }
  }

  function editarLivro(livro) {
    props.setLivroSelecionado(livro);
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
          props.setLivroSelecionado({
            codigo: 0,
            titulo: '',
            isbn: '',
            anoPublicacao: '',
            autor: {},
            generos: [],
          });
        }}
      >
        Adicionar Livro
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>ISBN</th>
            <th>Ano</th>
            <th>Autor</th>
            <th>Gêneros</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaDeLivros?.map((livro) => (
            <tr key={livro.codigo}>
              <td>{livro.codigo}</td>
              <td>{livro.titulo}</td>
              <td>{livro.isbn}</td>
              <td>{livro.anoPublicacao}</td>
              <td>{livro.autor.nome}</td>
              <td>{livro.generos.map((g) => g.descricao).join(', ')}</td>
              <td>
                <Button variant="warning" onClick={() => editarLivro(livro)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => excluirLivro(livro)}>
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
