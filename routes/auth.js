var express = require('express');
var router = express.Router();
const request = require('umi-request').default;

/* GET users listing. */

const routes = {
  LOGIN: {
    endpoint: 'http://10.81.1.61:3000/auth/login',
    payload: ({ organization, username, password }) => ({
      organization,
      username,
      password,
    })
  },
  CHANGE_PROJECT: {
    endpoint: 'http://10.81.1.61:3000/auth/change-project',
    payload: () => ({

    })
  },
  LOGOUT: {
    endpoint: 'http://10.81.1.61:3000/auth/logout'
  }
}

router.post('/login', async (req, res, next) => {

  let loginPayload = null;
  let result = null;
  try {
    loginPayload = routes.LOGIN.payload({ ...req.body })
    result = await request.post(routes.LOGIN.endpoint, { data: loginPayload, getResponse: true });
    res.status(result.response.status).json({ ...result.data })
  }
  catch (e) {
    next({
      status: e.response.status,
      message: e.data.body.message,
      errors: null
    })
  }

})


router.delete('/logout', async (req, res, next) => {
  let logoutResult = null
  try {

    logoutResult = await request.delete(routes.LOGOUT.endpoint, { getResponse: true, headers: { ...req.headers } })
    res.status(logoutResult.response.status).json({ ...logoutResult })
  }
  catch (e) {
    next({
      status: e.response.status,
      message: e.data.body.message,
      errors: null
    })
  }

})

router.post('/change-project', async (req, res, next) => {
  console.log("In change project")
  let changeProjectRequest = null;
  try {
    changeProjectRequest = await request.post(routes.CHANGE_PROJECT.endpoint, { getResponse: true, data: { ...req.body } })
    res.status(changeProjectRequest.response.status).json({ ...changeProjectRequest.data })
  }
  catch (ex) {
    next({
      status: e.response.status,
      message: e.data.body.message,
      errors: null
    })
  }

})


module.exports = router;
