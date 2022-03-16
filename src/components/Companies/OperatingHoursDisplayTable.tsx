import React from 'react';
import {Card} from 'reactstrap';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@material-ui/core';

import IntlMessages from "../../util/IntlMessages";
import {
	IOperatingHoursDisplayTableProps,
	IDay
} from "./Interface/OperatingHoursDisplayTableInterface";

const OperatingHoursDisplayTable: React.FC<IOperatingHoursDisplayTableProps> = (props) => {

	const days: IDay[] = [
		{full_label: 'Monday', short_label: 'mon'},
		{full_label: 'Tuesday', short_label: 'tue'},
		{full_label: 'Wednesday', short_label: 'wed'},
		{full_label: 'Thursday', short_label: 'thu'},
		{full_label: 'Friday', short_label: 'fri'},
		{full_label: 'Saturday', short_label: 'sat'},
		{full_label: 'Sunday', short_label: 'sun'}
	]

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
						{days.map((day: IDay, index: number) => {
							return (
								<TableRow key={index} className=''>
									<TableCell className='lineHeightZero paddingTen'>
										 <b><IntlMessages id={day.full_label}/></b>
									</TableCell>
									<TableCell className='lineHeightZero paddingTen'>
										{openingHours[day.short_label]?.open_status ? openingHours[day.short_label].open : <IntlMessages id="company.closed"/>}
									</TableCell>
									<TableCell className='lineHeightZero paddingZero'>
										{openingHours[day.short_label]?.open_status ? openingHours[day.short_label].close : <IntlMessages id="company.closed"/>}
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

export default OperatingHoursDisplayTable;
