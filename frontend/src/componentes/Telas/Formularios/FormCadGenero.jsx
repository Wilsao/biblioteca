import { Form, Button, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { gravar, alterar } from '../../../servicos/generoService';
import { ContextoUsuarioLogado } from '../../../App';

export default function FormCadGenero(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [genero, setGenero] = useState(
    props.modoEdicao
      ? props.generoSelecionado
      : { codigo: 0, descricao: '' }
  );

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setGenero({ ...genero, [name]: value });
  }

  function salvarGenero(evento) {
    evento.preventDefault();
    const operacao = props.modoEdicao ? alterar : gravar;
    operacao(genero, token)
      .then((resposta) => {
        alert(resposta.mensagem);
        props.setAtualizarTela(true);
        props.setExibirTabela(true);
        props.setModoEdicao(false);
      })
      .catch((erro) => {
        alert('Erro ao salvar gênero: ' + erro.message);
      });
  }

  return (
    <Container>
      <Form onSubmit={salvarGenero}>
        <Form.Group className="mb-3" controlId="descricao">
          <Form.Label>Descrição:</Form.Label>
          <Form.Control
            type="text"
            name="descricao"
            value={genero.descricao}
            onChange={manipularMudanca}
            required
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
