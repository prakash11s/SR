import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button, Input, TextField } from "@material-ui/core";
import { useIntl } from "react-intl";
import IntlMessages from "util/IntlMessages";
import { makeStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Spinner } from "reactstrap";

const EmployeeListModal: React.FC<any> = ({
    showModal,
    toggleModal,
    onEmpSelect,
    list,
    loading
}) => {


    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: 400,
            overflow: 'auto',
            backgroundColor: theme.palette.background.paper,
        },
        listItem: {
            alignItems: 'center'
        }
    }));

    const classes = useStyles();

    return (
        <>
            <Modal
                isOpen={showModal}
                toggle={toggleModal}
                className="modal-align"
                keyboard={false}
                style={{ maxWidth: "400px", maxHeight: "600px" }}
            >
                <ModalHeader toggle={toggleModal}>
                    <IntlMessages id="empList" />
                </ModalHeader>
                <ModalBody>
                    {loading ? (<div className="text-center">
                        <Spinner color="primary" className={"spinner"} />
                    </div>) : (
                        <List className={classes.root} role="list">
                            {list.length > 0 ? list.map((el: any, i: number) => (
                                <ListItem
                                    className={classes.listItem}
                                    key={i}
                                    button
                                    alignItems="center"
                                    onClick={(e) => onEmpSelect(e, el.id)}
                                >
                                    <ListItemText primary={`${el.first_name} ${el.last_name}`} />
                                </ListItem>
                            )) : <div className="text-center">
                                <IntlMessages id="paginationTable.noData" />
                            </div>}

                        </List>
                    )}

                </ModalBody>
            </Modal>
        </>
    )
}

export default EmployeeListModal;