var request = require("umi-request").default;
const logUrl = 'http://10.81.1.77:3800/add-logs';
const IAM_BASE_URL = 'http://10.81.1.77:3000';
const requestAndLog = async (url, method, headers, params, data) => {
    console.log('data: ', data);
    console.log("headers: ", headers)
    if (method === 'post') {
        // const dataForLog = data || params;
        const action = `${params.class} ${params.method}`
        const response = await request.post(url, { headers, getResponse: true, data });
        const authToken = headers['x-auth-token'];
        // const authReq = await request.get()
        const logData = {
            action,
            requestPayload: data,
        }
        // IAM call
        const iamResponse = await request.get(`${IAM_BASE_URL}/auth/verify-token`, {headers: authToken });
        console.log('iamResponse: ', iamResponse);
        console.log(logData);
        try {
            request.post(logUrl, {
                data: logData
            })
        }
        catch(e) {
            console.log(e);
        }
       

        return response;
    }
}
module.exports = requestAndLog;