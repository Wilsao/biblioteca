import Genero from '../Modelo/genero.js';
import conectar from './conexao.js';

export default class GeneroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS genero(
                    gen_codigo INT NOT NULL AUTO_INCREMENT,
                    gen_descricao VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_genero PRIMARY KEY(gen_codigo)
                );
            `;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(genero) {
        if (genero instanceof Genero) {
            const sql = `INSERT INTO genero(gen_descricao) VALUES(?)`;
            const parametros = [genero.descricao];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            genero.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(genero) {
        if (genero instanceof Genero) {
            const sql = `UPDATE genero SET gen_descricao = ? WHERE gen_codigo = ?`;
            const parametros = [genero.descricao, genero.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(genero) {
        if (genero instanceof Genero) {
            const sql = `DELETE FROM genero WHERE gen_codigo = ?`;
            const parametros = [genero.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaGeneros = [];
        let sql = '';
        let parametros = [];

        if (!termo) {
            termo = '';
        }

        if (!isNaN(parseInt(termo))) {
            // Consulta por código
            sql = `SELECT * FROM genero WHERE gen_codigo = ? ORDER BY gen_descricao`;
            parametros = [termo];
        } else {
            // Consulta por descrição
            sql = `SELECT * FROM genero WHERE gen_descricao LIKE ? ORDER BY gen_descricao`;
            parametros = ['%' + termo + '%'];
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        for (const registro of registros) {
            const genero = new Genero(registro.gen_codigo, registro.gen_descricao);
            listaGeneros.push(genero);
        }

        return listaGeneros;
    }
}
