import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoLocatário from "../../contextos/contexto-locatário";
import {
    estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo,
    estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel
}
    from "../../utilitários/estilos";

export default function ConsultarResidência() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { residênciaConsultada, residênciaInteresse } = useContext(ContextoLocatário);
    const dados = {
        nome_locador: residênciaConsultada?.locador?.usuário?.nome
            || residênciaInteresse?.locador?.usuário?.nome,
        título: residênciaConsultada?.título || residênciaInteresse?.título,
        categoria: residênciaConsultada?.categoria || residênciaInteresse?.categoria,
        localização: residênciaConsultada?.localização || residênciaInteresse?.localização,
        valor_aluguel: residênciaConsultada?.valor_aluguel || residênciaInteresse?.valor_aluguel,
        data_disponibilidade: residênciaConsultada?.data_disponibilidade || residênciaInteresse?.data_disponibilidade,
        descrição: residênciaConsultada?.descrição || residênciaInteresse?.descrição,
        mobiliado: residênciaConsultada?.mobiliado
            || residênciaInteresse?.mobiliado,
    };

    const navegar = useNavigate();
    function retornar() {
        if (residênciaConsultada) navegar("../pesquisar-residências");
        else if (residênciaInteresse) navegar("../cadastrar-interesse");
    };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Residência" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Locador*:</label>
                    <InputText name="nome_locador"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}

                        value={dados.nome_locador} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
                    <InputText name="título" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.título} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
                    <InputText name="categoria"
                        className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.categoria} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Localização*:</label>
                    <InputText name="localização"
                        className={estilizarInputText(null, 350, usuárioLogado.cor_tema)}
                        value={dados.localização} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor Aluguel*:</label>
                    <InputText name="valor_aluguel"
                        className={estilizarInputText(null, 350, usuárioLogado.cor_tema)}
                        value={dados.valor_aluguel} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Diponibilidade*:</label>
                    <InputText name="data_disponibilidade" type="date" value={dados.data_disponibilidade}
                        className={estilizarInputText(null, usuárioLogado.cor_tema)} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Mobiliado*:</label>
                    <Checkbox name="Mobiliado" checked={dados.mobiliado}
                        className={estilizarCheckbox(null)} autoResize disabled />
                </div>
                <Divider className={estilizarDivider()} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornar} />
                </div>
            </Card>
        </div>
    );
}