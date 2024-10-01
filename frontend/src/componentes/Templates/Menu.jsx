import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Biblioteca
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Cadastros" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/autores">
                Autores
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/generos">
                Gêneros
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/livros">
                Livros
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/leitores">
                Leitores
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Operações" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/emprestimos">
                Empréstimos
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/sobre">
              Sobre
            </Nav.Link>
            <Nav.Link as={Link} to="/sair">
              Sair
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
