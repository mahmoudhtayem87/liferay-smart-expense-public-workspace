import {getServerUrl, oAuthRequest, request} from "../../utils/request";
import {config} from "../../utils/constants";


export const analyzeReceipt = (imageBase64) =>{

    let request_config =  {
        method: 'POST',
        url: `${getServerUrl()}${config.receiptAIEndPoint}`,
        data:{
            receipt:imageBase64
        }
    }

    return oAuthRequest(request_config);

}
