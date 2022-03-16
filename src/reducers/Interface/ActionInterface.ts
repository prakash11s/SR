export interface IAction {

  /**
   * Unique ID for operation like Edit, Delete
   */
  id?: number;
  /**
   * Dispatched action type
   */
  type: string;
  /**
   * Payload send with dispatch action
   */
  payload: any;

  isNavCollapsed?:any

  width?:any

  historyId?:any
}
