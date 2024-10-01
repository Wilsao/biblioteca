import LivroDAO from "../Persistencia/livroDAO.js";
import Autor from "./autor.js";

export default class Livro {
    #codigo;
    #titulo;
    #isbn;
    #anoPublicacao;
    #autor; // Instância de Autor
    #generos; // Lista de Gêneros

    constructor(
        codigo = 0,
        titulo = "",
        isbn = "",
        anoPublicacao = "",
        autor = null,
        generos = []
    ) {
        this.#codigo = codigo;
        this.#titulo = titulo;
        this.#isbn = isbn;
        this.#anoPublicacao = anoPublicacao;
        this.#autor = autor; // Deve ser uma instância de Autor
        this.#generos = generos; // Array de instâncias de Gênero
    }

    // Métodos de acesso
    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get titulo() {
        return this.#titulo;
    }
    set titulo(novoTitulo) {
        this.#titulo = novoTitulo;
    }

    get isbn() {
        return this.#isbn;
    }
    set isbn(novoIsbn) {
        this.#isbn = novoIsbn;
    }

    get anoPublicacao() {
        return this.#anoPublicacao;
    }
    set anoPublicacao(novoAno) {
        this.#anoPublicacao = novoAno;
    }

    get autor() {
        return this.#autor;
    }
    set autor(novoAutor) {
        if (novoAutor instanceof Autor) {
            this.#autor = novoAutor;
        }
    }

    get generos() {
        return this.#generos;
    }
    set generos(novosGeneros) {
        this.#generos = novosGeneros;
    }

    // Método para converter o objeto em JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            titulo: this.#titulo,
            isbn: this.#isbn,
            anoPublicacao: this.#anoPublicacao,
            autor: this.#autor,
            generos: this.#generos
        };
    }

    // Métodos de persistência
    async gravar() {
        const livroDAO = new LivroDAO();
        await livroDAO.gravar(this);
    }

    async excluir() {
        const livroDAO = new LivroDAO();
        await livroDAO.excluir(this);
    }

    async atualizar() {
        const livroDAO = new LivroDAO();
        await livroDAO.atualizar(this);
    }

    async consultar(parametro) {
        const livroDAO = new LivroDAO();
        return await livroDAO.consultar(parametro);
    }
}
