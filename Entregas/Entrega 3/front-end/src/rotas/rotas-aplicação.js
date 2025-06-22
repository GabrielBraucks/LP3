import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarLocador from "../páginas/locador/cadastrar-locador";

import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarLocatário from "../páginas/locatário/cadastrar-locatário";

import { ProvedorLocador } from "../contextos/contexto-locador";
import { ProvedorLocatário } from "../contextos/contexto-locatário";
import RotasLocador from "./rotas-locador"
import RotasLocatário from "./rotas-locatário"
import AdministrarResidências from "../páginas/locador/administrar-residências";
import CadastrarResidência from "../páginas/locador/cadastrar-residência";
import AdministrarInteresses from "../páginas/locatário/administrar-interesses";
import CadastrarInteresse from "../páginas/locatário/cadastrar-interesse";
import PesquisarResidências from "../páginas/locatário/pesquisar-residências";
import ConsultarResidência from "../páginas/locatário/consultar-residência";

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
                    <Route element={<ProvedorLocador><RotasLocador /></ProvedorLocador>}>
                        <Route element={<CadastrarLocador />} path="cadastrar-locador" />
                        <Route element={<AdministrarResidências />} path="administrar-residências" />
                        <Route element={<CadastrarResidência />} path="cadastrar-residência" />
                    </Route>
                    <Route element={<ProvedorLocatário><RotasLocatário /></ProvedorLocatário>}>
                        <Route element={<CadastrarLocatário />} path="cadastrar-locatário" />
                        <Route element={<AdministrarInteresses />} path="administrar-interesses" />
                        <Route element={<CadastrarInteresse />} path="cadastrar-interesse" />
                        <Route element={<PesquisarResidências />} path="pesquisar-residências" />
                        <Route element={<ConsultarResidência />} path="consultar-residência" />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
