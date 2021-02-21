import * as functions from 'firebase-functions'
import * as express from 'express'
import {
  addWinery,
  getAllWineries,
  editWinery,
  deleteWinery,
} from './controllers/wineryController'
import { signUpUser, loginUser } from './controllers/userController'
import { firebaseAuth } from './middleware/authMiddleware'

const app = express()

//--------------AUTH ROUTES-------------//
app.post('/signup', signUpUser)
app.post('/login', loginUser)

//--------------WINERY ROUTES-------------//
app.get('/wineries', firebaseAuth, getAllWineries)
app.post('/winery', firebaseAuth, addWinery)
app.patch('/winery/:wineryId', editWinery)
app.delete('/winery/:wineryId', deleteWinery)

exports.api = functions.region('europe-west1').https.onRequest(app)
