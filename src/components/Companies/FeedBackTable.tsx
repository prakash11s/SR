import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import {Button, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Spinner} from "reactstrap";
import CardBox from "../CardBox";
import IntlMessages from "../../util/IntlMessages";
import {IFeedBackTableProps} from "./Interface/FeedBackTableInterface";
import moment from "moment";
import {useIntl} from "react-intl";

const FeedBackTable = (props: IFeedBackTableProps): JSX.Element => {
    /**
     * handle State for FeedbackList
     */
    const [page, setPage] = useState<number>(0);
    const {formatMessage} = useIntl();
    const dateFormat = formatMessage({id: 'feedbackTable.AcceptedFormat', defaultMessage: 'DD-MM-YYYY'});

    const { data, loading, meta, limit } = props;
    /**
     * handle page change event
     * @param event
     * @param page
     */
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
        setPage(page);
        props.onChange({page, limit});
    };

    /**
     * handle Per Page change event
     * @param event
     */
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPage(0);
        props.onChange({page: 0, limit: Number(event.target.value)});
    };

    const getAlertClass = ()=>{
        if(meta && meta.avarage){
            if((meta.avarage / 10) > 5){
                return "alertbox alert-success"
            }else if((meta.avarage / 10) > 4) {
                return "alertbox alert-info"
            }else if((meta.avarage / 10) > 3){
                return "alertbox alert-warning"
            }else {
                return "alertbox alert-danger"
            }
        }else{
            return "alertbox alert-danger"
        }
    };

    return (
        <div className="table-responsive-material">
            {data ? <>
                <div className="row mb-md-3">
                    <CardBox styleName="col-12" cardStyle="p-0" heading={<IntlMessages id="feedbackTable.title" />} headerOutside>
                        {
                            meta && meta.total > 0 && (
                                <h3 className={'entry-heading float-right'}>
                                    <div className={getAlertClass()}>
                                        <IntlMessages id="feedbackTable.Total" />: {meta.total}
                                        { meta.avarage && " - " }
                                        { meta.avarage && <IntlMessages id="feedbackTable.Average" /> }
                                        { meta.avarage && `: ${meta.avarage / 10}` }
                                    </div>
                                </h3>
                            )
                        }
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell><IntlMessages id="feedbackTable.Id" /></TableCell>
                                    <TableCell><IntlMessages id="feedbackTable.Name" /></TableCell>
                                    <TableCell><IntlMessages id="feedbackTable.Content" /></TableCell>
                                    <TableCell><IntlMessages id="feedbackTable.Rating" /></TableCell>
                                    <TableCell><IntlMessages id="feedbackTable.Accepted"/></TableCell>
                                    <TableCell><IntlMessages id="feedbackTable.Action" /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Boolean(data.length) ? data.map((rows: any, index: number) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{rows.id}</TableCell>
                                                <TableCell><b>{rows.name}</b></TableCell>
                                                <TableCell>
                                                    <Tooltip title={rows.content}>
                                                        {
                                                            rows.content.length > 50 ?
                                                                <p>{rows.content.slice(0, 50)} ....</p>
                                                                : <p>{rows.content}</p>
                                                        }
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>{rows.rating / 10}</TableCell>
                                                <TableCell>{rows.accepted ? moment(rows.accepted).format(dateFormat): "-"}</TableCell>
                                                <TableCell>
                                                    <Link to={`/support/reviews/${rows.id}`}>
                                                        <Button variant="contained" className="jr-btn bg-blue-grey text-white m-1">
                                                            <IntlMessages id="feedbackTable.openButton"/>
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                    : <TableRow>
                                        <TableCell colSpan={6} align={"center"} size={"medium"} variant={"head"}>
                                            {
                                                loading ? <Spinner color="primary" className={"spinner"}/>
                                                    : "There are 0 records returned from server"
                                            }
                                        </TableCell>
                                    </TableRow>}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={meta&&meta.total?meta.total : 0}
                                        rowsPerPage={limit}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardBox>
                </div>
            </> : ''}
        </div>
    )
};

export default FeedBackTable;
