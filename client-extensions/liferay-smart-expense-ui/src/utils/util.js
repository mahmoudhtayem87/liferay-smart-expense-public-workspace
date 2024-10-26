/* global Liferay */

import moment from "moment";

export function showError(title, message) {
    Liferay.Util.openToast({message, title, type: 'danger'});
}

export function getCurrentSiteId(){
    return Liferay.ThemeDisplay.getScopeGroupId()
}

export function getThemeImages () {
    return Liferay.ThemeDisplay.getPathThemeImages();
}

export function getLiferayThemeSpritemap(){
    return Liferay.Icons.spritemap
}
export const getNumericValue = (str) => {
    if (typeof str === 'string') {
        return parseFloat(str.replace(/[^0-9.-]+/g, ''));
    }else
        return str || 0;
};

export const getSelectedLanguage = () => {
    return Liferay.ThemeDisplay.getLanguageId().split('_')[0];
}

export const getCurrentUserId = () => {

    return Liferay.ThemeDisplay.getUserId();

}

export function showSuccess(
    title,
    message = 'The request has been successfully completed.'
) {
    Liferay.Util.openToast({message, title, type: 'success'});
}

