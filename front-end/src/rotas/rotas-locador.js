import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";

export default function RotasLocador() {
    const { usuárioLogado } = useContext(UsuárioContext);

    if (usuárioLogado.perfil === "locador") return <Outlet />
    else return <Navigate to="/" />;
}