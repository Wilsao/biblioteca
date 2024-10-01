import { Router } from "express";
import LeitorCtrl from "../Controle/leitorCtrl.js";

const leitorCtrl = new LeitorCtrl();
const rotaLeitor = new Router();

rotaLeitor
    .get('/', leitorCtrl.consultar)
    .get('/:termo', leitorCtrl.consultar)
    .post('/', leitorCtrl.gravar)
    .patch('/', leitorCtrl.atualizar)
    .put('/', leitorCtrl.atualizar)
    .delete('/', leitorCtrl.excluir);

export default rotaLeitor;
