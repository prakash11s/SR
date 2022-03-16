import * as H from 'history';

export interface ICallQueueOverviewCellProps {
 history: H.History;
 setCallQueueId: (e: number) => void;
 data: IdataObj; 
}

export interface IdataObj {
 id: number;
 name: string;
 image: string;
 entries_count: number;
 created_at: string; 
 updated_at: string;
 description: string;
}

export interface ICallQueueOverviewCellState {
 anchorEl: undefined | Element;
 menuState: boolean;
 popUp: boolean;
 x: number;
 y: number;
}