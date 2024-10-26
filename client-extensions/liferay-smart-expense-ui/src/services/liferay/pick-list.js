import {request} from "../../utils/request";
import {config} from "../../utils/constants";

export function getPickListEntries(pickListERC) {

    let request_config = {
        method: 'GET',
        url: `${config.liferayPickListEndPoint}${pickListERC}/list-type-entries?page=0`,
    }

    return request(request_config);
}


export function getCurrenciesPickListEntries() {

    return getPickListEntries(config.pickListCurrencies);

}

export function getExpenseTypePickListEntries() {

    return getPickListEntries(config.pickListExpenseType);

}

export function getPaymentTypePickListEntries() {

    return getPickListEntries(config.pickListPaymentType);

}

