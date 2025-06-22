import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilLocatário from "../middlewares/verificar-perfil-locatário";
import ServiçosLocatário from "../serviços/serviços-locatário";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasLocatário = Router();

export default RotasLocatário;

RotasLocatário.post("/", ServiçosLocatário.cadastrarLocatário);
RotasLocatário.patch("/", verificarToken, verificarPerfilLocatário, ServiçosLocatário.atualizarLocatário);
RotasLocatário.get("/:cpf", verificarToken, verificarPerfilLocatário, ServiçosLocatário.buscarLocatário);

RotasLocatário.post("/interesses/", verificarToken, verificarPerfilLocatário,
    ServiçosLocatário.cadastrarInteresse);
RotasLocatário.delete("/interesses/:id", verificarToken, verificarPerfilLocatário,
    ServiçosLocatário.removerInteresse);
RotasLocatário.get("/interesses/locatario/:cpf", verificarToken, verificarPerfilLocatário,
    verificarErroConteúdoToken, ServiçosLocatário.buscarInteressesLocatário);
RotasLocatário.get("/interesses/residencias/", verificarToken, verificarPerfilLocatário,
    ServiçosLocatário.buscarResidências);