
export interface ICommentPopUpProps {
 callQueueListData: ICallQueueListObj;
 commentsList: ICommentsObj[];
 onConfirm: (p1: string, p2: number) => void;
 setCallQueueComments: (p1: IdataObj[]) => void;
 confirmBtnBsStyle: string;
 id: any;
 show: boolean;
}

export interface IcallQueueState {
 callQueueState: IcallQueueStateType;
 comments: ICommentsObj[];
}

interface IcallQueueStateType {
 activeCaller: null;
 callQueueId: number;
 callQueueListData: ICallQueueListObj;
 callQueueOverviewData: [];
 callQueueStatus: boolean;
 loader: boolean;
 promptShow: boolean;
 show: boolean;
 showTimer: boolean;
 spinner: boolean;
}

interface ICallQueueListObj {
 data: IdataObj[];
 meta: IMetaObj;
}

export interface IdataObj {
 comments: ICommentsObj[];
 created_at: string;
 description: string;
 email: string;
 id: string;
 locked: string;
 locked_by_agent_id: string;
 meta: null;
 name: string;
 phone: string;
 status: string
 updated_at: string;
 call_queue_id: number;
 available_after: string;
 findIndex: () => void;
}

interface ICommentsObj {
 agent: IAgentObj;
created_at: string;
deleted_at: null;
description: string;
comment?: string;
entry_id: string;
id: number;
updated_at: string;
}

interface IAgentObj {
 id: string;
 name: string;
}

export interface IMetaObj {
 call_queue: ICallQueueObj;
 total_entries_in_queue: number;
 total_reserved_entries_for_agent: number;
}

interface ICallQueueObj {
created_at: string;
department: string;
description: string;
id: number;
image: string;
name: string;
order: number;
updated_at: string;
}

export interface ICommentPopUpState {
 comment: string;
 comments: ICommentsObj[];
 postingComment: boolean;
 commentError: boolean;
 commentErrorMsg: string;
}
