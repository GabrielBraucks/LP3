import { Perfil } from '../entidades/usuário';

export default function verificarPerfilLocatário(request, response, next) {
    if (request.perfil === Perfil.LOCATÁRIO) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};