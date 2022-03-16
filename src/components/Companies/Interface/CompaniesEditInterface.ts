export interface ICompaniesEditProps {
	history: IHistory,
	getPartnerSettingDetails: (id: string | null, history: any) => void,
	uploadImage: (id: string | null, avatar: any, callBack: (type: string, response: string) => void) => void,
	deleteRecognition:any,
	updatePartnerDetails: (id: string, data: object) => void,
	resetLoadingError: () => void,
	setPhone: (phone: string) => void,
	setEmail: (email: string) => void,
	setPhoneTwo: (phoneTwo: string) => void,
	setWebsite: (website: string) => void,
	setDescription: (description: string) => void,
	setCoc: (coc: string) => void,
	setVisibility: (visibility: number) => void,
	partner: {
		recognitions: any;
		name: string,
		phone: string,
		email: string,
		zip_code: string
		city: string,
		coc: null,
		avatar:string,
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
		public_visibility: number,
	},
	selectedDepartment: any,
	lineOne: string,
	lineThree: string,
	partnerLoading: boolean,
	partnerError: string,
	match: match<MatchParams>
}

export interface IHistory {
	push: (path: string) => void
}

interface MatchParams {
	name: string;
	id: any;
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
	servicesState: any;
}

export interface ICompaniesEditState {
	checked: number[],
	passwordChange: boolean,
	Image: string,
	uploadImage: string,
	imageLoading: boolean,
	imageAlert: boolean,
	isCocEmpty: boolean,
	imageAlertMsg: string,
	imageAlertType: string
	showPopUpValue: boolean,
	showExpiryDate: boolean,
	popUpType: string,
	popUpMsg:string,
	points: any,
	expiryDate: any,
	showRecognitionPopup: boolean,
	recognitionId: null|number,
	editRecognitionId: null|number
}
