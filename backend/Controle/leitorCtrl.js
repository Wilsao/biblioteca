import Leitor from "../Modelo/leitor.js";

export default class LeitorCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const email = dados.email || "";
            const telefone = dados.telefone || "";

            if (nome) {
                const leitor = new Leitor(0, nome, email, telefone);
                leitor.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": leitor.codigo,
                        "mensagem": "Leitor incluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o leitor: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o nome do leitor!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um leitor!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const email = dados.email || "";
            const telefone = dados.telefone || "";

            if (codigo && nome) {
                const leitor = new Leitor(codigo, nome, email, telefone);
                leitor.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Leitor atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o leitor: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código e o nome do leitor!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize os métodos PUT ou PATCH para atualizar um leitor!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const leitor = new Leitor(codigo);
                leitor.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Leitor excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o leitor: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do leitor!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um leitor!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const leitor = new Leitor();
            leitor.consultar(termo).then((listaLeitores) => {
                resposta.json({
                    status: true,
                    listaLeitores
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar leitores: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar leitores!"
            });
        }
    }
}
