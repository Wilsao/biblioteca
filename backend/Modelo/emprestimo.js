import EmprestimoDAO from "../Persistencia/emprestimoDAO.js";
import Leitor from "./leitor.js";

export default class Emprestimo {
    #codigo;
    #dataEmprestimo;
    #dataDevolucao;
    #leitor; // Instância de Leitor
    #livros; // Lista de Livros

    constructor(
        codigo = 0,
        dataEmprestimo = "",
        dataDevolucao = "",
        leitor = null,
        livros = []
    ) {
        this.#codigo = codigo;
        this.#dataEmprestimo = dataEmprestimo;
        this.#dataDevolucao = dataDevolucao;
        this.#leitor = leitor;
        this.#livros = livros;
    }

    // Métodos de acesso
    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get dataEmprestimo() {
        return this.#dataEmprestimo;
    }
    set dataEmprestimo(novaData) {
        this.#dataEmprestimo = novaData;
    }

    get dataDevolucao() {
        return this.#dataDevolucao;
    }
    set dataDevolucao(novaData) {
        this.#dataDevolucao = novaData;
    }

    get leitor() {
        return this.#leitor;
    }
    set leitor(novoLeitor) {
        if (novoLeitor instanceof Leitor) {
            this.#leitor = novoLeitor;
        }
    }

    get livros() {
        return this.#livros;
    }
    set livros(novosLivros) {
        this.#livros = novosLivros;
    }

    // Método para converter o objeto em JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            dataEmprestimo: new Date(this.#dataEmprestimo).toLocaleDateString(),
            dataDevolucao: new Date(this.#dataDevolucao).toLocaleDateString(),
            leitor: this.#leitor,
            livros: this.#livros
        };
    }

    // Métodos de persistência
    async gravar() {
        const emprestimoDAO = new EmprestimoDAO();
        await emprestimoDAO.gravar(this);
    }

    async excluir() {
        const emprestimoDAO = new EmprestimoDAO();
        await emprestimoDAO.excluir(this);
    }

    async atualizar() {
        const emprestimoDAO = new EmprestimoDAO();
        await emprestimoDAO.atualizar(this);
    }

    async consultar(parametro) {
        const emprestimoDAO = new EmprestimoDAO();
        return await emprestimoDAO.consultar(parametro);
    }
}
