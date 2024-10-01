import { Router } from "express";
import EmprestimoCtrl from "../Controle/emprestimoCtrl.js";

const emprestimoCtrl = new EmprestimoCtrl();
const rotaEmprestimo = new Router();

rotaEmprestimo
    .get('/', emprestimoCtrl.consultar)
    .get('/:termo', emprestimoCtrl.consultar)
    .post('/', emprestimoCtrl.gravar)
    .patch('/', emprestimoCtrl.atualizar)
    .put('/', emprestimoCtrl.atualizar)
    .delete('/', emprestimoCtrl.excluir);

export default rotaEmprestimo;
