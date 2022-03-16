import React, { useState } from 'react';
import { Spinner } from "reactstrap";
import { useIntl } from "react-intl";
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    TextField,
    IconButton,
    FormControl, Select,
    MenuItem
} from "@material-ui/core";
import moment from "moment";
import IntlMessages from "../../util/IntlMessages";
import CardBox from "../../components/CardBox";
import { formatPrice, readableDateTimeLocale } from "../../util/helper";
import { DatePicker } from "material-ui-pickers";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

import CardMenuEmail
    from 'components/dashboard/Common/CardMenuEmail/CardMenuEmail';
import CardMenu from 'components/dashboard/Common/CardMenu/CardMenu';
import { useHistory } from "react-router";


const PaginationTable = (props): JSX.Element => {
    const { formatMessage } = useIntl();

    const { columns, dataList, loading, meta, error, secondHeader, isSortable } = props;
    const page = meta && meta.hasOwnProperty('page') ? (meta.page - 1) : 0;
    const total = meta && meta.hasOwnProperty('total') ? meta.total : dataList.length;
    const limit = meta && meta.hasOwnProperty('limit') ? meta.limit : dataList.length;

    const [sortProps, setSortProps] = React.useState({
        type: "ASC",
        column: ""
    });

    const [arrow, setArrow] = useState(false);

    const [emailState, setEmailState] = React.useState({
        x: 0, y: 0,
        rowClick: true,
        menuState: false,
        id: undefined
    });

    const history = useHistory();


    /**
     * handle sorting event
     */
    const handleSortChange = (type, column) => {
        setArrow(true)
        if (isSortable == undefined || isSortable === false) return;

        const sortType = type == 'ASC' ? 'DESC' : 'ASC';

        if (sortProps.column === column) {
            setSortProps({
                type: sortType,
                column
            })
        } else {
            setSortProps({
                type: 'DESC',
                column
            })
        }

    }

    React.useEffect(() => {
        if (sortProps.column != '' && sortProps.column != null) {
            const params = {};
            const sortObject = {};
            sortObject[sortProps.column] = sortProps.type;
            params[`sort[${sortProps.column}]`] = sortProps.type
            props?.onSort(sortProps.column);
        }

    }, [sortProps])


    /**
     * handle page change event
     * @param event
     * @param selected
     */
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, selected: number): void => {
        props.onChange({ page: selected, limit });
    };

    /**
     * handle Per Page change event
     * @param event
     */
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.onChange({ page: 0, limit: Number(event.target.value) });
    };

    /**
     * Get Values according Key property
     * @param obj
     * @param path
     */
    const getValue = (obj, path) => {
        if (!path) return obj;
        const properties = path.split('.');
        return getValue(obj[properties.shift()], properties.join('.'))
    };

    /**
     * Get Date & Time according formats
     * @param date
     * @param format
     */
    const convertDateTime = (date, format) => {
        const formatString = formatMessage({ id: format, defaultMessage: "DD-MM-YYYY HH:mm:ss" });
        return date ? readableDateTimeLocale(date, formatString) : "-";
    };


    /*
    * Table row context menu handler
    */
    const onRightClick = (event, id) => {



        event.preventDefault();
        if (emailState.menuState) {

            props.handleRowClickState(true);
            setEmailState(prevState => ({
                ...prevState,
                x: 0, y: 0,
                menuState: false,
                id: undefined
            }))

        } else {

            let xCordinate = event.clientX;
            let yCordinate = event.clientY;
            props.handleRowClickState(false);
            setEmailState(prevState => ({
                ...prevState,
                menuState: true,
                x: xCordinate, y: yCordinate,
                id
            }))
        }
    }

    const handleRequestClose = (event, path) => {

        event.stopPropagation();
        if (path !== 'backdropClick') {
            history.push(path);
        }
        setEmailState(prevState => ({
            ...prevState,
            x: 0, y: 0,
            rowClick: true,
            menuState: false,
            id: undefined
        }))
    }

    const closeContextMenu = () => {
        setEmailState(prevState => ({
            ...prevState,
            menuState: false,
            x: 0, y: 0
        }))
    }

    React.useEffect(() => {
        if (props?.isContextMenu && !emailState.menuState && !props.rowClick) {
            props?.handleRowClickState(true);
        }
    }, [emailState.menuState])
    /* ----------------------------------- Search Functionality--------------------- */

    return (
        <div className="row mb-md-3">
            <CardBox styleName="col-12" cardStyle="p-0" headerOutside>
                <div className="table-responsive-material">
                    <Table>
                        <TableHead>
                            <TableRow >
                                {
                                    Boolean(columns.length) && columns.map((tCell: any, tCellIndex: number) =>
                                        <TableCell align={tCell.align ? tCell.align : "left"} key={`th-${tCellIndex}`} className={tCell?.sort === true ? 'mousePointer' : ''} onClick={() => tCell?.sort === true ? handleSortChange(sortProps.type, tCell?.key) : undefined}>
                                            <b className="mt-2"><IntlMessages id={tCell.name} /></b>
                                            {tCell?.sort === true && (
                                                
                                                props.sortColumns[tCell.key] === 'desc' ? (
                                                    <ArrowDownwardIcon />
                                                ) : (props.sortColumns[tCell.key] === 'asc' ? <ArrowUpwardIcon /> : '')
                                            )}

                                        </TableCell>
                                    )
                                }
                            </TableRow>
                            {secondHeader !== undefined && secondHeader === true && (
                                <TableRow >
                                    {
                                        Boolean(columns.length) && columns.map((tCell: any, tCellIndex: number) =>
                                            <TableCell align={tCell.align ? tCell.align : "left"} key={`th-${tCellIndex}`}>

                                                {tCell?.search && (

                                                    (tCell?.type == 'text' || tCell?.type == 'number') ? (

                                                        <TextField
                                                            type={tCell?.type}
                                                            onChange={(e) => { e.preventDefault(); e.stopPropagation(); props.handleSeachToggle(tCell.key, e.target.value) }}
                                                            value={tCell?.value || ''}
                                                            label={<IntlMessages id="search" />}
                                                            variant="outlined" />
                                                    ) : tCell?.type == 'date' ? (
                                                        <DatePicker
                                                            format="DD-MM-YYYY"
                                                            clearable
                                                            value={tCell?.value || null}
                                                            maxDate={new Date()}
                                                            variant="outlined"
                                                            animateYearScrolling={false}
                                                            rightArrowIcon={
                                                                <i className="zmdi zmdi-arrow-forward" />
                                                            }
                                                            onChange={(date) => props.handleSeachToggle(tCell.key, date == null ? '' : moment(date).format('YYYY-MM-DD'))}
                                                            disabled={false}
                                                        />

                                                    ) : tCell?.type == 'daterange' ? (
                                                        <TextField
                                                            InputProps={{ inputProps: { max: "2021-05-31" } }}
                                                            onChange={undefined}
                                                            type="date"
                                                            defaultValue="2021-05-24"
                                                            label={<IntlMessages id="orderOptions.search-orders" />}
                                                            variant="outlined" />
                                                    ) : tCell?.type == 'boolean' ? (
                                                        <FormControl className="w-20 mb-2" >
                                                            <Select
                                                                value={tCell?.value}
                                                                onChange={(e) => props.handleSeachToggle(tCell.key, e.target.value)}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem value=""><em>None</em></MenuItem>
                                                                <MenuItem value="1"><em>True</em></MenuItem>
                                                                <MenuItem value="0"><em>False</em></MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    ) : <></>



                                                )}

                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            )}

                        </TableHead>
                        <TableBody>

                            {
                                !loading && Boolean(dataList.length) && Boolean(columns.length) && !error && dataList.map((data: any, index: number) => {


                                    return (
                                        <>

                                            <TableRow key={`tr-${index}`} onContextMenu={props.isContextMenu ? (e) => onRightClick(e, data?.id) : undefined} onClick={props.rowClick ? (e) => props.onRowClick(data.id) : undefined} className="mousePointer">

                                                {
                                                    columns.map((tCell: any, tCellIndex: number) => {
                                                        const value = getValue(data, tCell.key);                                                    

                                                        if (tCell.render)
                                                            return (<><TableCell align={tCell.align ? tCell.align : "left"}
                                                                key={`td-${index}-${tCellIndex}`}>{tCell.render(data, props.recordingUrl)}</TableCell>
                                                                {emailState.id == data.id && <CardMenuEmail style={{ x: emailState.x, y: emailState.y }} menuState={emailState.menuState} orderId={props?.orderId} emailId={data.id} isSystemEmail={props?.isSystemEmail}
                                                                    handleRequestClose={handleRequestClose} handleClose={closeContextMenu} />}
                                                            </>);
                                                        else if (tCell.format && tCell.format !== "isPrice")
                                                            return (<><TableCell align={tCell.align ? tCell.align : "left"}
                                                                key={`td-${index}-${tCellIndex}`}>{convertDateTime(value, tCell.format)}</TableCell></>);                                              
                                                        else
                                                            return (<><TableCell align={tCell.align ? tCell.align : "left"}
                                                                key={`td-${index}-${tCellIndex}`} width={tCell.width ? tCell.width : "10%"}>{tCell.format === "isPrice" ? formatPrice(value) : value}</TableCell>

                                                            </>);

                                                    })
                                                }

                                            </TableRow>
                                        </>

                                    );
                                })
                            }
                            {
                                !loading && !Boolean(dataList.length) && !error &&
                                <TableRow>
                                    <TableCell colSpan={columns.length} align={"center"} size={"medium"} variant={"head"}>
                                        <IntlMessages id="paginationTable.noData" />
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                !loading && error &&
                                <TableRow>
                                    <TableCell colSpan={columns.length} align={"center"} size={"medium"} variant={"head"}>
                                        {error}
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                loading && <TableRow>
                                    <TableCell colSpan={columns.length} align={"center"} size={"medium"} variant={"head"}>
                                        <Spinner color="primary" className={"spinner"} />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    page={page}
                                    count={total}
                                    rowsPerPage={limit}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    labelRowsPerPage={<IntlMessages id="tablePaginationLabel" />}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardBox>

        </div>
    )
};

export default PaginationTable;
