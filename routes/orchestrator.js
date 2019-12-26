var express = require('express');
var router = express.Router();
var request = require("umi-request").default;

const ORCH = {
    endpoint: ({ className, method }) => (`http://10.81.1.61:8002/backend_service?method=${className}.${method}`)
}
/* GET users listing. */
router.route('/:class/:method')
    .get(async (req, res, next) => {
        console.log("In orch get")

        let orchResponse = null;
        try {
            console.log(req.params)
            orchResponse = await request.get(ORCH.endpoint({ className: req.params.class, method: req.params.method }), { headers: { ...req.headers }, getResponse: true })
            res.status(orchResponse.response.status).json({ ...orchResponse.data })
        }
        catch (e) {

        }
    })
    .post((req, res, next) => {
        res.json({ status: 'ok' })
    })

module.exports = router;
