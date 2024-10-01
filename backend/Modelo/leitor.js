import LeitorDAO from "../Persistencia/leitorDAO.js";

export default class Leitor {
    #codigo;
    #nome;
    #email;
    #telefone;

    constructor(codigo = 0, nome = "", email = "", telefone = "") {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#email = email;
        this.#telefone = telefone;
    }

    // Métodos de acesso
    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }
    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get email() {
        return this.#email;
    }
    set email(novoEmail) {
        this.#email = novoEmail;
    }

    get telefone() {
        return this.#telefone;
    }
    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    // Método para converter o objeto em JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            email: this.#email,
            telefone: this.#telefone
        };
    }

    // Métodos de persistência
    async gravar() {
        const leitorDAO = new LeitorDAO();
        await leitorDAO.gravar(this);
    }

    async excluir() {
        const leitorDAO = new LeitorDAO();
        await leitorDAO.excluir(this);
    }

    async atualizar() {
        const leitorDAO = new LeitorDAO();
        await leitorDAO.atualizar(this);
    }

    async consultar(parametro) {
        const leitorDAO = new LeitorDAO();
        return await leitorDAO.consultar(parametro);
    }
}
