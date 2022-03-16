import React from "react";
import { render } from "@testing-library/react";

import {IntlProvider} from "react-intl";
import AppLocale from "../../lngProvider";
import PaginationTable from "./index";

export interface ITableProps {
    meta: {
        total: number,
        page: number,
        limit: number
    },
    onChange: Function,
    dataList: any,
    columns: any
    loading: boolean,
    x:Number,
    y:Number,
    menuState:boolean
}

const meta = {
    total: 20,
    page: 1,
    limit: 10
};

const columns  = [{
    name: 'paginationTable.name',
    key: 'name'
},{
    name: 'paginationTable.status',
    key: 'status'
}];
const dataList = [{name: "Test 1", status: "Active"},{name: "Test 2", status: "Active"},{name: "Test 3", status: "Active"}];
let loading  = false;
const onChange = ({page, limit}) => {};

describe("Pagination Table component", ()=>{
    debugger;
    const {queryAllByRole, findAllByRole} = renderTable({meta, columns, dataList, loading, onChange});
    const table = queryAllByRole('table');
    debugger;
    test("There should be ONLY 1 table element", async () => {
        expect(table.length).toBe(1);
    });

    test("There should be thead element", async () => {
        const thead = table[0].firstChild && table[0].firstChild.nodeName;
        debugger;
        expect(thead).toBe('THEAD');
    });

    test("Table column length should be " + columns.length, async () => {
        const tr = table[0].firstChild && table[0].firstChild.firstChild;
        debugger;
        const tdLength = tr?.childNodes.length;
        debugger;
        expect(tdLength).toBe(columns.length);
    });

    test("Table tbody row length should be " + dataList.length, async () => {
        const tbody = table[0].children && table[0].children[1];
        debugger;
        const trLength = tbody.children.length;
        debugger;
        expect(trLength).toBe(dataList.length);
    });
});


function renderTable(props: ITableProps) {
    const currentAppLocale = AppLocale["en"];
    return render(
        <IntlProvider locale="en-GB" defaultLocale="en-GB" messages={currentAppLocale.messages}>
                <PaginationTable {...props} />
            </IntlProvider>
    );
}
