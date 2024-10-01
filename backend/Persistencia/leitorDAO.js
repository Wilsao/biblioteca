import Leitor from '../Modelo/leitor.js';
import conectar from './conexao.js';

export default class LeitorDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS leitor(
                    lei_codigo INT NOT NULL AUTO_INCREMENT,
                    lei_nome VARCHAR(100) NOT NULL,
                    lei_email VARCHAR(100),
                    lei_telefone VARCHAR(20),
                    CONSTRAINT pk_leitor PRIMARY KEY(lei_codigo)
                );
            `;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(leitor) {
        if (leitor instanceof Leitor) {
            const sql = `INSERT INTO leitor(lei_nome, lei_email, lei_telefone) VALUES(?, ?, ?)`;
            const parametros = [leitor.nome, leitor.email, leitor.telefone];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            leitor.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(leitor) {
        if (leitor instanceof Leitor) {
            const sql = `UPDATE leitor SET lei_nome = ?, lei_email = ?, lei_telefone = ? WHERE lei_codigo = ?`;
            const parametros = [leitor.nome, leitor.email, leitor.telefone, leitor.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(leitor) {
        if (leitor instanceof Leitor) {
            const sql = `DELETE FROM leitor WHERE lei_codigo = ?`;
            const parametros = [leitor.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaLeitores = [];
        let sql = '';
        let parametros = [];

        if (!termo) {
            termo = '';
        }

        if (!isNaN(parseInt(termo))) {
            // Consulta por código
            sql = `SELECT * FROM leitor WHERE lei_codigo = ? ORDER BY lei_nome`;
            parametros = [termo];
        } else {
            // Consulta por nome
            sql = `SELECT * FROM leitor WHERE lei_nome LIKE ? ORDER BY lei_nome`;
            parametros = ['%' + termo + '%'];
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        for (const registro of registros) {
            const leitor = new Leitor(registro.lei_codigo, registro.lei_nome, registro.lei_email, registro.lei_telefone);
            listaLeitores.push(leitor);
        }

        return listaLeitores;
    }
}
