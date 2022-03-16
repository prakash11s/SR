
   import {
    SET_DATA_LIST
  } from "../../constants/ActionTypes";
import { IOrderPageReducer } from "../Interface/OrderPageReducerInterface";
   import {IAction} from "../Interface/ActionInterface";

   const initialState:IOrderPageReducer = {
   dataList: []
  };

  export default (state:IOrderPageReducer = initialState, action:IAction) => {
    switch (action.type) {

      case SET_DATA_LIST: {
        return {
          ...state,
          dataList : action.payload
        }
      }

      default:
        return state;
    }
  };
