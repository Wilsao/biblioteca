import Menu from './Menu';
import Cabecalho from './Cabecalho';
import { Container } from 'react-bootstrap';
import Rodape from './Rodape';
import { useContext } from 'react';
import { ContextoUsuarioLogado } from '../../App';

export default function Pagina(props) {
  const { usuarioLogado } = useContext(ContextoUsuarioLogado);

  return (
    <Container>
      <Cabecalho titulo="Sistema de Gerenciamento de Biblioteca" />
      {usuarioLogado.logado && <Menu />}
      {props.children}
      <Rodape informacoes="Endereço da Biblioteca - Contato: (XX) XXXX-XXXX" />
    </Container>
  );
}
