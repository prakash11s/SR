export interface ICallQueueActionPromptProps {
 onChangeHandlerId: (e: string ) => void;
 show: boolean;
 title: string | JSX.Element | null;
 options: boolean;
 actionError: boolean;
 callQueueOptionDropdownList: IDropDownListObj[];
 onConfirm?: () => void;
 onCancel?: () => void;
 confirmBtnText?: JSX.Element; 
 cancelBtnText?: JSX.Element; 
}

interface IDropDownListObj {
created_at: string;
id: number;
name: string;
updated_at: string;
}
