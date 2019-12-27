var express = require('express');
var router = express.Router();
const request = require('umi-request').default;

/* GET users listing. */

const routes = {
  LOGIN: {
    endpoint: 'http://10.81.1.77:3000/auth/login',
    payload: ({ organization, username, password }) => ({
      organization,
      username,
      password,
    })
  },
  CHANGE_PROJECT: {
    endpoint: 'http://10.81.1.77:3000/auth/change-project',
    payload: () => ({

    })
  },
  LOGOUT: {
    endpoint: 'http://10.81.1.77:3000/auth/logout'
  }
}

router.post('/login', async (req, res, next) => {

  let loginPayload = null;
  let result = null;
  console.log('req:', req)
  try {
    loginPayload = routes.LOGIN.payload({ ...req.body })
    result = await request.post(routes.LOGIN.endpoint, { data: loginPayload, getResponse: true });
    console.log('result: ', result)
    res.status(result.response.status).json({ ...result.data })
  }
  catch (e) {
    console.log('e::', e)
    next({
      status: e,
      message: e,
      errors: null
    })
  }

})


router.delete('/logout', async (req, res, next) => {
  let logoutResult = null
  try {

    logoutResult = await request.delete(routes.LOGOUT.endpoint, { getResponse: true, headers: { ...req.headers } })
    res.status(logoutResult.response.status).json({ ...logoutResult.data })
  }
  catch (e) {

    next({
      status: e.response.status,
      message: e.data.data.error.message,
      errors: null
    })
  }

})

router.post('/change-project', async (req, res, next) => {
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
