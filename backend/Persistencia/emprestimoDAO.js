import Emprestimo from '../Modelo/emprestimo.js';
import Leitor from '../Modelo/leitor.js';
import Livro from '../Modelo/livro.js';
import conectar from './conexao.js';

export default class EmprestimoDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();

            // Criação da tabela emprestimo
            const sqlEmprestimo = `
                CREATE TABLE IF NOT EXISTS emprestimo(
                    emp_codigo INT NOT NULL AUTO_INCREMENT,
                    emp_dataEmprestimo DATE NOT NULL,
                    emp_dataDevolucao DATE,
                    lei_codigo INT NOT NULL,
                    CONSTRAINT pk_emprestimo PRIMARY KEY(emp_codigo),
                    CONSTRAINT fk_emprestimo_leitor FOREIGN KEY(lei_codigo) REFERENCES leitor(lei_codigo)
                );
            `;
            await conexao.execute(sqlEmprestimo);

            // Criação da tabela associativa emprestimo_livro
            const sqlEmprestimoLivro = `
                CREATE TABLE IF NOT EXISTS emprestimo_livro(
                    emp_codigo INT NOT NULL,
                    liv_codigo INT NOT NULL,
                    CONSTRAINT pk_emprestimo_livro PRIMARY KEY(emp_codigo, liv_codigo),
                    CONSTRAINT fk_emprestimo_livro_emprestimo FOREIGN KEY(emp_codigo) REFERENCES emprestimo(emp_codigo),
                    CONSTRAINT fk_emprestimo_livro_livro FOREIGN KEY(liv_codigo) REFERENCES livro(liv_codigo)
                );
            `;
            await conexao.execute(sqlEmprestimoLivro);

            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const sql = `INSERT INTO emprestimo(emp_dataEmprestimo, emp_dataDevolucao, lei_codigo)
                         VALUES(STR_TO_DATE(?,'%d/%m/%Y'), STR_TO_DATE(?,'%d/%m/%Y'), ?)`;
            const parametros = [emprestimo.dataEmprestimo, emprestimo.dataDevolucao, emprestimo.leitor.codigo];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            emprestimo.codigo = retorno[0].insertId;

            // Inserir livros na tabela associativa
            if (emprestimo.livros && emprestimo.livros.length > 0) {
                for (const livro of emprestimo.livros) {
                    const sqlLivro = `INSERT INTO emprestimo_livro(emp_codigo, liv_codigo) VALUES(?, ?)`;
                    const paramsLivro = [emprestimo.codigo, livro.codigo];
                    await conexao.execute(sqlLivro, paramsLivro);
                }
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const sql = `UPDATE emprestimo SET emp_dataEmprestimo = STR_TO_DATE(?,'%d/%m/%Y'), 
                         emp_dataDevolucao = STR_TO_DATE(?,'%d/%m/%Y'), lei_codigo = ? WHERE emp_codigo = ?`;
            const parametros = [emprestimo.dataEmprestimo, emprestimo.dataDevolucao, emprestimo.leitor.codigo, emprestimo.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);

            // Atualizar livros na tabela associativa
            // Primeiro, remover os livros atuais
            const sqlDeleteLivros = `DELETE FROM emprestimo_livro WHERE emp_codigo = ?`;
            await conexao.execute(sqlDeleteLivros, [emprestimo.codigo]);

            // Inserir os novos livros
            if (emprestimo.livros && emprestimo.livros.length > 0) {
                for (const livro of emprestimo.livros) {
                    const sqlLivro = `INSERT INTO emprestimo_livro(emp_codigo, liv_codigo) VALUES(?, ?)`;
                    const paramsLivro = [emprestimo.codigo, livro.codigo];
                    await conexao.execute(sqlLivro, paramsLivro);
                }
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();

            // Remover os registros da tabela associativa
            const sqlDeleteLivros = `DELETE FROM emprestimo_livro WHERE emp_codigo = ?`;
            await conexao.execute(sqlDeleteLivros, [emprestimo.codigo]);

            // Excluir o empréstimo
            const sql = `DELETE FROM emprestimo WHERE emp_codigo = ?`;
            const parametros = [emprestimo.codigo];
            await conexao.execute(sql, parametros);

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaEmprestimos = [];
        let sql = '';
        let parametros = [];

        if (!termo) {
            termo = '';
        }

        if (!isNaN(parseInt(termo))) {
            // Consulta por código
            sql = `
                SELECT e.*, l.*, GROUP_CONCAT(li.liv_codigo, ':', li.liv_titulo) AS livros
                FROM emprestimo e
                INNER JOIN leitor l ON e.lei_codigo = l.lei_codigo
                LEFT JOIN emprestimo_livro el ON e.emp_codigo = el.emp_codigo
                LEFT JOIN livro li ON el.liv_codigo = li.liv_codigo
                WHERE e.emp_codigo = ?
                GROUP BY e.emp_codigo
                ORDER BY e.emp_dataEmprestimo DESC
            `;
            parametros = [termo];
        } else {
            // Consulta por nome do leitor
            sql = `
                SELECT e.*, l.*, GROUP_CONCAT(li.liv_codigo, ':', li.liv_titulo) AS livros
                FROM emprestimo e
                INNER JOIN leitor l ON e.lei_codigo = l.lei_codigo
                LEFT JOIN emprestimo_livro el ON e.emp_codigo = el.emp_codigo
                LEFT JOIN livro li ON el.liv_codigo = li.liv_codigo
                WHERE l.lei_nome LIKE ?
                GROUP BY e.emp_codigo
                ORDER BY e.emp_dataEmprestimo DESC
            `;
            parametros = ['%' + termo + '%'];
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        for (const registro of registros) {
            const leitor = new Leitor(registro.lei_codigo, registro.lei_nome, registro.lei_email, registro.lei_telefone);

            let livros = [];
            if (registro.livros) {
                const livrosArray = registro.livros.split(',');
                for (const liv of livrosArray) {
                    const [liv_codigo, liv_titulo] = liv.split(':');
                    const livro = new Livro(parseInt(liv_codigo), liv_titulo);
                    livros.push(livro);
                }
            }

            const emprestimo = new Emprestimo(
                registro.emp_codigo,
                registro.emp_dataEmprestimo,
                registro.emp_dataDevolucao,
                leitor,
                livros
            );
            listaEmprestimos.push(emprestimo);
        }

        return listaEmprestimos;
    }
}
