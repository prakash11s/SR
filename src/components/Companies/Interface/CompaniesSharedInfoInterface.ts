export interface IOpeningHoursTableProps {
  openingHours: {
    fri: { open: string, close: string }
    mon: { open: string, close: string }
    sat: { open: string, close: string }
    sun: { open: string, close: string }
    thu: { open: string, close: string }
    tue: { open: string, close: string }
    wed: { open: string, close: string }
  }
}

export interface IDisplayCardProps {
 title: JSX.Element;
 value: number | string ;
 className?: string ;
 onClick?: () => void ;
}

export interface ICompanyReducerState {
 companyState: {
     company: any;
 }
}