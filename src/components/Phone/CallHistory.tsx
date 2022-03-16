import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import 'react-phone-input-2/lib/style.css'
import {
	clearCallHistoryAction,
	getCallHistoryAction,
} from 'actions/Actions/SoftPhoneActions';
import {
	Avatar,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText
} from "@material-ui/core";
import CallEndIcon from '@material-ui/icons/CallEnd';
import './Style/callHistory.css'
import CachedIcon from '@material-ui/icons/Cached';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import {Col, Row, Spinner} from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import IntlMessages from "../../util/IntlMessages";

const CallHistory: React.FC<any> = (props) => {

	const dispatch = useDispatch();

	const callHistoryState = useSelector((state: any) => state.softPhone.callHistory)
	const [page, setPage] = useState<number>(1)

	useEffect(() => {
		dispatch(clearCallHistoryAction())
	}, [])

	useEffect(() => {
		getCallHistory(page)
	}, [page])

	const getCallHistory = (page: number) => {
		dispatch(getCallHistoryAction(page))
	}

	const refreshCallHistory = () => {
		dispatch(clearCallHistoryAction())
		setPage(1)
		getCallHistory(1)
	}

	const fetchNextData = () => {
		setPage(page + 1)
	}

	return (
		<div>
			<div className="phone d-flex flex-column justify-content-between">
				<List
					className="pinned-list"
					style={{
						height: "500px"
					}}
					subheader={
						<div className="clearfix callHistoryHeader">
							<h3 className="float-left">CALL HISTORY</h3>
							<CachedIcon className="float-right" fontSize={'default'} onClick={refreshCallHistory}/>
						</div>
					}>
					{callHistoryState && !callHistoryState.error ?
						<InfiniteScroll
							height="45vh"
							dataLength={callHistoryState.callList.length} //This is important field to render the next data
							next={fetchNextData}
							hasMore={callHistoryState.meta && callHistoryState.meta.has_more_pages}
							loader={callHistoryState.loading}
							endMessage={
								<p style={{textAlign: 'center'}}>
									<b><IntlMessages id="infinityScrollBar.noDataLeft"/></b>
								</p>
							}
						>
							{callHistoryState && Boolean(callHistoryState.callList.length) ? callHistoryState.callList.map((data: any) => {
								return <Grid container spacing={1}>
									{/* Disabled 2 colounm view for call history */}
									{/* <Grid item xs={6}>
										<ListItem>
											<ListItemAvatar>
												<Avatar>
													{data.destination_caller_id.slice(0, 1)}
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={data.origin_caller_name ? data.origin_caller_name : 'Unknown'}
																		secondary={data.origin_caller_id}/>
										</ListItem>
									</Grid> */}
									<Grid item xs={12}>
										<ListItem>
											<ListItemAvatar>
												<Avatar>
													{data.destination_caller_id.slice(0, 1)}
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={data.origin_caller_name ? data.origin_caller_name : 'Unknown'}
																		secondary={data.origin_caller_id}/>
											<ListItemSecondaryAction>
												{data.status === "answered" ? <CallEndIcon fontSize={'default'}/> :
													<PhoneForwardedIcon fontSize={'default'}/>}
											</ListItemSecondaryAction>
										</ListItem>
									</Grid>
								</Grid>
							}) : <Row>
								<Col sm={{size: 1, offset: 5}}>
									<Spinner className="spinner" color="primary"/>
								</Col>
							</Row>}
						</InfiniteScroll> : <h3 style={{textAlign: 'center'}}>{callHistoryState && callHistoryState.error}</h3>}
				</List>
			</div>
		</div>
	)
}

export default CallHistory
