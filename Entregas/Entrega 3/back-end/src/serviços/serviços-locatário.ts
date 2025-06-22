import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Locatário from '../entidades/locatário';
import ServiçosUsuário from "./serviços-usuário";

import Residência from "../entidades/residência";
import Interesse from "../entidades/interesse";

export default class ServiçosLocatário {
    constructor() { }
    static async cadastrarInteresse(request, response) {
        try {
            const { id_residência, necessidade_mobília, justificativa, cpf } = request.body;
            const cpf_encriptado = md5(cpf);
            const locatário = await Locatário.findOne({ where: { usuário: cpf_encriptado } });
            const residência = await Residência.findOne(id_residência);
            const interesses = await Interesse.find({ where: { locatário, residência } });
            if (interesses.length > 0) return response.status(404).json
                ({ erro: "O locatário já cadastrou interesse para a residência." });
            await Interesse.create({ necessidade_mobília, justificativa, locatário, residência }).save();
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : cadastrarInteresse" }); }
    };
    static async removerInteresse(request, response) {
        try {
            const id = request.params.id;
            await Interesse.delete(id);
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : removerInteresse" }); }
    };
    static async buscarInteressesLocatário(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const interesses = await Interesse.find({
                where: { locatário: { usuário: cpf_encriptado } },
                relations: ["locatário", "locatário.usuário", "residência", "residência.locador",
                    "residência.locador.usuário"]
            });
            return response.json(interesses);
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarInteressesLocatário" });
        }
    };
    static async buscarResidências(request, response) {
        try {
            const residências = await Residência.find({ relations: ["locador", "locador.usuário"] });
            return response.json(residências);
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarResidências" }); }
    };
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