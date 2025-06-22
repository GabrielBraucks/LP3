import { createContext, useState } from "react";

const ContextoLocador = createContext();
export default ContextoLocador;

export function ProvedorLocador({ children }) {
    const [residênciaConsultada, setResidênciaConsultada] = useState({});

    return (
        <ContextoLocador.Provider value={{
            residênciaConsultada, setResidênciaConsultada
        }}>{children}</ContextoLocador.Provider>
    );
}