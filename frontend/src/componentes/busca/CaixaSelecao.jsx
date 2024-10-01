// src/componentes/busca/CaixaSelecao.jsx

import { useEffect, useState } from 'react';
import { Container, Col, Form, Row, Spinner } from 'react-bootstrap';

// Props esperadas:
// enderecoFonteDados: URL para buscar os dados.
// campoChave: Campo que representa a chave primária nos dados.
// campoExibicao: Campo a ser exibido na caixa de seleção.
// funcaoSelecao: Função a ser chamada quando um item for selecionado.
// localLista: Nome da propriedade que contém a lista dentro da resposta.
// tokenAcesso: Token de autorização, se necessário.

export default function CaixaSelecao({
  enderecoFonteDados,
  campoChave,
  campoExibicao,
  funcaoSelecao,
  localLista,
  tokenAcesso,
}) {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setCarregandoDados(true);
        let config;
        if (tokenAcesso) {
          config = {
            method: 'GET',
            headers: {
              Authorization: tokenAcesso,
            },
            credentials: 'include',
          };
        } else {
          config = { method: 'GET', credentials: 'include' };
        }
        const resposta = await fetch(enderecoFonteDados, config);
        const data = await resposta.json();
        setCarregandoDados(false);

        let listaDados;
        if (localLista) {
          listaDados = data[localLista];
        } else {
          listaDados = data;
        }

        if (Array.isArray(listaDados)) {
          setDados(listaDados);
          if (listaDados.length > 0) {
            setValorSelecionado(listaDados[0][campoChave]);
            funcaoSelecao(listaDados[0]);
          }
        } else {
          setDados([]);
          console.error('Esperado um array, mas recebeu:', listaDados);
        }
      } catch (erro) {
        setCarregandoDados(false);
        setDados([]);
        console.error('Erro ao obter dados:', erro);
      }
    }

    fetchData();
  }, [enderecoFonteDados, tokenAcesso, localLista, campoChave, funcaoSelecao]);

  function handleChange(evento) {
    const valor = evento.target.value;
    const itemSelecionado = dados.find((item) => item[campoChave].toString() === valor);
    setValorSelecionado(valor);
    funcaoSelecao(itemSelecionado);
  }

  return (
    <Container>
      <Row>
        <Col md={11}>
          <Form.Select value={valorSelecionado || ''} onChange={handleChange}>
            {Array.isArray(dados) &&
              dados.map((item) => (
                <option key={item[campoChave]} value={item[campoChave]}>
                  {item[campoExibicao]}
                </option>
              ))}
          </Form.Select>
        </Col>
        <Col md={1}>
          {carregandoDados && <Spinner animation="border" />}
        </Col>
      </Row>
    </Container>
  );
}
