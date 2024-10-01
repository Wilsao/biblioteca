import GeneroDAO from "../Persistencia/generoDAO.js";

export default class Genero {
    #codigo;
    #descricao;

    constructor(codigo = 0, descricao = "") {
        this.#codigo = codigo;
        this.#descricao = descricao;
    }

    // Métodos de acesso
    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    // Método para converter o objeto em JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            descricao: this.#descricao
        };
    }

    // Métodos de persistência
    async gravar() {
        const generoDAO = new GeneroDAO();
        await generoDAO.gravar(this);
    }

    async excluir() {
        const generoDAO = new GeneroDAO();
        await generoDAO.excluir(this);
    }

    async atualizar() {
        const generoDAO = new GeneroDAO();
        await generoDAO.atualizar(this);
    }

    async consultar(parametro) {
        const generoDAO = new GeneroDAO();
        return await generoDAO.consultar(parametro);
    }
}
