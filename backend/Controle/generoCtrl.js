import Genero from "../Modelo/genero.js";

export default class GeneroCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const descricao = dados.descricao;

            if (descricao) {
                const genero = new Genero(0, descricao);
                genero.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": genero.codigo,
                        "mensagem": "Gênero incluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o gênero: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe a descrição do gênero!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um gênero!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const descricao = dados.descricao;

            if (codigo && descricao) {
                const genero = new Genero(codigo, descricao);
                genero.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Gênero atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o gênero: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código e a descrição do gênero!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize os métodos PUT ou PATCH para atualizar um gênero!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const genero = new Genero(codigo);
                genero.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Gênero excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o gênero: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do gênero!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um gênero!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const genero = new Genero();
            genero.consultar(termo).then((listaGeneros) => {
                resposta.json({
                    status: true,
                    listaGeneros
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar gêneros: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar gêneros!"
            });
        }
    }
}
