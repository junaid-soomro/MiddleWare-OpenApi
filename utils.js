var request = require("umi-request").default;
const logUrl = 'http://10.81.1.77:3800/add-logs';
const IAM_BASE_URL = 'http://10.81.1.77:4000';
const requestAndLog = async (url, headers, params, data) => {
    const action = `${params.class}.${params.method}`
    const response = await request.post(url, { headers, getResponse: true, data });
    const authToken = headers['x-auth-token'];
    const logData = {
        action,
        requestPayload: data,
    }
    // IAM call
    const iamResponse = await request.get(`${IAM_BASE_URL}/auth/verify-token`, {headers: {authToken} });
    const { project } = iamResponse;
    Object.assign(logData, {
        responsePayload: response,
        projectId: project.id,
        parentProjectId: project.domain ? project.domain.id : null
    })
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
module.exports = requestAndLog;