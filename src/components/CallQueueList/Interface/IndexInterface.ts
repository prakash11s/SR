export interface ICallQueueListState {
 loader: boolean;
 unsubscribeId: string;
 rejectId: string;
 deleteId: string;
 rescheduleId: string;
 scheduleType: JSX.Element | null ;
 time: string | JSX.Element | null;
 popUp: boolean;
 onConfirmValue: (() => void) | null;
 alertType: string;
 popUpDisplayMessage: string;
 showCallQueueAlert: boolean;
 callQueueOptionDropdownList: IDropDownList[];
 callQueueActionId: string;
 actionToPerform: string;
 actionPopUpTitle: string | JSX.Element;
 options: any;
 actionError: boolean;
 error: boolean;
 showCommentPopUp: boolean;
 commentsToShow: ICommentsToShow[];
 commentsLength: number | null;
 commentId: string;
 entryId?: string;
 popUpButtonStyle?: string;
 callAlert: boolean,
 callUser: any,
 other: boolean;
}

interface IDropDownList {
created_at: string;
id: number;
name: string;
updated_at: string;
}

interface ICommentsToShow {
agent: IAgentDetails;
created_at: string;
deleted_at: null
description: string;
entry_id: string;
id: number;
updated_at: string;
}

interface IAgentDetails {
id: string;
name: string;
}
