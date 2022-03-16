export interface ISearchBoxProps {
 styleName: string, 
 placeholder: string, 
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
 value: string,
 user?: string,
}