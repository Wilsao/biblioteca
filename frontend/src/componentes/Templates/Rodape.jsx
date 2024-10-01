import { Alert } from 'react-bootstrap';

export default function Rodape({ informacoes }) {
  return (
    <footer className="footer fixed-bottom">
      <Alert className="text-center" variant="light">
        <h6>{informacoes || 'Informações não fornecidas.'}</h6>
      </Alert>
    </footer>
  );
}
