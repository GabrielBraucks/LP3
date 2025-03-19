import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";

import Locador from "../entidades/locador";
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosLocador {
    constructor() { }
    static async cadastrarLocador(request, response) {
        try {
            const { usuário_info, anos_experiência } = request.body;
            const número_imóveis = 0;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const locador = Locador.create({ usuário, anos_experiência, número_imóveis });
                await transactionManager.save(locador);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
    };
    static async buscarLocador(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const locador = await Locador.findOne({
                where: { usuário: cpf_encriptado },
                relations: ["usuário"]
            });
            if (!locador) return response.status(404).json({ erro: "Professor não encontrado." });
            return response.json({
                nome: locador.usuário.nome, email: locador.usuário.email,
                anos_experiência: locador.anos_experiência,
                número_imóveis: locador.número_imóveis
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarProfessor" }); }
    };
};