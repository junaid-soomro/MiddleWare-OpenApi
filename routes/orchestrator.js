var express = require('express');
var router = express.Router();
var request = require("umi-request").default;
const requestAndLog = require('../utils');
const orchBaseUrl = 'http://10.81.1.77:8002';

const ORCH = {
<<<<<<< HEAD
    endpoint: ({ className, method }) => (`http://10.81.1.62:8002/backend_service?method=${className}.${method}`)
=======
    endpoint: ({ className, method }) => (`${orchBaseUrl}/backend_service?method=${className}.${method}`)
>>>>>>> 5dae0e0afee692fefcf23113e4dfca9dece870ba
}
/* GET users listing. */
router.route('/:class/:method')
    .get(async (req, res, next) => {
        try {
            const { params, headers } = req;
            const url = ORCH.endpoint({ className: params.class, method: params.method });
            const resp = await requestAndLog(url, headers, params, {action: `${params.class}.${params.method}` });
            res.status(resp.response.status).json({ ...resp.data })
        }
        catch (e) {
<<<<<<< HEAD
            try {
                next({
                    status: e.response.status,
                    message: e.data.body.message,
                    errors: null
                })
            } catch (unknownException) {
                next({ ...e });
            }

=======
            next({
                status: e,
                message: e,
                errors: null
            })
>>>>>>> 5dae0e0afee692fefcf23113e4dfca9dece870ba
        }
    })
    .post(async (req, res, next) => {
        try {
            const { params, headers, body } = req;
            const url = ORCH.endpoint({ className: params.class, method: params.method });
            const resp = await requestAndLog(url, headers, params, body);
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
