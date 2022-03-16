export interface IOrderTableProps {
    dataList: IDataList[];
    loading: boolean,
    selectedPage: number,
    itemCount: number,
    rowsPerPage: number,
    onChange: Function
}

export interface IDataList {
    status: any,
    created_at: string;
    deleted_at: string;
    name: string;
    id: number;
    phone: string;
    updated_at: string;
    price: number;
}
