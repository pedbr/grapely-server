import * as functions from 'firebase-functions'
import * as express from 'express'
import {
  addWinery,
  getAllWineries,
  editWinery,
  deleteWinery,
} from './controllers/wineryController'
import { getUser, getUserWithWineries } from './controllers/userController'
import { signUpUser, loginUser } from './controllers/authController'
import { firebaseAuth } from './middleware/authMiddleware'

const app = express()

//--------------AUTH ROUTES-------------//
app.post('/signup', signUpUser)
app.post('/login', loginUser)

//--------------USER ROUTES-------------//
app.get('/user', firebaseAuth, getUser)
app.get('/userWithWineries', firebaseAuth, getUserWithWineries)

//--------------WINERY ROUTES-------------//
app.get('/wineries', firebaseAuth, getAllWineries)
app.post('/winery', firebaseAuth, addWinery)
app.patch('/winery/:wineryId', editWinery)
app.delete('/winery/:wineryId', deleteWinery)

exports.api = functions.region('europe-west1').https.onRequest(app)
