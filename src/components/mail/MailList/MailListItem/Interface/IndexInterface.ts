export interface IMailListItemProps {
 mail, 
 onMailSelect: (p1: React.MouseEvent<HTMLElement, MouseEvent>) => void, 
 onMailChecked: (p1: React.MouseEvent<HTMLElement, MouseEvent>) => void,
 onStartSelect: (p1: React.MouseEvent<HTMLElement, MouseEvent>) => void
}