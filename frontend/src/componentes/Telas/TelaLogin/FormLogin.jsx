import { Container, Form, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { ContextoUsuarioLogado } from '../../../App';
import { login } from '../../../servicos/loginService';

export default function FormLogin() {
  const contexto = useContext(ContextoUsuarioLogado);
  const [usuario, setUsuario] = useState({
    usuario: '',
    senha: '',
  });

  function realizarLogin(evento) {
    evento.preventDefault();
    login(usuario.usuario, usuario.senha)
      .then((resposta) => {
        if (resposta?.status) {
          contexto.setUsuarioLogado({
            nome: usuario.usuario,
            logado: true,
            token: resposta.token,
          });
        } else {
          alert(resposta.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao realizar login: ' + erro.message);
      });
  }

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setUsuario({ ...usuario, [name]: value });
  }

  return (
    <Container className="border p-5 m-5">
      <Form onSubmit={realizarLogin}>
        <Form.Group className="mb-3" controlId="usuario">
          <Form.Label>Usuário:</Form.Label>
          <Form.Control
            type="text"
            name="usuario"
            placeholder="Informe o nome do usuário"
            value={usuario.usuario}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="senha">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            type="password"
            name="senha"
            placeholder="Informe a senha de acesso."
            value={usuario.senha}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Entrar
        </Button>
      </Form>
    </Container>
  );
}
