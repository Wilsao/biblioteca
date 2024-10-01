import { Form, Button, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { gravar, alterar } from '../../../servicos/leitorService';
import { ContextoUsuarioLogado } from '../../../App';

export default function FormCadLeitor(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const partes = dateString.split('/');
    if (partes.length !== 3) return dateString;
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  const [leitor, setLeitor] = useState(
    props.modoEdicao
      ? {
          ...props.leitorSelecionado,
          dataNascimento: formatDateForInput(props.leitorSelecionado.dataNascimento),
        }
      : { codigo: 0, nome: '', email: '', telefone: '', dataNascimento: '' }
  );

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setLeitor({ ...leitor, [name]: value });
  }

  function salvarLeitor(evento) {
    evento.preventDefault();
    const operacao = props.modoEdicao ? alterar : gravar;
    operacao(leitor, token)
      .then((resposta) => {
        alert(resposta.mensagem);
        props.setAtualizarTela(true);
        props.setExibirTabela(true);
        props.setModoEdicao(false);
      })
      .catch((erro) => {
        alert('Erro ao salvar leitor: ' + erro.message);
      });
  }

  return (
    <Container>
      <Form onSubmit={salvarLeitor}>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={leitor.nome}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={leitor.email}
            onChange={manipularMudanca}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefone">
          <Form.Label>Telefone:</Form.Label>
          <Form.Control
            type="text"
            name="telefone"
            value={leitor.telefone}
            onChange={manipularMudanca}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="dataNascimento">
          <Form.Label>Data de Nascimento:</Form.Label>
          <Form.Control
            type="date"
            name="dataNascimento"
            value={leitor.dataNascimento}
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
