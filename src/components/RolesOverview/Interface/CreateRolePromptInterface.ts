export interface ICreateRolePromptProps {
 show: boolean,
 title: JSX.Element,
 showOk,
 showCancel,
 confirmBtnText: JSX.Element,
 onConfirm: (e: React.MouseEvent<HTMLElement>) => void,
 onCancel: (e: React.MouseEvent<HTMLElement>) => void,
 disabled: (e: React.MouseEvent<HTMLElement>) => void,
 handleRole: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 handleDescription: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
}

export interface ICreateRolePromptState {

}