import { Alert } from 'react-bootstrap';

export default function Cabecalho({ titulo }) {
  return (
    <Alert className="text-center" variant="light">
      <h1>{titulo || 'Título não fornecido'}</h1>
    </Alert>
  );
}
