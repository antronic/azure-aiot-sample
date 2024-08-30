require('dotenv').config()

import { Mqtt as Protocol } from 'azure-iot-device-mqtt'
import { Client, Twin } from 'azure-iot-device'

export type LOCATION = 'LIVING_ROOM' | 'KITCHEN' | 'BEDROOM'

const IOT_HUB_HOST = process.env.IOTHUB_DEVICE_HOSTNAME || ''
const IOT_HUB_SAS_KEY = process.env.IOTHUB_DEVICE_SAS_KEY || ''

export type DeviceOptions = {
  deviceId: string
  deviceName: string
  modelId: string
  location: LOCATION | null
  energyConsumption?: number
  key: string
}
export abstract class Device {
  _id?: string
  deviceId: string
  deviceName: string
  location: LOCATION | null
  client: Client | null = null
  modelId: string | ''
  eneryConsumption: number = 0
  eneryUsed: number = 0
  updateInterval: number = 5000
  isConsumingEnergy: boolean = false
  isSimulated: boolean = true

  constructor(options: DeviceOptions, simulated: boolean = true) {
    this.deviceId = options.deviceId
    this.deviceName = options.deviceName
    this.modelId = options.modelId
    this.location = options.location
    this.eneryConsumption = options.energyConsumption || 0
    this.isSimulated = simulated
  }

  private getConnectionString() {
    return `HostName=${IOT_HUB_HOST};DeviceId=${this.deviceId};SharedAccessKey=${IOT_HUB_SAS_KEY}`
  }

  private createClient(): Client {
    const connectionString = this.getConnectionString()
    const client = Client.fromConnectionString(connectionString, Protocol)

    return client
  }

  async connect() {
    const client = this.createClient()
    this.client = client

    await this.client?.setOptions({ 'modelId': this.modelId })

    await client.open()
    this.syncTwinState()
    this.listenForDeviceMethods()
    this.update()

    return this.client
  }

  async getTwin(): Promise<Twin> {
    if (this.client) {
      return this.client.getTwin()
    }

    throw new Error('Client is not connected')
  }

  async syncTwinState(): Promise<Twin> {
    const twin = await this.getTwin()

    const patch = {
      deviceName: this.deviceName,
      location: this.location,
      updateInterval: this.updateInterval,
    }
    twin.properties.reported.update(patch, function (err: Error): void {
      if (err) throw err;
      console.log('twin state reported');
    })

    return twin
  }

  abstract listenForDeviceMethods(): void

  onDeviceMethod(methodName: string, callback: (request: any, response: any) => void) {
    this.client?.onDeviceMethod(methodName, callback)
  }

  update() {
    if (this.isSimulated) {
      this.countEnergyConsumption()
      this.updateToTwin()
    }
  }

  countEnergyConsumption() {
    // calculate energy consumption
    setInterval(() => {
      if (this.isConsumingEnergy) {
        this.eneryUsed += (this.eneryConsumption / 3600)
      }
    }, 1000)
  }

  updateToTwin() {
    const updateTwin = () => {
      this.getTwin()
        .then((twin) => {
          console.log('this.eneryUsed', this.eneryUsed)
          twin.properties.reported.update({
            eneryUsed: this.eneryUsed
          }, (err: any) => {
            if (err) throw err
          })
        })
    }

    updateTwin()
    setInterval(updateTwin, this.updateInterval)
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()

      this.client = null
    }

    throw new Error('Client is not connected')
  }
}