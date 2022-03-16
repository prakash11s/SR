import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Switch,
	MenuItem,
	FormControl,
	Select
} from '@material-ui/core';
import {Card} from 'reactstrap';
import {useDispatch} from 'react-redux';

import IntlMessages from "../../util/IntlMessages";
import {IOperatingHoursTableProps} from "./Interface/OperatingHoursTableInterface";

import { updateOpeningHourAction } from "../../actions/Actions/PartnerSettingActions";
import {IDay} from "./Interface/OperatingHoursDisplayTableInterface";

const OperatingHoursTable: React.FC<IOperatingHoursTableProps> = (props) => {

	const dispatch = useDispatch();

	const handleToggle = (event: React.MouseEvent<HTMLElement>, day: string, status: boolean) => {
		updateHours(day, status, openingHours[day] && openingHours[day]['open'], openingHours[day] && openingHours[day]['close']);
	};

	const updateHours = (day: string, status: boolean, open: string | unknown, close: string | unknown) => {
		const payload = {
			opening_hours: {
				[day]: {
					"open_status": status,
					"open": open || "00:00",
					"close": close || "00:00",
				}
			}
		};

		dispatch(updateOpeningHourAction(props.id, payload, props.isPartners));
	};

	const updateOpeningHours = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, day: string) => {
		updateHours(day, openingHours[day]['open_status'], event.target.value, openingHours[day]['close']);
	};

	const updateClosingHours = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, day: string) => {
		updateHours(day, openingHours[day]['open_status'], openingHours[day]['open'], event.target.value);
	};

	const days: IDay[] =
		[
			{full_label: 'Monday', short_label: 'mon'},
			{full_label: 'Tuesday', short_label: 'tue'},
			{full_label: 'Wednesday', short_label: 'wed'},
			{full_label: 'Thursday', short_label: 'thu'},
			{full_label: 'Friday', short_label: 'fri'},
			{full_label: 'Saturday', short_label: 'sat'},
			{full_label: 'Sunday', short_label: 'sun'}
		];

	const time: string[] =
		[
			'00:00', '00:30',
			'01:00', '01:30',
			'02:00', '02:30',
			'03:00', '03:30',
			'04:00', '04:30',
			'05:00', '05:30',
			'06:00', '06:30',
			'07:00', '07:30',
			'08:00', '08:30',
			'09:00', '09:30',
			'10:00', '10:30',
			'11:00', '11:30',
			'12:00', '12:30',
			'13:00', '13:30',
			'14:00', '14:30',
			'15:00', '15:30',
			'16:00', '16:30',
			'17:00', '17:30',
			'18:00', '18:30',
			'19:00', '19:30',
			'20:00', '20:30',
			'21:00', '21:30',
			'22:00', '22:30',
			'23:00', '23:30'
		];

	const {openingHours} = props;
	return (
		openingHours[Object.keys(openingHours)[0]].hasOwnProperty('open_status') ?
		<>
			<h4><b><IntlMessages id="company.opening-hours"/></b></h4>
			<Card className="border shadow p-3 mb-5 bg-white rounded">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell><IntlMessages id="company.opening-hours.weekdays"/></TableCell>
							<TableCell><IntlMessages id="company.opening-time"/></TableCell>
							<TableCell><IntlMessages id="company.closing-time"/></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{days.map((day, index) => {
							return (
								<TableRow key={index} className=''>
									<TableCell className='lineHeightZero paddingTen'>
										<Switch
											classes={{
												checked: 'text-secondary',
											}}
											onClick={event => handleToggle(event, day.short_label, openingHours[day.short_label] && !openingHours[day.short_label]['open_status'])}
											checked={openingHours[day.short_label] && openingHours[day.short_label]['open_status']}
										/>
										<b><IntlMessages id={day.full_label}/></b>
									</TableCell>

									<TableCell className='lineHeightZero paddingTen'>
										{openingHours[day.short_label] && openingHours[day.short_label]['open_status'] ?
											<FormControl className="w-75 mb-2 h-75">
												<Select
													value={openingHours[day.short_label] && openingHours[day.short_label].open}
													onChange={(event) => updateOpeningHours(event, day.short_label)}
													required
												>
													{time.map(time =>
														<MenuItem value={time}>{time}</MenuItem>
													)}

												</Select>
												<br></br>
											</FormControl> : <IntlMessages id="company.closed"/>}
									</TableCell>

									<TableCell className='lineHeightZero paddingZero'>
										{openingHours[day.short_label] && openingHours[day.short_label]['open_status'] ?
											<FormControl className="w-75 mb-2 h-75">
												<Select
													value={openingHours[day.short_label] && openingHours[day.short_label].close}
													onChange={(event) => updateClosingHours(event, day.short_label)}
													required
												>
													{time.map(time =>
														<MenuItem value={time}>{time}</MenuItem>
													)}

												</Select>
												<br></br>
											</FormControl> : <IntlMessages id="company.closed"/>}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</> : null
	)
}


export default OperatingHoursTable;
