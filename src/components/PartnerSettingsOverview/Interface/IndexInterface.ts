export interface IPartnerSettingsOverviewProps {
	history: IHistory,
	getPartnerSettingDetails: (history: any) => void,
	updatePartnerDetails: (id: string, payload: object, isPartners: boolean) => void,
	uploadImage: (id: string, avatar: any, isPartners: boolean, callBack: (type: string, response: string) => void) => void,
	resetLoadingError: () => void,
	setPhone: (phone: string) => void,
	setEmail: (email: string) => void,
	setPhoneTwo: (phoneTwo: string) => void,
	setWebsite: (website: string) => void,
	setDescription: (description: string) => void,
	setCoc: (coc: string) => void,
	partner: {
		avatar: string,
		name: string,
		phone: string,
		email: string,
		zip_code: string
		city: string,
		coc: null,
		country: string,
		created_at: string,
		deleted_at: null,
		department: string,
		description: null,
		id: string,
		lat: null,
		lng: null,
		old_service_point_id: 12345,
		opening_hours: {
			fri: { open: string, close: string }
			mon: { open: string, close: string }
			sat: { open: string, close: string }
			sun: { open: string, close: string }
			thu: { open: string, close: string }
			tue: { open: string, close: string }
			wed: { open: string, close: string }
		},
		phone_2: string,
		street: string,
		street_number: string,
		updated_at: string,
		website: null,
		connections: any
	},
	lineOne: string,
	lineThree: string,
	match: match<MatchParams>,
	partnerLoading: boolean,
	partnerError: string,
	selectedDepartment: any,
}

export interface IHistory {
	push: (path: string) => void
}

interface MatchParams {
	name: string;
}

interface match<P> {
	params: P;
	isExact: boolean;
	path: string;
	url: string;
}

export interface IRootPartnerSettingState {
	partnerSettingState: any;
	department: any;
}

export interface IPartnerSettingsOverviewState {
	checked: number[],
	Image: string,
	imageLoading: boolean,
	imageAlert: boolean,
	imageAlertMsg: string,
	imageAlertType: string,
	isStripeBtnShow: boolean,
	isStripeSuccess: boolean
}