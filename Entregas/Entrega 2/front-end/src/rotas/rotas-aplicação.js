import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarLocador from "../páginas/locador/cadastrar-locador";

import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarLocatário from "../páginas/locatário/cadastrar-locatário";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LogarUsuário />} path="/" />
                <Route element={<CadastrarUsuário />} path="criar-usuario" />
                <Route element={<RecuperarAcesso />} path="recuperar-acesso" />
                <Route element={<RotasUsuárioLogado />}>
                    <Route element={<PáginaInicial />} path="pagina-inicial" />
                    <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
                    <Route element={<CadastrarLocador />} path="cadastrar-locador" />
                    <Route element={<CadastrarLocatário />} path="cadastrar-locatário" />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
