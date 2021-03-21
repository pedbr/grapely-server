import * as functions from 'firebase-functions'
import * as express from 'express'
import { signUpUser, loginUser } from './controllers/authController'
import {
  addWinery,
  getWineryById,
  getMyWineries,
  editWinery,
  deleteWinery,
} from './controllers/wineryController'
import {
  editUser,
  getUser,
  getUserWithWineries,
} from './controllers/userController'
import {
  getMyContainers,
  getWineryContainers,
  addContainer,
  editContainer,
  deleteContainer,
  getContainerById,
} from './controllers/containerController'
import {
  getMyBatches,
  getBatchById,
  getContainerBatches,
  addBatch,
  editBatch,
  deleteBatch,
} from './controllers/batchController'
import {
  addTask,
  editTask,
  deleteTask,
  getMyTasks,
  getWineryTasks,
  getContainerTasks,
  getBatchTasks,
} from './controllers/taskController'
import {
  getWineryNotes,
  getContainerNotes,
  getBatchNotes,
  getTaskNotes,
  addNote,
  editNote,
  deleteNote,
} from './controllers/noteController'
import { firebaseAuth } from './middleware/authMiddleware'

const app = express()

const cors = require('cors')

app.use(cors())

//--------------AUTH ROUTES-------------//
app.post('/signup', signUpUser)
app.post('/login', loginUser)

//--------------USER ROUTES-------------//
app.get('/user', firebaseAuth, getUser)
app.patch('/user/edit', firebaseAuth, editUser)
app.get('/user/wineries', firebaseAuth, getUserWithWineries)

//--------------WINERY ROUTES-------------//
app.get('/winery', firebaseAuth, getMyWineries)
app.get('/winery/:wineryId', firebaseAuth, getWineryById)
app.post('/winery/add', firebaseAuth, addWinery)
app.patch('/winery/edit/:wineryId', editWinery)
app.delete('/winery/delete/:wineryId', deleteWinery)

//--------------CONTAINER ROUTES-------------//
app.get('/container', firebaseAuth, getMyContainers)
app.get('/container/:containerId', firebaseAuth, getContainerById)
app.get('/container/winery/:currentWineryId', getWineryContainers)
app.post('/container/add', firebaseAuth, addContainer)
app.patch('/container/edit/:containerId', editContainer)
app.delete('/container/delete/:containerId', deleteContainer)

//--------------BATCH ROUTES-------------//
app.get('/batch', firebaseAuth, getMyBatches)
app.get('/batch/:batchId', firebaseAuth, getBatchById)
app.get('/batch/container/:currentContainerId', getContainerBatches)
app.post('/batch/add', firebaseAuth, addBatch)
app.patch('/batch/edit/:batchId', editBatch)
app.delete('/batch/delete/:batchId', deleteBatch)

//--------------TASK ROUTES-------------//
app.get('/task', firebaseAuth, getMyTasks)
app.get('/task/winery/:wineryId', getWineryTasks)
app.get('/task/container/:containerId', getContainerTasks)
app.get('/task/batch/:batchId', getBatchTasks)
app.post('/task/add', firebaseAuth, addTask)
app.patch('/task/edit/:taskId', editTask)
app.delete('/task/delete/:taskId', deleteTask)

//--------------NOTE ROUTES-------------//
app.get('/note/winery/:wineryId', getWineryNotes)
app.get('/note/container:containerId', getContainerNotes)
app.get('/note/batch/:batchId', getBatchNotes)
app.get('/note/task/:taskId', getTaskNotes)
app.post('/note/add', firebaseAuth, addNote)
app.patch('/note/edit/:noteId', editNote)
app.delete('/note/delete/:noteId', deleteNote)

exports.api = functions.region('europe-west1').https.onRequest(app)
