export interface IServiceDissociationPromptProps {
    show: boolean;
    title: string;
    reasons?:Array<{
        id: number,
        name: string,
        description: string
    }>;
    actionError: boolean;
    handleChange: (e?: any) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmBtnText?: JSX.Element;
    cancelBtnText?: JSX.Element;
}

export interface IDissociationReasonsObj {
    notify_customer: boolean;
    notify_service_point: boolean;
    move_to_processing: boolean;
}
