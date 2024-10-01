import Livro from '../Modelo/livro.js';
import Autor from '../Modelo/autor.js';
import Genero from '../Modelo/genero.js';
import conectar from './conexao.js';

export default class LivroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();

            // Criação da tabela autor (se não existir)
            const sqlAutor = `
                CREATE TABLE IF NOT EXISTS autor(
                    aut_codigo INT NOT NULL AUTO_INCREMENT,
                    aut_nome VARCHAR(100) NOT NULL,
                    aut_biografia TEXT,
                    CONSTRAINT pk_autor PRIMARY KEY(aut_codigo)
                );
            `;
            await conexao.execute(sqlAutor);

            // Criação da tabela genero (se não existir)
            const sqlGenero = `
                CREATE TABLE IF NOT EXISTS genero(
                    gen_codigo INT NOT NULL AUTO_INCREMENT,
                    gen_descricao VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_genero PRIMARY KEY(gen_codigo)
                );
            `;
            await conexao.execute(sqlGenero);

            // Criação da tabela livro
            const sqlLivro = `
                CREATE TABLE IF NOT EXISTS livro(
                    liv_codigo INT NOT NULL AUTO_INCREMENT,
                    liv_titulo VARCHAR(200) NOT NULL,
                    liv_isbn VARCHAR(20),
                    liv_anoPublicacao INT,
                    aut_codigo INT NOT NULL,
                    CONSTRAINT pk_livro PRIMARY KEY(liv_codigo),
                    CONSTRAINT fk_livro_autor FOREIGN KEY(aut_codigo) REFERENCES autor(aut_codigo)
                );
            `;
            await conexao.execute(sqlLivro);

            // Criação da tabela associativa livro_genero
            const sqlLivroGenero = `
                CREATE TABLE IF NOT EXISTS livro_genero(
                    liv_codigo INT NOT NULL,
                    gen_codigo INT NOT NULL,
                    CONSTRAINT pk_livro_genero PRIMARY KEY(liv_codigo, gen_codigo),
                    CONSTRAINT fk_livro_genero_livro FOREIGN KEY(liv_codigo) REFERENCES livro(liv_codigo),
                    CONSTRAINT fk_livro_genero_genero FOREIGN KEY(gen_codigo) REFERENCES genero(gen_codigo)
                );
            `;
            await conexao.execute(sqlLivroGenero);

            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(livro) {
        if (livro instanceof Livro) {
            const sql = `INSERT INTO livro(liv_titulo, liv_isbn, liv_anoPublicacao, aut_codigo) VALUES(?, ?, ?, ?)`;
            const parametros = [livro.titulo, livro.isbn, livro.anoPublicacao, livro.autor.codigo];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            livro.codigo = retorno[0].insertId;

            // Inserir gêneros na tabela associativa
            if (livro.generos && livro.generos.length > 0) {
                for (const genero of livro.generos) {
                    const sqlGenero = `INSERT INTO livro_genero(liv_codigo, gen_codigo) VALUES(?, ?)`;
                    const paramsGenero = [livro.codigo, genero.codigo];
                    await conexao.execute(sqlGenero, paramsGenero);
                }
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(livro) {
        if (livro instanceof Livro) {
            const sql = `UPDATE livro SET liv_titulo = ?, liv_isbn = ?, liv_anoPublicacao = ?, aut_codigo = ? WHERE liv_codigo = ?`;
            const parametros = [livro.titulo, livro.isbn, livro.anoPublicacao, livro.autor.codigo, livro.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);

            // Atualizar gêneros na tabela associativa
            // Primeiro, remover os gêneros atuais
            const sqlDeleteGeneros = `DELETE FROM livro_genero WHERE liv_codigo = ?`;
            await conexao.execute(sqlDeleteGeneros, [livro.codigo]);

            // Inserir os novos gêneros
            if (livro.generos && livro.generos.length > 0) {
                for (const genero of livro.generos) {
                    const sqlGenero = `INSERT INTO livro_genero(liv_codigo, gen_codigo) VALUES(?, ?)`;
                    const paramsGenero = [livro.codigo, genero.codigo];
                    await conexao.execute(sqlGenero, paramsGenero);
                }
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(livro) {
        if (livro instanceof Livro) {
            const conexao = await conectar();

            // Remover os registros da tabela associativa
            const sqlDeleteGeneros = `DELETE FROM livro_genero WHERE liv_codigo = ?`;
            await conexao.execute(sqlDeleteGeneros, [livro.codigo]);

            // Excluir o livro
            const sql = `DELETE FROM livro WHERE liv_codigo = ?`;
            const parametros = [livro.codigo];
            await conexao.execute(sql, parametros);

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaLivros = [];
        let sql = '';
        let parametros = [];

        if (!termo) {
            termo = '';
        }

        if (!isNaN(parseInt(termo))) {
            // Consulta por código
            sql = `
                SELECT l.*, a.*, GROUP_CONCAT(g.gen_codigo, ':', g.gen_descricao) AS generos
                FROM livro l
                INNER JOIN autor a ON l.aut_codigo = a.aut_codigo
                LEFT JOIN livro_genero lg ON l.liv_codigo = lg.liv_codigo
                LEFT JOIN genero g ON lg.gen_codigo = g.gen_codigo
                WHERE l.liv_codigo = ?
                GROUP BY l.liv_codigo
                ORDER BY l.liv_titulo
            `;
            parametros = [termo];
        } else {
            // Consulta por título
            sql = `
                SELECT l.*, a.*, GROUP_CONCAT(g.gen_codigo, ':', g.gen_descricao) AS generos
                FROM livro l
                INNER JOIN autor a ON l.aut_codigo = a.aut_codigo
                LEFT JOIN livro_genero lg ON l.liv_codigo = lg.liv_codigo
                LEFT JOIN genero g ON lg.gen_codigo = g.gen_codigo
                WHERE l.liv_titulo LIKE ?
                GROUP BY l.liv_codigo
                ORDER BY l.liv_titulo
            `;
            parametros = ['%' + termo + '%'];
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        for (const registro of registros) {
            const autor = new Autor(registro.aut_codigo, registro.aut_nome, registro.aut_biografia);

            let generos = [];
            if (registro.generos) {
                const generosArray = registro.generos.split(',');
                for (const gen of generosArray) {
                    const [gen_codigo, gen_descricao] = gen.split(':');
                    const genero = new Genero(parseInt(gen_codigo), gen_descricao);
                    generos.push(genero);
                }
            }

            const livro = new Livro(
                registro.liv_codigo,
                registro.liv_titulo,
                registro.liv_isbn,
                registro.liv_anoPublicacao,
                autor,
                generos
            );
            listaLivros.push(livro);
        }

        return listaLivros;
    }
}
