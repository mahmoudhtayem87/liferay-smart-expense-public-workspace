import {request} from "../../utils/request";
import {config} from "../../utils/constants";
import {getCurrentSiteId} from "../../utils/util";


export const postReport = (data)=>{

    data["status"]={
        "code": 2,
        "label": "draft"
    }
    let request_config = {
        method: 'POST',
        url : `${config.reportEndPoint}scopes/${getCurrentSiteId()}`,
        data: data
    }
    return request(request_config);
}

export const patchReport = (reportId,data)=>{

    let request_config = {
        method: 'PATCH',
        url : `${config.reportEndPoint}/${reportId}`,
        data: data
    }
    return request(request_config);
}

export const postExpense = (data)=>{

    let request_config = {
        method: 'POST',
        url : `${config.expenseEndPoint}scopes/${getCurrentSiteId()}`,
        data: data
    }
    return request(request_config);
}

export const deleteExpense = (id)=>{

    let request_config = {
        method: 'DELETE',
        url : `${config.expenseEndPoint}${id}`
    }
    return request(request_config);
}

export const deleteReport = (id)=>{

    let request_config = {
        method: 'DELETE',
        url : `${config.reportEndPoint}${id}`
    }
    return request(request_config);
}

export const getReportById = (id)=>{

    let request_config = {
        method: 'GET',
        url : `${config.reportEndPoint}${id}`,
    }

    return request(request_config);

}

export const  getReportsPage = (page,pageSize) => {

    let request_config = {
        method: 'GET',
        url:`${config.reportEndPoint}scopes/${getCurrentSiteId()}?page=${page}&pageSize=${pageSize}`,
    };

    return request(request_config);

}


export const getReportExpensesPage = (reportId,page,pageSize) => {

    let request_config = {
        method: 'GET',
        url:`${config.reportEndPoint}${reportId}/expense?page=${page}&pageSize=${pageSize}`,
    };

    return request(request_config);

}
