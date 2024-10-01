import { Router } from "express";
import GeneroCtrl from "../Controle/generoCtrl.js";

const generoCtrl = new GeneroCtrl();
const rotaGenero = new Router();

rotaGenero
    .get('/', generoCtrl.consultar)
    .get('/:termo', generoCtrl.consultar)
    .post('/', generoCtrl.gravar)
    .patch('/', generoCtrl.atualizar)
    .put('/', generoCtrl.atualizar)
    .delete('/', generoCtrl.excluir);

export default rotaGenero;
