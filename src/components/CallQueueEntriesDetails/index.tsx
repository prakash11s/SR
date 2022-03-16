import React from "react";
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import api from "../../util/Api";
import { setCallQueueIdData } from '../../actions/Actions/callQueueListActions';
import IntlMessages from "../../util/IntlMessages";
import {readableDateTimeLocale} from "../../util/helper";
import {Card, CardBody, CardText} from "reactstrap";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {injectIntl} from "react-intl";

class CallQueueEntriesDetails extends React.Component<any,any> {

    constructor(props:any) {
        super(props);
        this.state = {
            entryData: null,
            isTableLoading: false
        };
    }

    componentDidMount() {
        this.getQueueEntries();
    }

    getQueueEntries = () => {
        const id = this.props.match.params.id;
        const entry = this.props.match.params.entry;
        this.setState({ isTableLoading: true })
        api(`/call-queues/${id}/entries`).then(response => {
            this.setState({ isTableLoading: false })
            const data = response.data.data;
            this.setState({ entryData:data[0] });
        }).catch(error=>{
            console.log(error)
        })
    }

    fetchData = () => {
        this.setState({ page: this.state.page + 1 }, () => this.getQueueEntries())
    };

    render() {
        const { entryData, isTableLoading } = this.state
        const tableLoading = isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
        const localDateTimeFormat = this.props.intl.formatMessage({ id: 'localeDateTime', defaultMessage:"DD-MM-YYYY hh:mm:ss"});
        return (
            <div>
                {tableLoading}
                {!tableLoading && entryData && (
                    <>
                    <div className="jr-card p-0">
                        <div className="jr-card-1header card-img-top mb-0 p-4 bg-grey lighten-4">
                            <h3 className="card-heading"><b> <IntlMessages id="entries.name" /> : </b>{entryData.name}</h3>
                        </div>
                        <div className="card-body">
                            <ul className="contact-list list-unstyled">
                                <li className= "media">
                                      <span className="media-body">
                                        <b><IntlMessages id="entries.name" />:</b>
                                          {entryData.name}
                                    </span>
                                    <span className="media-body">
                                            <b><IntlMessages id="entries.status" />:</b> {entryData.status}
                                    </span>
                                </li>
                                <li className= "media">
                                    <span className="media-body">
                                    <b><IntlMessages id="entries.phone" />:</b>
                                        {entryData.phone}
                                    </span>
                                    <span className="media-body">
                                        <b><IntlMessages id="entries.createdAt" />:</b> {readableDateTimeLocale(entryData.created_at,localDateTimeFormat)}
                                    </span>
                                </li>
                                <li className= "media">
                                    <span className="media-body">
                                        <b> <IntlMessages id="entries.email"/>:</b> {entryData.email}
                                    </span>
                                    <span className="media-body">
                                        <b><IntlMessages id="entries.updatedAt" />:</b> {readableDateTimeLocale(entryData.updated_at,localDateTimeFormat)}
                                    </span>
                                </li>
                                <li className="media">
                                    <span className="media-body">
                                        <b><IntlMessages id="entries.description" />:</b>
                                        <div dangerouslySetInnerHTML={{__html: entryData.description}} />
                                    </span>
                                </li>
                            </ul>
                        </div>

                    </div>
                        <div className="d-flex justify-content-between">
                        <h3 className="mt-2"><IntlMessages id="dashboard.comments"/></h3>
                        </div>
                        <Card className={`shadow border-0`} id="order-details-table" style={{marginBottom: '50px'}}>
                            <CardBody>
                                <CardText>
                                    <div className="table-responsive-material">
                                        <Table className="default-table table-unbordered table table-sm table-hover">
                                            <TableHead className="th-border-b">
                                                <TableRow>
                                                    <TableCell align={"center"} size={"medium"} variant={"head"}>
                                                        <IntlMessages id="comments.table.id"/>
                                                    </TableCell>
                                                    <TableCell align={"center"} size={"medium"} variant={"head"}>
                                                        <IntlMessages id="comments.visibility"/>
                                                    </TableCell>
                                                    <TableCell align={"center"} size={"medium"} variant={"head"}>
                                                        <IntlMessages id="dashboard.commentable_type"/>
                                                    </TableCell>
                                                    <TableCell align={"center"} size={"medium"} variant={"head"}>
                                                        <IntlMessages id="dashboard.comments"/>
                                                    </TableCell>
                                                    <TableCell align={"center"} size={"medium"} variant={"head"}>
                                                        <IntlMessages id="comments.table.createdAt"/>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    entryData.comments && entryData.comments.length !== 0 ? entryData.comments.map((comment: any) => {
                                                        return <TableRow>
                                                            <TableCell align={"center"} size={"medium"} variant={"head"}>{comment.id}</TableCell>
                                                            <TableCell align={"center"} size={"medium"} variant={"head"}><IntlMessages id={`comments.visibility.${comment.visibility}`}/></TableCell>
                                                            <TableCell align={"center"} size={"medium"} variant={"head"}>{comment.commentable_type}</TableCell>
                                                            <TableCell align={"center"} size={"medium"} variant={"head"}>{comment.comment}</TableCell>
                                                            <TableCell align={"center"} size={"medium"} variant={"head"}>{comment.created_at?readableDateTimeLocale(comment.created_at,localDateTimeFormat): '-'}</TableCell>
                                                        </TableRow>
                                                    })
                                                        :
                                                    <TableRow>
                                                        <TableCell align={"center"} size={"medium"} variant={"head"} colSpan={5}>
                                                            <h3>There are 0 comments</h3>
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardText>
                            </CardBody>
                        </Card>
                    </>)}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCallQueueIdData: (id) => dispatch(setCallQueueIdData(id))
    }
};

export default connect(null, mapDispatchToProps)(injectIntl(CallQueueEntriesDetails));

