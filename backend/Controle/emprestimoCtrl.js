import Emprestimo from "../Modelo/emprestimo.js";
import Leitor from "../Modelo/leitor.js";

export default class EmprestimoCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const dataEmprestimo = dados.dataEmprestimo;
            const dataDevolucao = dados.dataDevolucao || "";
            const leitorDados = dados.leitor;
            const livrosDados = dados.livros || [];

            if (dataEmprestimo && leitorDados && leitorDados.codigo && livrosDados.length > 0) {
                const leitor = new Leitor(leitorDados.codigo);
                const emprestimo = new Emprestimo(0, dataEmprestimo, dataDevolucao, leitor, livrosDados);

                emprestimo.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": emprestimo.codigo,
                        "mensagem": "Empréstimo registrado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o empréstimo: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a data de empréstimo, leitor e ao menos um livro!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para registrar um empréstimo!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const dataEmprestimo = dados.dataEmprestimo;
            const dataDevolucao = dados.dataDevolucao || "";
            const leitorDados = dados.leitor;
            const livrosDados = dados.livros || [];

            if (codigo && dataEmprestimo && leitorDados && leitorDados.codigo && livrosDados.length > 0) {
                const leitor = new Leitor(leitorDados.codigo);
                const emprestimo = new Emprestimo(codigo, dataEmprestimo, dataDevolucao, leitor, livrosDados);

                emprestimo.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Empréstimo atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o empréstimo: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados do empréstimo!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize os métodos PUT ou PATCH para atualizar um empréstimo!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const emprestimo = new Emprestimo(codigo);
                emprestimo.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Empréstimo excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o empréstimo: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do empréstimo!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um empréstimo!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const emprestimo = new Emprestimo();
            emprestimo.consultar(termo).then((listaEmprestimos) => {
                resposta.json({
                    status: true,
                    listaEmprestimos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar empréstimos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar empréstimos!"
            });
        }
    }
}
