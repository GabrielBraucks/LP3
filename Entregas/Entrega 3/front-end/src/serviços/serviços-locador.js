import servidor from "./servidor";

export function serviçoCadastrarLocador(locador) { return servidor.post("/locadores", locador); };

export function serviçoBuscarLocador(cpf) { return servidor.get(`/locadores/${cpf}`); };

export function serviçoAtualizarLocador(locador) { return servidor.patch("/locadores", locador); };

export function serviçoCadastrarResidência(residência) {
    return servidor.post("/locadores/residencias", residência);
};

export function serviçoAlterarResidência(residência) {
    return servidor.patch("/locadores/residencias", residência);
};

export function serviçoRemoverResidência(id) {
    return servidor.delete(`/locadores/residencias/${id}`);
};

export function serviçoBuscarResidênciasLocador(cpf) {
    return servidor.get(`/locadores/residencias/locador/${cpf}`);
};

export function serviçoBuscarLocalizaçõesResidências() {
    return servidor.get("/locadores/residencias/localizacoes");
};