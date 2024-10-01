import { useState, useRef } from 'react';
import { Container, Form } from 'react-bootstrap';
import './barraBusca.css';

export default function BarraBusca({ placeHolder, dados, campoChave, campoBusca, funcaoSelecao, valor }) {
  const inputBusca = useRef();
  const [termoBusca, setTermoBusca] = useState(valor ? valor : '');
  const [dadosLista, setDadosLista] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(false);

  function filtrarResultado() {
    const resultadosFiltrados = dados.filter((item) => {
      return termoBusca.length > 1
        ? item[campoBusca].toLowerCase().includes(termoBusca.toLowerCase())
        : false;
    });
    setDadosLista(resultadosFiltrados);
  }

  return (
    <Container>
      <div className="barra">
        {/* Ícone de lupa */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l.098.115 3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <Form.Control
          type="text"
          ref={inputBusca}
          placeholder={placeHolder}
          value={termoBusca}
          required
          onChange={(e) => {
            setTermoBusca(e.target.value);
            filtrarResultado();
            if (!itemSelecionado) {
              e.target.setAttribute('aria-invalid', true);
              e.target.setCustomValidity('Selecione um item da lista.');
            } else {
              e.target.removeAttribute('aria-invalid');
              e.target.setCustomValidity('');
            }
          }}
        ></Form.Control>
        {/* Ícone de X para limpar a busca */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-x"
          viewBox="0 0 16 16"
          onClick={() => {
            setTermoBusca('');
            setDadosLista([]);
            setItemSelecionado(false);
            funcaoSelecao({});
            inputBusca.current.setAttribute('aria-invalid', true);
            inputBusca.current.setCustomValidity('Selecione um item da lista.');
          }}
        >
          <path d="M4.646 4.646a.5.5 0 1 1 .708-.708L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 1 1-.708.708L8 8.707 5.354 11.354a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354z" />
        </svg>
      </div>
      {dadosLista.length > 0 && (
        <div className="resultado">
          <ul>
            {dadosLista.map((item) => (
              <li
                key={item[campoChave]}
                onClick={() => {
                  setTermoBusca(item[campoBusca]);
                  setItemSelecionado(true);
                  funcaoSelecao(item);
                  inputBusca.current.setCustomValidity('');
                  setDadosLista([]);
                }}
              >
                {item[campoBusca]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
