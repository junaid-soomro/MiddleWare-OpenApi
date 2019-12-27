var express = require('express');
var router = express.Router();
var request = require("umi-request").default;
const requestAndLog = require('../utils');

const ORCH = {
    endpoint: ({ className, method }) => (`http://10.81.1.61:8002/backend_service?method=${className}.${method}`)
}
/* GET users listing. */
router.route('/:class/:method')
    .get(async (req, res, next) => {

        let orchResponse = null;
        try {
            const url = ORCH.endpoint({ className: req.params.class, method: req.params.method });
            orchResponse = await request.post(url, { headers: { ...req.headers }, getResponse: true });
            res.status(orchResponse.response.status).json({ ...orchResponse.data })
        }
        catch (e) {
            next({
                status: e,
                message: e,
                errors: null
            })
        }
    })
    .post(async (req, res, next) => {

        let orchResponse = null;
        try {
            const { params, headers, body } = req;
            const url = ORCH.endpoint({ className: params.class, method: params.method });
            const method = "post";
            console.log('body: ', body);
            const resp = await requestAndLog(url, method, headers, params, body);
            console.log('resp: ', resp);
            //orchResponse = await request.post(ORCH.endpoint({ className: req.params.class, method: req.params.method }), { headers: { ...req.headers }, data: { ...req.body }, getResponse: true })
            res.status(resp.response.status).json({ ...resp.data })
        }
        catch (e) {
            next({
                status: e.response.status,
                message: e.data.body.message,
                errors: null
            })
        }
    })

module.exports = router;
