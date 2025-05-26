import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilLocatário from "../middlewares/verificar-perfil-locatário";
import ServiçosLocatário from "../serviços/serviços-locatário";

const RotasLocatário = Router();

export default RotasLocatário;

RotasLocatário.post("/", ServiçosLocatário.cadastrarLocatário);
RotasLocatário.patch("/", verificarToken, verificarPerfilLocatário, ServiçosLocatário.atualizarLocatário);
RotasLocatário.get("/:cpf", verificarToken, verificarPerfilLocatário, ServiçosLocatário.buscarLocatário);