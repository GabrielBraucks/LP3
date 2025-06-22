import { createContext, useState } from "react";

const ContextoLocatário = createContext();
export default ContextoLocatário;

export function ProvedorLocatário({ children }) {
    const [interesseConsultado, setInteresseConsultado] = useState({});
    const [residênciaConsultada, setResidênciaConsultada] = useState({});
    const [residênciaSelecionada, setResidênciaselecionada] = useState({});
    const [residênciaInteresse, setResidênciaInteresse] = useState({});

    return (
        <ContextoLocatário.Provider value={{
            interesseConsultado, setInteresseConsultado, residênciaConsultada, setResidênciaConsultada,
            residênciaSelecionada, setResidênciaselecionada, residênciaInteresse, setResidênciaInteresse
        }}>{children}</ContextoLocatário.Provider>
    );
}