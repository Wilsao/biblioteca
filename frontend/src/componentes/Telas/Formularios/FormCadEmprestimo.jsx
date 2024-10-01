import { Form, Button, Container } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { gravar, alterar } from '../../../servicos/emprestimoService';
import { ContextoUsuarioLogado } from '../../../App';

export default function FormCadEmprestimo(props) {
  const contexto = useContext(ContextoUsuarioLogado);
  const token = contexto.usuarioLogado.token;

  const [emprestimo, setEmprestimo] = useState(
    props.modoEdicao
      ? props.emprestimoSelecionado
      : {
          codigo: 0,
          dataEmprestimo: '',
          dataDevolucao: '',
          leitor: {},
          livros: [],
        }
  );

  const [leitores, setLeitores] = useState([]);
  const [livros, setLivros] = useState([]);
  const [livrosSelecionados, setLivrosSelecionados] = useState([]);

  useEffect(() => {
    // Obter leitores
    fetch('http://localhost:4000/leitor', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.listaLeitores) {
          setLeitores(data.listaLeitores);
        } else {
          alert('Erro ao obter leitores: ' + data.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao obter leitores: ' + erro.message);
      });

    // Obter livros
    fetch('http://localhost:4000/livro', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.listaLivros) {
          setLivros(data.listaLivros);
        } else {
          alert('Erro ao obter livros: ' + data.mensagem);
        }
      })
      .catch((erro) => {
        alert('Erro ao obter livros: ' + erro.message);
      });
  }, [token]);

  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setEmprestimo({ ...emprestimo, [name]: value });
  }

  function manipularLeitor(evento) {
    const leitorCodigo = parseInt(evento.target.value);
    const leitorSelecionado = leitores.find((leitor) => leitor.codigo === leitorCodigo);
    setEmprestimo({ ...emprestimo, leitor: leitorSelecionado });
  }

  function manipularLivros(evento) {
    const options = evento.target.options;
    const selectedLivros = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedLivros.push(parseInt(options[i].value));
      }
    }
    setLivrosSelecionados(selectedLivros);
    const livrosSelecionadosObjs = livros.filter((livro) =>
      selectedLivros.includes(livro.codigo)
    );
    setEmprestimo({ ...emprestimo, livros: livrosSelecionadosObjs });
  }

  function salvarEmprestimo(evento) {
    evento.preventDefault();
  
    if (!emprestimo.dataEmprestimo) {
      alert('Por favor, informe a Data de Empréstimo.');
      return;
    }
  
    const partesData = emprestimo.dataEmprestimo.split('-');
    const dataEmprestimoFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    emprestimo.dataEmprestimo = dataEmprestimoFormatada;
  
    if (emprestimo.dataDevolucao) {
      const partesDataDevolucao = emprestimo.dataDevolucao.split('-');
      const dataDevolucaoFormatada = `${partesDataDevolucao[2]}/${partesDataDevolucao[1]}/${partesDataDevolucao[0]}`;
      emprestimo.dataDevolucao = dataDevolucaoFormatada;
    }
  
    const operacao = props.modoEdicao ? alterar : gravar;
    operacao(emprestimo, token)
      .then((resposta) => {
        alert(resposta.mensagem);
        props.setAtualizarTela(true);
        props.setExibirTabela(true);
        props.setModoEdicao(false);
      })
      .catch((erro) => {
        alert('Erro ao salvar empréstimo: ' + erro.message);
      });
  }

  return (
    <Container>
      <Form onSubmit={salvarEmprestimo}>
        <Form.Group className="mb-3" controlId="dataEmprestimo">
          <Form.Label>Data de Empréstimo:</Form.Label>
          <Form.Control
            type="date"
            name="dataEmprestimo"
            value={emprestimo.dataEmprestimo}
            onChange={manipularMudanca}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="dataDevolucao">
          <Form.Label>Data de Devolução:</Form.Label>
          <Form.Control
            type="date"
            name="dataDevolucao"
            value={emprestimo.dataDevolucao}
            onChange={manipularMudanca}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="leitor">
          <Form.Label>Leitor:</Form.Label>
          <Form.Select
            value={emprestimo.leitor?.codigo || ''}
            onChange={manipularLeitor}
            required
          >
            <option value="">Selecione um leitor</option>
            {leitores.map((leitor) => (
              <option key={leitor.codigo} value={leitor.codigo}>
                {leitor.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="livros">
          <Form.Label>Livros:</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={livrosSelecionados}
            onChange={manipularLivros}
            required
          >
            {livros.map((livro) => (
              <option key={livro.codigo} value={livro.codigo}>
                {livro.titulo}
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
