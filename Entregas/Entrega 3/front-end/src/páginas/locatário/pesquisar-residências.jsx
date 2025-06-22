import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoLocatário from "../../contextos/contexto-locatário";
import { serviçoBuscarResidências } from "../../serviços/serviços-locatário";
import mostrarToast from "../../utilitários/mostrar-toast";

import {
    TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitários/estilos";

export default function PesquisarResidências() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { residênciaConsultada, setResidênciaConsultada, setResidênciaselecionada }
        = useContext(ContextoLocatário);
    const [listaResidências, setListaResidências] = useState([]);
    const navegar = useNavigate();
    const opçõesCategoria = [
        { label: "Apartamento", value: "Apartamento" },
        { label: "Casa", value: "Casa" },
        { label: "Kitnet", value: "Kitnet" },
        { label: "Loft", value: "Loft" }
    ];

    function retornarCadastrarInteresse() {
        setResidênciaselecionada(residênciaConsultada);
        setResidênciaConsultada(null);
        navegar("../cadastrar-interesse");
    };

    function ConsultarTemplate(residência) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    residênciaConsultada?.id === residência.id)}
                tooltip="Consultar Residência" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setResidênciaConsultada(residência);
                    navegar("../consultar-residência");;
                }} />
        );
    };

    function DropdownÁreaTemplate(opções) {
        function alterarFiltroDropdown(event) {
            return opções.filterCallback(event.value, opções.index);
        };
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
        async function buscarResidências() {
            try {
                const response = await serviçoBuscarResidências();
                if (!desmontado && response.data) setListaResidências(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarResidências();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Card title="Pesquisar Residências" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma residência encontrada." value={listaResidências}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />
                    <Column field="locador.usuário.nome" header="Nome do Locador" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="título" header="Título" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="categoria" header="Categoria" filter filterMatchMode="equals"
                        filterElement={DropdownÁreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="localização" header="Localização" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="data_disponibilidade" header="Data de Disponibilidade" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="mobiliado" header="Mobiliado" dataType="boolean" filter
                        showFilterOperator={false}
                        body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate}
                        filterMatchMode="equals" showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarCadastrarInteresse} />
            </Card>
        </div>
    );
}