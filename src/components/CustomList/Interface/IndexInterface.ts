export interface ICustomListProps {
	dataList: IDataList[];
	onToggle: (event: React.MouseEvent<HTMLElement>, p1: number, checked: boolean) => void;
	onPriceChange: (e: React.ChangeEvent<HTMLInputElement>, p2: number) => void
	permissionState: any;
}

interface IDataList {
attachments: []
category: {
	id: number;
	department: string;
	name: string;
	order: number;
	image: string | null;
}
checked: boolean;
created_at: string | null;
department: string;
description: string | null;
id: any;
name: string;
options: []
order: number;
service_price: {
	price: number;
}
updated_at: string | null;
}
