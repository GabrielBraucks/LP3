import servidor from "./servidor";

export function serviçoCadastrarLocador(locador) { return servidor.post("/locadores", locador); };

export function serviçoBuscarLocador(cpf) { return servidor.get(`/locadores/${cpf}`); };