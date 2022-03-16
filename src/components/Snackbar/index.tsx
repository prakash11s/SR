import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';

import IntlMessages from '../../util/IntlMessages';

export interface ISnackAlertProps {
 open: boolean,
 onClose: () => void 
}

/**
 * This is a reuseable snack bar
 */

const SnackAlert = (props: ISnackAlertProps) => {
 const [vertical, setVertical] = useState<"top"|"bottom">('top');
 const [horizontal, setHorizontal] = useState<"center" | "left" | "right">('center');

 return (  
   <Snackbar          
          anchorOrigin={{vertical, horizontal}}
          open={props.open}
          onClose={props.onClose}         
          message={<span className="text-danger h3 ml-4"><IntlMessages id="reuseableSnackbar.message" /></span>}
          autoHideDuration={2000}      
        />
 )
}

export default SnackAlert;
