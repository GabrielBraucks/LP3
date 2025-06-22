import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilLocador from "../middlewares/verificar-perfil-locador";
import ServiçosLocador from "../serviços/serviços-locador";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasLocador = Router();

export default RotasLocador;

RotasLocador.post("/", ServiçosLocador.cadastrarLocador);
RotasLocador.get("/:cpf", verificarToken, verificarPerfilLocador, ServiçosLocador.buscarLocador);
RotasLocador.patch("/", verificarToken, verificarPerfilLocador, ServiçosLocador.atualizarLocador);
RotasLocador.post("/residencias", verificarToken, verificarPerfilLocador,
    ServiçosLocador.cadastrarResidência);
RotasLocador.patch("/residencias", verificarToken, verificarPerfilLocador,
    ServiçosLocador.alterarResidência);
RotasLocador.delete("/residencias/:id", verificarToken, verificarPerfilLocador,
    ServiçosLocador.removerResidência);
RotasLocador.get("/residencias/locador/:cpf", verificarToken, verificarPerfilLocador,
    verificarErroConteúdoToken, ServiçosLocador.buscarResidênciasLocador);
RotasLocador.get("/residencias/localizacoes", verificarToken, verificarPerfilLocador,
    ServiçosLocador.buscarLocalizaçõesResidências);