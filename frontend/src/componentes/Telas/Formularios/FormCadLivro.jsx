import { Form, Button, Container } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { gravar, alterar } from '../../../servicos/livroService';
import { ContextoUsuarioLogado } from '../../../App';

export default function FormCadLivro(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [livro, setLivro] = useState(
    props.modoEdicao
      ? props.livroSelecionado
      : { codigo: 0, titulo: '', isbn: '', anoPublicacao: '', autor: {}, generos: [] }
  );

  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [generosSelecionados, setGenerosSelecionados] = useState(
    props.modoEdicao ? props.livroSelecionado.generos.map((g) => g.codigo) : []
  );

  useEffect(() => {
    // Obter a lista de autores
    fetch('http://localhost:4000/autor', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.listaAutores) {
          setAutores(data.listaAutores);
        } else {
          alert('Erro ao obter autores: ' + data.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao obter autores: ' + erro.message);
      });

    // Obter a lista de gêneros
    fetch('http://localhost:4000/genero', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.listaGeneros) {
          setGeneros(data.listaGeneros);
        } else {
          alert('Erro ao obter gêneros: ' + data.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao obter gêneros: ' + erro.message);
      });
  }, [token]);

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setLivro({ ...livro, [name]: value });
  }

  function manipularAutor(evento) {
    const autorCodigo = parseInt(evento.target.value);
    const autorSelecionado = autores.find((autor) => autor.codigo === autorCodigo);
    setLivro({ ...livro, autor: autorSelecionado });
  }

  function manipularGeneros(evento) {
    const options = evento.target.options;
    const selectedGeneros = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedGeneros.push(parseInt(options[i].value));
      }
    }
    setGenerosSelecionados(selectedGeneros);
    const generosSelecionadosObjs = generos.filter((genero) =>
      selectedGeneros.includes(genero.codigo)
    );
    setLivro({ ...livro, generos: generosSelecionadosObjs });
  }

  function salvarLivro(evento) {
    evento.preventDefault();
    const operacao = props.modoEdicao ? alterar : gravar;
    operacao(livro, token)
      .then((resposta) => {
        alert(resposta.mensagem);
        props.setAtualizarTela(true);
        props.setExibirTabela(true);
        props.setModoEdicao(false);
      })
      .catch((erro) => {
        alert('Erro ao salvar livro: ' + erro.message);
      });
  }

  return (
    <Container>
      <Form onSubmit={salvarLivro}>
        <Form.Group className="mb-3" controlId="titulo">
          <Form.Label>Título:</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={livro.titulo}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="isbn">
          <Form.Label>ISBN:</Form.Label>
          <Form.Control
            type="text"
            name="isbn"
            value={livro.isbn}
            onChange={manipularMudanca}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="anoPublicacao">
          <Form.Label>Ano de Publicação:</Form.Label>
          <Form.Control
            type="number"
            name="anoPublicacao"
            value={livro.anoPublicacao}
            onChange={manipularMudanca}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="autor">
          <Form.Label>Autor:</Form.Label>
          <Form.Select
            value={livro.autor?.codigo || ''}
            onChange={manipularAutor}
            required
          >
            <option value="">Selecione um autor</option>
            {autores.map((autor) => (
              <option key={autor.codigo} value={autor.codigo}>
                {autor.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="generos">
          <Form.Label>Gêneros:</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={generosSelecionados}
            onChange={manipularGeneros}
            required
          >
            {generos.map((genero) => (
              <option key={genero.codigo} value={genero.codigo}>
                {genero.descricao}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {props.modoEdicao ? 'Atualizar' : 'Cadastrar'}
        </Button>{' '}
        <Button
          variant="secondary"
          onClick={() => {
            props.setExibirTabela(true);
            props.setModoEdicao(false);
          }}
        >
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}
