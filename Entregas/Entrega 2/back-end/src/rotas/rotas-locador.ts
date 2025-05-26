import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilLocador from "../middlewares/verificar-perfil-locador";
import ServiçosLocador from "../serviços/serviços-locador";

const RotasLocador = Router();

export default RotasLocador;

RotasLocador.post("/", ServiçosLocador.cadastrarLocador);
RotasLocador.get("/:cpf", verificarToken, verificarPerfilLocador, ServiçosLocador.buscarLocador);
RotasLocador.patch("/", verificarToken, verificarPerfilLocador, ServiçosLocador.atualizarLocador);
