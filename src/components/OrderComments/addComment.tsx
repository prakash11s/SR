import React, {useState} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import IntlMessages from "../../util/IntlMessages";
import {FormControl, TextField} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {useDispatch} from "react-redux";
import {submitOrderComment, updateOrderComment} from "../../actions/Actions/OrderActions";
import Loader from "../../containers/Loader/Loader";
import SweetAlert from "react-bootstrap-sweetalert";

const AddOrderComment = (props: any): JSX.Element => {

    const dispatch = useDispatch();

    const [successPopup, setSuccessPopup] = useState<boolean>(false);
    const [popupMsg, setPopupMsg] = useState<string>('');
    const [error, setError] = useState<any>(null);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [commentError, setCommentError] = useState<boolean>(false);
    const [comment, setComment] = useState<string>(props.data&&props.data.comment?props.data.comment:'');
    const [visibility, setSelectedVisibility] = useState<string>(props.data&&props.data.visibility?props.data.visibility:'private');

    const toggleModal = (): void => {
        props.onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommentError(false);
        setComment(event.currentTarget.value);
    };

    const onSelectedVisibility = (event: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
        const value = event.target.value as string;
        setSelectedVisibility(value);
    };

    const onSave = () : void => {
        setSubmitting(true);
        if(props.data && props.data.id){
            dispatch(updateOrderComment(props.id, props.data.id,{comment, visibility}, callback));
        }else{
            dispatch(submitOrderComment(props.id, {comment, visibility}, callback));
        }
    };

    const callback = (result, data) => {
        setSubmitting(false);
        if(result === 'success'){
            setSuccessPopup(true);
            setPopupMsg(data?.message);
        }else{
            setError(data);
            setCommentError(data?.errors?.comment);
        }
    };

    return (
        <div>
            <Modal
                isOpen={props.show}
                toggle={toggleModal}
                className="modal-align"
                keyboard={false}
                backdrop='static'
            >
                { isSubmitting && <Loader/> }
                <ModalHeader toggle={toggleModal} >
                    <IntlMessages id={props.data && props.data.id ? 'comments.table.updateTitle' : 'comments.table.createTitle' } />
                    { props.data && props.data.id && `: ${props.data.id}` }
                </ModalHeader>
                <ModalBody>   
                    <div className="col-12">
                        <FormControl className="w-100 mb-2">
                            <TextField
                                error={commentError}
                                rows='4'
                                type='textarea'
                                multiline={true}
                                value={comment}
                                className="w-80 mb-2 h-75 form-control"
                                label={<IntlMessages id={'comments.content'} defaultMessage={'Content'}/>}
                                placeholder="Content"
                                onChange={handleChange}
                            />
                        </FormControl>
                    </div>

                    <div className={'col-4'}>
                        <FormControl className="w-100 mb-2 h-75">
                            <InputLabel id={'visibility'}><IntlMessages id="comments.visibility"/></InputLabel>
                            <Select
                                name={'visibility'}
                                labelId={'visibility'}
                                value={visibility}
                                onChange={onSelectedVisibility}
                                required
                            >
                                {['private','public','service_point','customer'].map((option: any) => {
                                    return <MenuItem value={option}>{<IntlMessages id={`comments.visibility.${option}`} />}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                            color="primary"
                            onClick={onSave}
                    >
                        <IntlMessages id={props.data && props.data.id ? 'comments.table.updateTitle' : 'comments.table.createTitle' } />
                    </Button>
                </ModalFooter>
            </Modal>
            <SweetAlert show={error}
                        warning
                        confirmBtnBsStyle="danger"
                        confirmBtnText="Okay"
                        onConfirm={() => setError(null)}
                        title="Error"
            >
                {error?.message}
            </SweetAlert>
            <SweetAlert show={successPopup}
                        success
                        confirmBtnText="Great"
                        onConfirm={()=>props.onClose(true)}
                        title="Success">
                {popupMsg ? popupMsg : ''}
            </SweetAlert>
        </div>
    );
};

export default AddOrderComment;
