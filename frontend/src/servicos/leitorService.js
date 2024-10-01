const urlBase = 'http://localhost:4000/leitor';

export async function gravar(leitor, token) {
  const resposta = await fetch(urlBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(leitor),
  });
  return await resposta.json();
}

export async function alterar(leitor, token) {
  const resposta = await fetch(urlBase, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(leitor),
  });
  return await resposta.json();
}

export async function excluir(leitor, token) {
  const resposta = await fetch(urlBase, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(leitor),
  });
  return await resposta.json();
}

export async function consultarTodos(token) {
  const resposta = await fetch(urlBase, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
    credentials: 'include',
  });
  return await resposta.json();
}
