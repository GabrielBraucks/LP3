import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Locatário from '../entidades/locatário';
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosLocatário {
    constructor() { }
    static async cadastrarLocatário(request, response) {
        try {
            const { usuário_info, renda_mensal, telefone } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const locatário = Locatário.create({ usuário, renda_mensal, telefone });
                await transactionManager.save(locatário);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) { return response.status(500).json({ erro: error }); }
    };
    static async atualizarLocatário(request, response) {
        try {
            const { cpf, renda_mensal, telefone } = request.body;
            const cpf_encriptado = md5(cpf);
            await Locatário.update({ usuário: { cpf: cpf_encriptado } }, {
                renda_mensal, telefone
            });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarLocatário" }); }
    };
    static async buscarLocatário(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const locatário = await Locatário.findOne({
                where: { usuário: cpf_encriptado },
                relations: ["usuário"]
            });
            if (!locatário) return response.status(404).json({ erro: "Locatário não encontrado." });
            return response.json({
                nome: locatário.usuário.nome, email: locatário.usuário.email,
                renda_mensal: locatário.renda_mensal, telefone: locatário.telefone
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarLocatário" }); }
    };
}