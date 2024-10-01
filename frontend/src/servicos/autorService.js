const urlBase = 'http://localhost:4000/autor';

export async function gravar(autor, token) {
  const resposta = await fetch(urlBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(autor),
  });
  return await resposta.json();
}

export async function alterar(autor, token) {
  const resposta = await fetch(urlBase, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(autor),
  });
  return await resposta.json();
}

export async function excluir(autor, token) {
  const resposta = await fetch(urlBase, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(autor),
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
