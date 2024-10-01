import Autor from '../Modelo/autor.js';
import conectar from './conexao.js';

export default class AutorDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS autor(
                    aut_codigo INT NOT NULL AUTO_INCREMENT,
                    aut_nome VARCHAR(100) NOT NULL,
                    aut_biografia TEXT,
                    CONSTRAINT pk_autor PRIMARY KEY(aut_codigo)
                );
            `;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(autor) {
        if (autor instanceof Autor) {
            const sql = `INSERT INTO autor(aut_nome, aut_biografia) VALUES(?, ?)`;
            const parametros = [autor.nome, autor.biografia];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            autor.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(autor) {
        if (autor instanceof Autor) {
            const sql = `UPDATE autor SET aut_nome = ?, aut_biografia = ? WHERE aut_codigo = ?`;
            const parametros = [autor.nome, autor.biografia, autor.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(autor) {
        if (autor instanceof Autor) {
            const sql = `DELETE FROM autor WHERE aut_codigo = ?`;
            const parametros = [autor.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaAutores = [];
        let sql = '';
        let parametros = [];

        if (!termo) {
            termo = '';
        }

        if (!isNaN(parseInt(termo))) {
            // Consulta por código
            sql = `SELECT * FROM autor WHERE aut_codigo = ? ORDER BY aut_nome`;
            parametros = [termo];
        } else {
            // Consulta por nome
            sql = `SELECT * FROM autor WHERE aut_nome LIKE ? ORDER BY aut_nome`;
            parametros = ['%' + termo + '%'];
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        for (const registro of registros) {
            const autor = new Autor(registro.aut_codigo, registro.aut_nome, registro.aut_biografia);
            listaAutores.push(autor);
        }

        return listaAutores;
    }
}
