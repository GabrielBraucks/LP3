import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";

import Locador from "../entidades/locador";
import ServiçosUsuário from "./serviços-usuário";

import Residência from "../entidades/residência";

export default class ServiçosLocador {
    constructor() { }
    static async cadastrarResidência(request, response) {
        try {
            const { título, categoria, localização, valor_aluguel, data_disponibilidade, descrição, mobiliado,
                cpf } = request.body;
            const cpf_encriptado = md5(cpf);
            const locador = await Locador.findOne({
                where: { usuário: cpf_encriptado },
                relations: ["usuário"]
            });
            await Residência.create({
                título, categoria, localização, valor_aluguel, data_disponibilidade, descrição, mobiliado, locador
            }).save();
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : cadastrarResidência" }); }
    };
    static async alterarResidência(request, response) {
        try {
            const { id, título, categoria, localização, valor_aluguel, data_disponibilidade, descrição, mobiliado } = request.body;
            await Residência.update(id, {
                título, categoria, localização, valor_aluguel, data_disponibilidade, descrição, mobiliado
            });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : alterarResidência" }); }
    };
    static async removerResidência(request, response) {
        try {
            const id_residência = request.params.id;
            const residência = await Residência.findOne(id_residência);
            await Residência.remove(residência);
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : removerResidência" }); }
    };
    static async buscarResidênciasLocador(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const residências = await Residência.find({
                where: { locador: { usuário: cpf_encriptado } },
                relations: ["locador", "locador.usuário"]
            });
            return response.json(residências);
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarResidênciasLocador" });
        }
    };
    static filtrarLocalizaçõesEliminandoRepetição(residências: Residência[]) {
        let localizações: { label: string, value: string }[];
        localizações = residências.filter((residência, índice, residências_antes_filtrar) =>
            residências_antes_filtrar.findIndex
                (residência_anterior => residência_anterior.localização === residência.localização) === índice)
            .map(residência => ({ label: residência.localização, value: residência.localização }));
        return localizações;
    };
    static async buscarLocalizaçõesResidências(request, response) {
        try {
            const residências = await Residência.find();
            const localizações = ServiçosLocador.filtrarLocalizaçõesEliminandoRepetição(residências);
            return response.json(localizações.sort());
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarLocalizaçõesResidências" });
        }
    };
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
            if (!locador) return response.status(404).json({ erro: "Locador não encontrado." });
            return response.json({
                nome: locador.usuário.nome, email: locador.usuário.email,
                anos_experiência: locador.anos_experiência,
                número_imóveis: locador.número_imóveis
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarLocador" }); }
    };

    static async atualizarLocador(request, response) {
        try {
            const { cpf, anos_experiência } = request.body;
            const cpf_encriptado = md5(cpf);
            await Locador.update({ usuário: { cpf: cpf_encriptado } },
                { anos_experiência });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarLocador" }); }
    };
};