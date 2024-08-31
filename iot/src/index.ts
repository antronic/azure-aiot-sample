require('dotenv').config()

import express, { Router } from 'express'
import db from './utils/db'
import { ObjectId } from 'mongodb'
import { Climate } from './components/Climate'

const app = express()
const port = 9000

// IoT API
const IoTRouter = Router()

IoTRouter.get('/get/climate/:_id', async (req, res) => {
  const params = req.params
  const _id = ObjectId.createFromHexString(params._id)

  const device = await db.collection('devices')
    .findOne({ _id })

  if (!device) {
    res.json({ message: 'Device not found' })
    return
  }

  const climate = new Climate({
    deviceId: device?.device_id,
    deviceName: device?.device_name,
    modelId: device?.model_id,
    location: device?.location,
    key: device?.key
  }, false)

  try {
    await climate.connect()
    const twin = await climate.getTwin()
    res.json({ device, twin: twin.properties })
  } catch (error) {
    res.json({ device, error })
  }
})

IoTRouter.get('/get/climate/dev-id/:id', async (req, res) => {
  const params = req.params
  const devId = params.id

  console.log('devId', devId)

  const device = await db.collection('devices')
    .findOne({ device_id: devId })

  if (!device) {
    res.json({ message: 'Device not found' })
    return
  }

  const climate = new Climate({
    deviceId: device?.device_id,
    deviceName: device?.device_name,
    modelId: device?.model_id,
    location: device?.location,
    key: device?.key
  }, false)

  try {
    await climate.connect()
    const twin = await climate.getTwin()
    res.json({ device, twin: twin.properties })
  } catch (error) {
    res.json({ device, error })
  }
})

// Web/DB API
const WebRouter = Router()

WebRouter.post('/create', async (req, res) => {
  const data = req.body

  const device = {
    device_id: data.device_id,
    device_name: data.device_name,
    location: data.location,
    model_id: data.model_id,
    energy_consumption: data.energy_consumption,
    key: data.key,
  }

  await db.collection('devices').insertOne(device)
  res.json({ message: 'Device created' })
})

WebRouter.get('/get', async (req, res) => {
  const devices = await db.collection('devices')
    .find({}).toArray()

  res.json({ devices })
})

app.use(express.json())
app.use('/iot', IoTRouter)
app.use('/api', WebRouter)

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})