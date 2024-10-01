import { useEffect, useContext } from 'react';
import { ContextoUsuarioLogado } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function TelaSair() {
  const { setUsuarioLogado } = useContext(ContextoUsuarioLogado);
  const navigate = useNavigate();

  useEffect(() => {
    setUsuarioLogado({
      nome: '',
      logado: false,
      token: '',
    });
    navigate('/');
  }, [setUsuarioLogado, navigate]);

  return null;
}
