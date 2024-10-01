import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import rotaAutenticacao from './Rotas/rotaAutenticacao.js';
import { verificarAutenticacao } from './Seguranca/autenticar.js';

import rotaAutor from './Rotas/rotaAutor.js';
import rotaLivro from './Rotas/rotaLivro.js';
import rotaLeitor from './Rotas/rotaLeitor.js';
import rotaEmprestimo from './Rotas/rotaEmprestimo.js';
import rotaGenero from './Rotas/rotaGenero.js';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const host = '0.0.0.0';
const porta = 4000;

const app = express();

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        sameSite: false,
        maxAge: 1000 * 60 * 15 // 15 minutos
    }
}));

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.0.101:3000"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas protegidas
app.use('/autor', verificarAutenticacao, rotaAutor);
app.use('/livro', verificarAutenticacao, rotaLivro);
app.use('/leitor', verificarAutenticacao, rotaLeitor);
app.use('/emprestimo', verificarAutenticacao, rotaEmprestimo);
app.use('/genero', verificarAutenticacao, rotaGenero);

// Rota de autenticação
app.use('/autenticacao', rotaAutenticacao);

app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});
