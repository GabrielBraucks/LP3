import servidor from "./servidor";

export function serviçoCadastrarLocatário(locatário) { return servidor.post("/locatarios", locatário); };
export function serviçoAtualizarLocatário(locatário) { return servidor.patch("/locatarios", locatário); };
export function serviçoBuscarLocatário(cpf) { return servidor.get(`/locatarios/${cpf}`); };