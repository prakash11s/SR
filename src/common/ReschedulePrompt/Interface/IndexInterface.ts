export interface IReschedulePromptProps {
 setTimestamp: (p1: string | unknown) => void;
 setOther: () => void;
 setTimestampForOther: (p1: any, p2: any) => void;
 onChangeHandlerId: (p1: number | unknown) => void;
 options: boolean;
 callQueueOptionDropdownList: IdropdownObj[];
 time: string | JSX.Element | null;
 show: boolean;
 error: boolean;
 onConfirm?: () => void;
 onCancel?: () => void;
 confirmBtnText?: JSX.Element;
 cancelBtnText?: JSX.Element;
 other: boolean;
}

interface IdropdownObj {
created_at: string;
id: number;
name: string;
updated_at: string;
}

export interface IReschedulePromptState {  
 dateValue?: any | undefined;
}