import {
	Checkbox,
	Input,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import CustomScrollbars from "../../util/CustomScrollbars";
import { ICustomListProps } from "./Interface/IndexInterface";
import { withStyles } from "@material-ui/core/styles";
import { CURRENCY_CODES } from "../../constants/common.constants";
import CurrencyInput from "react-currency-input-field";

const getCurrentLocale = () => {
	const data = localStorage.getItem('locale');
	if (data) {
		return JSON.parse(data && data).locale
	} else {
		return 'en';
	}
};

const CustomList = (props: ICustomListProps) => {
	var sortdataList = props.dataList.sort((a, b) => {
		if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
		if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
		return 0;
	});

	const TextOnlyTooltip = withStyles({
		tooltip: {
			color: "#fff",
			backgroundColor: "#ff5b5b",
			children: '<i className="zmdi zmdi-lock-open"/>'
		}
	})(Tooltip);
	const LightTooltip = withStyles((theme) => ({
		arrow: {
			color: theme.palette.common.white,
			left: "16px"
		},
		tooltip: {
			backgroundColor: theme.palette.common.white,
			color: 'rgba(0, 0, 0, 0.87)',
			boxShadow: theme.shadows[1],
			fontSize: 11,
		},
	}))(Tooltip);

	var permission = props.permissionState.filter((permission: any) => permission.name === 'booking-service-support-set-custom-price');
	const currencyConvert = CURRENCY_CODES.find(code => code.currency_code_iso === (getCurrentLocale() === 'en' ? 'DOLLAR' : 'EUR'));

	return (
		<List className="pinned-list" subheader={<div />}>
			<CustomScrollbars className="scrollbar" style={{ height: '100%' }}>
				{sortdataList.map((item) =>
					<ListItem button key={item.id} onClick={(event: React.MouseEvent<HTMLElement>) => props.onToggle(event, item.id, item.checked)} className='col-12'>
						<Checkbox color="primary"
							checked={item.checked}
							tabIndex={-1}
						/>
						<LightTooltip placement="bottom" arrow title={<div dangerouslySetInnerHTML={{ __html: item.description || '' }} ></div>}>
							<ListItemText primary={item.name}className='col-9' />
						</LightTooltip>
						<ListItemSecondaryAction className='col-3'>
							{permission.length ?
								<CurrencyInput
									placeholder="Price"
									allowDecimals={true}
									decimalsLimit={2}
									prefix={currencyConvert ? currencyConvert.symbol : ''}
									precision={2}
									value={item.service_price ? (item.service_price.price / 100).toFixed(2) : 0}
									disabled={!permission.length}
									onChange={(event: any) => props.onPriceChange(event, item.id)}
								/>

								// <Input type="number" id={item.id} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onPriceChange(event, item.id)} placeholder={'Price'} value={item.service_price ? (item.service_price.price/(currencyConvert?currencyConvert.converters:1)) : 0}/>
								: <TextOnlyTooltip title="you don't have the permission to edit this field">
									<CurrencyInput
										id={item.id}
										placeholder="Price"
										allowDecimals={true}
										decimalsLimit={2}
										prefix={currencyConvert ? currencyConvert.symbol : ''}
										precision={2}
										className={'forbidden-input'}
										value={item.service_price ? (item.service_price.price / 100).toFixed(2) : 0}
										disabled={permission.length}
									/>
								</TextOnlyTooltip>
							}
						</ListItemSecondaryAction>
					</ListItem>
				)}
			</CustomScrollbars>
		</List>
	)
};

export default CustomList;
