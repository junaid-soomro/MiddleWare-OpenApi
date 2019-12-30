var express = require('express');
var router = express.Router();
var request = require("umi-request").default;

const ORCH = {
    endpoint: ({ className, method }) => (`http://10.81.1.62:8002/backend_service?method=${className}.${method}`)
}
/* GET users listing. */
router.route('/:class/:method')
    .get(async (req, res, next) => {

        let orchResponse = null;
        try {
            orchResponse = await request.post(ORCH.endpoint({ className: req.params.class, method: req.params.method }), { headers: { ...req.headers }, getResponse: true })
            res.status(orchResponse.response.status).json({ ...orchResponse.data })
        }
        catch (e) {
            try {
                next({
                    status: e.response.status,
                    message: e.data.body.message,
                    errors: null
                })
            } catch (unknownException) {
                next({ ...e });
            }

        }
    })
    .post(async (req, res, next) => {

        let orchResponse = null;
        try {
            orchResponse = await request.post(ORCH.endpoint({ className: req.params.class, method: req.params.method }), { headers: { ...req.headers }, data: { ...req.body }, getResponse: true })
            res.status(orchResponse.response.status).json({ ...orchResponse.data })
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
