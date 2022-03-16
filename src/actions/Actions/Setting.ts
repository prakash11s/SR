import {
    CHANGE_DIRECTION,
    CHANGE_NAVIGATION_STYLE,
    DARK_THEME,
    DRAWER_TYPE,
    HORIZONTAL_MENU_POSITION,
    SWITCH_LANGUAGE,
    THEME_COLOR,
    TOGGLE_COLLAPSED_NAV,
    WINDOW_WIDTH
} from 'constants/ActionTypes';

export function toggleCollapsedNav(isNavCollapsed:boolean) {
    return {type: TOGGLE_COLLAPSED_NAV, isNavCollapsed};
}

export function setDrawerType(drawerType:any) {
    return {type: DRAWER_TYPE, drawerType};
}

export function updateWindowWidth(width:any) {
    return {type: WINDOW_WIDTH, width};
}

export function setThemeColor(color:any) {
    return {type: THEME_COLOR, color};
}

export function setDarkTheme() {
    return {type: DARK_THEME};
}

export function changeDirection() {
    return {type: CHANGE_DIRECTION};
}

export function changeNavigationStyle(layoutType:any) {
    return {
        type: CHANGE_NAVIGATION_STYLE,
        payload: layoutType
    };
}

export function setHorizontalMenuPosition(navigationPosition:any) {
    return {
        type: HORIZONTAL_MENU_POSITION,
        payload: navigationPosition
    };
}

export function switchLanguage(locale:object) {
    return {
        type: SWITCH_LANGUAGE,
        payload: locale
    };
}
