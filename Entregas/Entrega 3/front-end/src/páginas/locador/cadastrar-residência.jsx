import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoLocador from "../../contextos/contexto-locador";
import {
    serviçoAlterarResidência, serviçoCadastrarResidência, serviçoRemoverResidência,
    serviçoBuscarLocalizaçõesResidências
} from "../../serviços/serviços-locador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";

import {
    estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
    estilizarInlineFlex, estilizarInputText, estilizarInputTextarea, estilizarLabel
}
    from "../../utilitários/estilos";

export default function CadastrarResidência() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { residênciaConsultada } = useContext(ContextoLocador);
    const [dados, setDados] = useState({
        título: residênciaConsultada?.título || "",
        categoria: residênciaConsultada?.categoria || "",
        localização: residênciaConsultada?.localização || "",
        valor_aluguel: residênciaConsultada?.valor_aluguel || "",
        data_disponibilidade: residênciaConsultada?.data_disponibilidade || "",
        descrição: residênciaConsultada?.descrição || "",
        mobiliado: residênciaConsultada?.mobiliado || false
    });

    const [listaÁreasAtuação, setListaÁreasAtuação] = useState([]);
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    const opçõesCategoria = [
        { label: "Apartamento", value: "Apartamento" },
        { label: "Casa", value: "Casa" },
        { label: "Kitnet", value: "Kitnet" },
        { label: "Loft", value: "Loft" }
    ];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        const { título, categoria, localização, valor_aluguel, data_disponibilidade, descrição } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({
            título, categoria, localização,
            valor_aluguel, data_disponibilidade, descrição
        });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function retornarAdministrarResidências() { navegar("../administrar-residências"); };

    async function cadastrarResidência() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarResidência({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Residência cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    async function alterarResidência() {
        if (validarCampos()) {
            try {
                await serviçoAlterarResidência({ ...dados, id: residênciaConsultada.id });
                mostrarToast(referênciaToast, "Residência alterada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    async function removerResidência() {
        try {
            await serviçoRemoverResidência(residênciaConsultada.id);
            mostrarToast(referênciaToast, "Residência excluída com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    };

    function BotõesAções() {
        if (residênciaConsultada) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarResidências} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerResidência} />
                    <Button className={estilizarBotão()} label="Alterar" onClick={alterarResidência} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarResidências} />
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarResidência} />
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (residênciaConsultada) return "Alterar Residência";
        else return "Cadastrar Residência";
    };

    useEffect(() => {
        async function buscarLocalizaçõesResidências() {
            try {
                const response = await serviçoBuscarLocalizaçõesResidências();
                if (response.data) setListaÁreasAtuação(response.data);
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "error");
            }
        }
        buscarLocalizaçõesResidências();
    }, [])

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarResidências} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
                    <InputText name="título"
                        className={estilizarInputText(erros.título, 400, usuárioLogado.cor_tema)}

                        value={dados.título} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.título} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
                    <Dropdown name="categoria"
                        className={estilizarDropdown(erros.categoria, usuárioLogado.cor_tema)}
                        value={dados.categoria} options={opçõesCategoria} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.categoria} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Localização*:</label>
                    <InputText name="localização"
                        className={estilizarInputText(erros.localização, 400, usuárioLogado.cor_tema)}

                        value={dados.localização} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.localização} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor de Aluguel*:</label>
                    <InputText name="valor_aluguel"
                        className={estilizarInputText(erros.valor_aluguel, 400, usuárioLogado.cor_tema)}

                        value={dados.valor_aluguel} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.valor_aluguel} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Disponibilidade*:</label>
                    <InputText name="data_disponibilidade" type="date"
                        className={estilizarInputText(erros.data_disponibilidade, 40, usuárioLogado.cor_tema)}

                        value={dados.data_disponibilidade} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.data_disponibilidade} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.descrição} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Mobiliado*:</label>
                    <Checkbox name="mobilidado" checked={dados.mobiliado} value={dados.mobiliado}
                        className={estilizarCheckbox()} onChange={alterarEstado} autoResize />
                </div>
                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}