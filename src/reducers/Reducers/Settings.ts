import {
  CHANGE_DIRECTION,
  CHANGE_NAVIGATION_STYLE,
  COLLAPSED_DRAWER,
  HORIZONTAL_MENU_POSITION,
  INSIDE_THE_HEADER,
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  VERTICAL_NAVIGATION,
  WINDOW_WIDTH
} from 'constants/ActionTypes';
import languageData from '../../components/LanguageSwitcher/data'
import { ISetting } from "../Interface/SettingInterface";
import {IAction} from "../Interface/ActionInterface";

const rltLocale = ['ar'];
let locale:any = localStorage.getItem('locale');
if(!locale) {
  const defaultLanguage = languageData[0];
  localStorage.setItem('locale', JSON.stringify(defaultLanguage));
  locale = defaultLanguage
} else {
  locale = JSON.parse(locale)
}

const initialSettings: ISetting = {
  navCollapsed: false,
  drawerType: COLLAPSED_DRAWER,
  width: window.innerWidth,
  isDirectionRTL: false,
  navigationStyle: VERTICAL_NAVIGATION,
  horizontalNavPosition: INSIDE_THE_HEADER,
  locale
};

const settings = (state:ISetting = initialSettings, action:IAction) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        navCollapsed: false
      };
    case TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        navCollapsed: action.isNavCollapsed
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width
      };
    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
        isDirectionRTL: rltLocale.includes(action.payload.locale)

      };
    case CHANGE_DIRECTION:
      return {
        ...state,
        isDirectionRTL: !state.isDirectionRTL

      };

    case CHANGE_NAVIGATION_STYLE:
      return {
        ...state,
        navigationStyle: action.payload
      };


    case HORIZONTAL_MENU_POSITION:
      return {
        ...state,
        horizontalNavPosition: action.payload
      };


    default:
      return state;
  }
};

export default settings;
