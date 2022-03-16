import {
  SET_SERVICEPOINT_DETAILS,
  SET_PARTNER_PHONE,
  SET_PARTNER_EMAIL,
  SET_PARTNER_PHONE_TWO,
  SET_PARTNER_WEBSITE,
  SET_PARTNER_DESCRIPTION,
  SET_PARTNER_COC,
  SERVICEPOINT_ACCESS_CHECK,
  UPDATE_SERVICEPOINT_DETAILS,
  START_PARTNER_LOADING,
  STOP_PARTNER_LOADING,
  SET_ERROR,
  RESET_ERROR,
  SET_PARTNER_VISIBILITY,
  SET_PARTNER_TYPE_ID,
  SET_PARTNER_NAME,
  SET_PARTNER_STREET,
  SET_PARTNER_STREET_NUMBER,
  SET_PARTNER_ZIPCODE,
  SET_PARTNER_CITY,
  SET_PARTNER_CONTACT
} from "../../constants/ActionTypes";
import {IPartnerSettingReducer} from "../Interface/PartnerSettingReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IPartnerSettingReducer = {
  servicePointDetails: {
    id: null,
    department: null,
    name: null,
    coc: null,
    street: null,
    street_number: null,
    city: null,
    zip_code: null,
    lng: null,
    lat: null,
    country: null,
    phone: null,
    phone_2: null,
    email: null,
    website: null,
    description: null,
    old_service_point_id: null,
    opening_hours: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    public_visibility: 0,
  },
  accessCheck: '',
  loading: false,
  error: null,
};

export default (state: IPartnerSettingReducer = initialState, {type, payload}: IAction) => {
  switch (type) {
    case SET_SERVICEPOINT_DETAILS:
      return {
        ...state,
        servicePointDetails: payload,
        loading: false,
        error: null
      };
    case UPDATE_SERVICEPOINT_DETAILS:
      return {
        ...state,
        servicePointDetails: payload,
        error: null,
      };
    case START_PARTNER_LOADING:
      return {
        ...state,
        loading: true
      };
    case STOP_PARTNER_LOADING:
      return {
        ...state,
        loading: false
      };
    case SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case RESET_ERROR:
      return {
        ...state,
        loading: false,
        error: null
      };

    case SET_PARTNER_PHONE:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          phone: payload,
        },
      };

    case SET_PARTNER_EMAIL:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          email: payload,
        },
      };

    case SET_PARTNER_CONTACT:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          contact: payload,
        },
      };

    case SET_PARTNER_PHONE_TWO:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          phone_2: payload,
        },
      };

    case SET_PARTNER_WEBSITE:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          website: payload,
        },
      };

    case SET_PARTNER_COC:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          coc: payload,
        },
      };

    case SET_PARTNER_NAME:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          name: payload,
        },
      };

    case SET_PARTNER_STREET:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          street: payload,
        },
      };

    case SET_PARTNER_STREET_NUMBER:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          street_number: payload,
        },
      };

    case SET_PARTNER_ZIPCODE:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          zip_code: payload,
        },
      };

    case SET_PARTNER_CITY:
          return {
            ...state,
            servicePointDetails: {
              ...state.servicePointDetails,
              city: payload,
            },
          };

    case SET_PARTNER_VISIBILITY:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          public_visibility: payload,
        },
      };

    case SET_PARTNER_TYPE_ID:
      return {
        ...state,
        servicePointDetails: {
          ...state.servicePointDetails,
          service_point_type_id: payload,
        },
      };      

    case SET_PARTNER_DESCRIPTION:
      return {
        ...state,
        servicePointDetails :{
          ...state.servicePointDetails,
          description: payload
        }
      };

    case SERVICEPOINT_ACCESS_CHECK:
      return {
        ...state,
        accessCheck: payload
      }

    default:
      return state;
  }
};
