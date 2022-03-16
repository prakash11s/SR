import {IDataList} from "./EmployeeTableInterface";

export interface IEmployeeDetailsModalProps {
 employeeData: IDataList;
 toggle: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
 isOpen: boolean;
 callPhone: (event: React.MouseEvent<HTMLElement, MouseEvent>,  p2: number, p3: string) => void;
 deleteClick: (event: React.MouseEvent<HTMLElement, MouseEvent>, employeeID: number) => void;
}

export interface IDisplayCardProps {
 title: JSX.Element;
 className?: string;
 onClick?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void;
 value: string;
}