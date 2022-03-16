export interface IOperatingHoursDisplayTableProps {
  openingHours: IOpeningHours;
}

interface IOpeningHours{
 fri: IOpenClose|IFromUntil;
 mon: IOpenClose|IFromUntil;
 sat: IOpenClose|IFromUntil;
 sun: IOpenClose|IFromUntil;
 thu: IOpenClose|IFromUntil;
 tue: IOpenClose|IFromUntil;
 wed: IOpenClose|IFromUntil;
}

interface IOpenClose {
 open: string; 
 close: string;
}

interface IFromUntil {
 from: string; 
 until: string;
}

export interface IOperatingHoursDisplayTableState {
 currentOpeningHours: IOpeningHours;
}

export interface IDay {
 full_label: string,
 short_label: string
}
