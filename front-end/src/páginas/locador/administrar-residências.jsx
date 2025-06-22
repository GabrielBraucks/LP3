import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoLocador from "../../contextos/contexto-locador";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarResidênciasLocador } from "../../serviços/serviços-locador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitários/estilos";

export default function AdministrarResidências() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { residênciaConsultada, setResidênciaConsultada } = useContext(ContextoLocador);
    const [listaResidências, setListaResidências] = useState([]);
    const navegar = useNavigate();
    const opçõesCategoria = [
        { label: "Apartamento", value: "Apartamento" },
        { label: "Casa", value: "Casa" },
        { label: "Kitnet", value: "Kitnet" },
        { label: "Loft", value: "Loft" }
    ];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };

    function adicionarResidência() {
        setResidênciaConsultada(null);
        navegar("../cadastrar-residência");
    };

    function ConsultarTemplate(residência) {
        function consultar() {
            setResidênciaConsultada(residência);
            navegar("../cadastrar-residência");
        };

        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    residênciaConsultada?.id === residência.id)}
                tooltip="Consultar Residência" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    };

    function DropdownÁreaTemplate(opções) {
        function alterarFiltroDropdown(event) { return opções.filterCallback(event.value, opções.index); };
        return <Dropdown value={opções.value} options={opçõesCategoria} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };

    function BooleanBodyTemplate(residência) {
        if (residência.concorrendo_bolsa) return "Sim";
        else return "Não";
    };

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Mobiliado:</label>
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    };

    useEffect(() => {
        let desmontado = false;
        async function buscarResidênciasLocador() {
            try {
                const response = await serviçoBuscarResidênciasLocador(usuárioLogado.cpf);
                if (!desmontado && response.data) { setListaResidências(response.data); }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "error");
            }
        };
        buscarResidênciasLocador();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Card title="Administrar Residências" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma residência encontrada." value={listaResidências}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />
                    <Column field="título" header="Título" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="categoria" header="Categoria" filter filterMatchMode="equals"
                        filterElement={DropdownÁreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="data_disponibilidade" header="Data de Disponibilidade" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="mobiliado" header="Mobiliado" filter
                        showFilterOperator={false}

                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable
                        filterMatchMode="equals" filterElement={BooleanFilterTemplate}
                        body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()} dataType="boolean" />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarPáginaInicial} />
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarResidência} />
            </Card>
        </div>
    );
}