import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilLocador from "../middlewares/verificar-perfil-locador";
import ServiçosLocador from "../serviços/serviços-locador";

const RotasProfessor = Router();

export default RotasProfessor;

RotasProfessor.post("/", ServiçosLocador.cadastrarLocador);
RotasProfessor.get("/:cpf", verificarToken, verificarPerfilLocador, ServiçosLocador.buscarLocador);
