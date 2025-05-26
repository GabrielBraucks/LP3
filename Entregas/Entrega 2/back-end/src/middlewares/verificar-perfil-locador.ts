import { Perfil } from "../entidades/usuário";

export default function verificarPerfilLocador(request, response, next) {
    if (request.perfil === Perfil.LOCADOR) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};
