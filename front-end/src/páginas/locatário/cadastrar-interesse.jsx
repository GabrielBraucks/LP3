import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoLocatário from "../../contextos/contexto-locatário";
import { serviçoCadastrarInteresse, serviçoRemoverInteresse } from "../../serviços/serviços-locatário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {
    estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
    estilizarInputText, estilizarInputTextarea, estilizarLabel
} from "../../utilitários/estilos";

export default function CadastrarInteresse() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { interesseConsultado, residênciaSelecionada } = useContext(ContextoLocatário);
    const [dados, setDados] = useState({
        id_residência: residênciaSelecionada?.id || "",
        necessidade_mobília: interesseConsultado?.necessidade_mobília || "",
        justificativa: interesseConsultado?.justificativa || ""
    });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        const { justificativa } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ justificativa });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function residênciaLabel() {
        if (interesseConsultado?.título_residência || residênciaSelecionada)
            return "Residência Selecionada*:";
        else return "Selecione uma Residência*:";
    };

    function pesquisarResidências() { navegar("../pesquisar-residências"); };

    function retornarAdministrarInteresses() { navegar("../administrar-interesses"); };

    async function cadastrarInteresse() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarInteresse({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Interesse cadastrado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };

    async function removerInteresse() {
        try {
            await serviçoRemoverInteresse(interesseConsultado.id);
            mostrarToast(referênciaToast, "Interesse removido com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    };

    function BotõesAções() {
        if (interesseConsultado) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarInteresses} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerInteresse} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarInteresses} />
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarInteresse} />
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (interesseConsultado) return "Remover Interesse";
        else return "Cadastrar Interesse";
    };

    function ResidênciaInputText() {
        if (residênciaSelecionada?.título) {
            return <InputText name="título_residência"
                className={estilizarInputText(erros.título_residência, 400, usuárioLogado.cor_tema)}
                value={residênciaSelecionada?.título} disabled />
        } else if (interesseConsultado?.residência?.título) {
            return <InputText name="título_residência"
                className={estilizarInputText(erros.título_residência, 400, usuárioLogado.cor_tema)}
                value={interesseConsultado?.residência?.título} disabled />
        } else return null;
    };

    function BotãoSelecionar() {
        if (!residênciaSelecionada && !interesseConsultado) {
            return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarResidências} />
        } else if (residênciaSelecionada) {
            return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarResidências} />;
        } else return null;
    };

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarInteresses} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>{residênciaLabel()}</label>
                    <BotãoSelecionar />
                    <ResidênciaInputText />
                    <MostrarMensagemErro mensagem={erros.id} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Necessidade de Mobília*:</label>
                    <Checkbox name="necessidade_mobília" checked={dados.necessidade_mobília}
                        className={estilizarCheckbox()} onChange={alterarEstado} autoResize />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justificativa*:</label>
                    <InputTextarea name="justificativa" value={dados.justificativa}
                        className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.justificativa} />
                </div>
                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}