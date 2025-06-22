import servidor from "./servidor";

export function serviçoCadastrarLocatário(locatário) { return servidor.post("/locatarios", locatário); };
export function serviçoAtualizarLocatário(locatário) { return servidor.patch("/locatarios", locatário); };
export function serviçoBuscarLocatário(cpf) { return servidor.get(`/locatarios/${cpf}`); };
export function serviçoCadastrarInteresse(interesse) {
    return servidor.post("/locatarios/interesses", interesse);
};
export function serviçoRemoverInteresse(id) { return servidor.delete(`/locatarios/interesses/${id}`); };
export function serviçoBuscarInteressesLocatário(cpf) {
    return servidor.get(`/locatarios/interesses/locatario/${cpf}`);
};
export function serviçoBuscarResidências() { return servidor.get("/locatarios/interesses/residencias"); };