export default function formatarPerfil(perfil) {
    switch (perfil) {
        case "locador": return "Locador";
        case "locatário": return "Locatário";
        default: return;
    }
};
