import { Form, Button, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { gravar, alterar } from '../../../servicos/autorService';
import { ContextoUsuarioLogado } from '../../../App';

export default function FormCadAutor(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [autor, setAutor] = useState(
    props.modoEdicao
      ? props.autorSelecionado
      : { codigo: 0, nome: '', biografia: '' }
  );

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setAutor({ ...autor, [name]: value });
  }

  function salvarAutor(evento) {
    evento.preventDefault();
    const operacao = props.modoEdicao ? alterar : gravar;
    operacao(autor, token)
      .then((resposta) => {
        alert(resposta.mensagem);
        props.setAtualizarTela(true);
        props.setExibirTabela(true);
        props.setModoEdicao(false);
      })
      .catch((erro) => {
        alert('Erro ao salvar autor: ' + erro.message);
      });
  }

  return (
    <Container>
      <Form onSubmit={salvarAutor}>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={autor.nome}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="biografia">
          <Form.Label>Biografia:</Form.Label>
          <Form.Control
            as="textarea"
            name="biografia"
            value={autor.biografia}
            onChange={manipularMudanca}
          />
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
