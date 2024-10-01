const urlBase = 'http://localhost:4000/emprestimo';

export async function gravar(emprestimo, token) {
  const resposta = await fetch(urlBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(emprestimo),
  });
  return await resposta.json();
}

export async function alterar(emprestimo, token) {
  const resposta = await fetch(urlBase, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(emprestimo),
  });
  return await resposta.json();
}

export async function excluir(emprestimo, token) {
  const resposta = await fetch(urlBase, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    credentials: 'include',
    body: JSON.stringify(emprestimo),
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
