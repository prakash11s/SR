export interface IMailListProps {
 mails: [], 
 onMailSelect: (p1: React.MouseEvent<HTMLElement>) => void, 
 onMailChecked: (p1: React.MouseEvent<HTMLElement>) => void, 
 onStartSelect: (p1: React.MouseEvent<HTMLElement>) => void, 
 width: number
}