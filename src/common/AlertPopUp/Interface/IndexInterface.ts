export interface IAlertPopUpProps {
 show: boolean;
 message?: string | JSX.Element | null;
 title?: JSX.Element | string;
 success?: boolean;
 showOk?: boolean;
 disabled?: boolean;
 showCancel?: boolean;
 allowEscape?: boolean;
 closeOnClickOutside?: boolean;
 onCancel?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void;
 confirmBtnText?: JSX.Element;
 onConfirm: (() => void) | null;
 warning?: boolean;
 danger?: boolean;
 cancelBtnStyle?: string;
 cancelBtnText?: JSX.Element;
 confirmBtnBsStyle?: string | null;
 cancelBtnBsStyle?: string | null;
 type?: string;
}
