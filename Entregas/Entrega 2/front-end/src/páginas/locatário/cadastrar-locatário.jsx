import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
import { serviçoCadastrarLocatário, serviçoAtualizarLocatário, serviçoBuscarLocatário }
    from "../../serviços/serviços-locatário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo,
    estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask,
    estilizarLabel
} from "../../utilitários/estilos";

export default function CadastrarLocatário() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({
        renda_mensal: "",
        telefone: ""
    });
    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    const opçõesRendaMensal = [
        { label: "Até 2 salários", value: "até_2_salarios" },
        { label: "De 2 a 5 salários", value: "de_2_a_5_salarios" },
        { label: "Acima de 5 salários", value: "acima_5_salarios" }
    ];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        let errosCamposObrigatórios;
        errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };
    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Locatário";
        else return "Cadastrar Locatário";
    };

    async function cadastrarLocatário() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarLocatário({
                    ...dados, usuário_info: usuárioLogado,
                    renda_mensal: dados.renda_mensal,
                    telefone: dados.telefone
                });
                if (response.data)
                    setUsuárioLogado(usuário => ({
                        ...usuário, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referênciaToast, "Locatário cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };
    async function atualizarLocatário() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarLocatário({ ...dados, cpf: usuárioLogado.cpf });
                if (response) mostrarToast(referênciaToast, "Locatário atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };
    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };
    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarLocatário();
        else cadastrarLocatário();
    };
    function redirecionar() {
        if (cpfExistente) {
            setUsuárioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
            navegar("/pagina-inicial");
        }
    };
    useEffect(() => {
        let desmontado = false;
        async function buscarDadosLocatário() {
            try {
                const response = await serviçoBuscarLocatário(usuárioLogado.cpf);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, renda_mensal: response.data.renda_mensal,
                        telefone: response.data.telefone
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosLocatário();
        return () => desmontado = true;
    }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Renda Mensal*:</label>
                    <Dropdown name="renda_mensal" className={estilizarDropdown(erros.renda_mensal, usuárioLogado.cor_tema)}
                        value={dados.renda_mensal} options={opçõesRendaMensal} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.renda_mensal} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Telefone*:</label>
                    <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} onChange={alterarEstado}
                        className={estilizarInputMask(erros.telefone, usuárioLogado.cor_tema)}
                        mask={TELEFONE_MÁSCARA} value={dados.telefone} />
                    <MostrarMensagemErro mensagem={erros.telefone} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
                    <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
                </div>
            </Card>
        </div>
    );
};