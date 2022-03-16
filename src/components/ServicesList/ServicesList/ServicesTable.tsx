import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CardBox from "../../CardBox";
import moment from "moment";
import IntlMessages from "../../../util/IntlMessages";

import {IServicesTableProps} from './Interface/ServicesTableInterface';
import {IService} from "../../../reducers/Interface/ServicesReducerInterface";

const ServicesTable: React.FC<IServicesTableProps> = (props) => {
    
	const {dataList} = props;
	return (
		<div className="table-responsive-material">
			{dataList ? <>
				<div className="row mb-md-3">
					<CardBox styleName="col-12" cardStyle="p-0" heading="Service List" headerOutside>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell align={"center"}><IntlMessages id="services.id"/></TableCell>
									<TableCell><IntlMessages id="services.name"/></TableCell>
									<TableCell align={"center"}><IntlMessages id="services.category"/></TableCell>
									<TableCell align={"center"}><IntlMessages id="services.description"/></TableCell>
									<TableCell align={"center"}><IntlMessages id="services.order"/></TableCell>
									<TableCell align={"center"}><IntlMessages id="services.created-at"/></TableCell>
									<TableCell align={"center"}><IntlMessages id="services.updated-at"/></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataList && dataList.map((data: IService) => {
									return (
										<TableRow key={data.id}>
											<TableCell align={"center"}><b>{data.id}</b></TableCell>
											<TableCell>{data.name}</TableCell>
											<TableCell align={"center"}>{data.category.name}</TableCell>
											<TableCell align={"center"}>{data.description ? data.description : '-'}</TableCell>
											<TableCell align={"center"}>{data.order}</TableCell>
											<TableCell align={"center"}>{data.created_at ? moment(data.created_at).format('DD/MM/YYYY') : '-'}</TableCell>
											<TableCell align={"center"}>{data.updated_at ? moment(data.updated_at).format('DD/MM/YYYY') : '-'}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table></CardBox></div>
			</> : ''}
		</div>
	)
};

export default ServicesTable;
