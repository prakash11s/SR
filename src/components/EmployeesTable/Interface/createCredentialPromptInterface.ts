
export interface ICreateCredentialPromptProps {
 show: boolean;
 title: JSX.Element;
 showOk: any;
 showCancel: any;
 confirmBtnText: JSX.Element;
 onConfirm: (extension: string, password: string) => void;
 onCancel: () => void;
 disabled: boolean;
}
