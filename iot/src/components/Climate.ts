import { Device, DeviceOptions } from '../utils/device'

export class Climate extends Device {
  currentTemperature: number
  mode: 'COOL' | 'FAN' | 'OFF'
  isSwing: boolean

  constructor(options: DeviceOptions, simulated: boolean = true) {
    super(options, simulated)
    this.currentTemperature = 25
    this.mode = 'OFF'
    this.isSwing = false
  }

  async syncTwinState() {
    const twin = await super.syncTwinState()

    twin.properties.reported.update({
      currentTemperature: this.currentTemperature,
      mode: this.mode,
      isSwing: this.isSwing
    }, (err: any) => {
      if (err) throw err
    })

    twin.on('properties.desired', (desiredChange) => {
      console.log('Received desired properties')
      console.log(desiredChange)
    })

    return twin
  }

  async listenForDeviceMethods(): Promise<void> {
    const twin = await this.getTwin()

    // Listen for device methods
    // SET_TEMPERATURE Method
    this.onDeviceMethod('SET_TEMPERATURE', (request, response) => {
      console.log('Device method called', 'SET_TEMPERATURE', request.payload)

      const temperature = request.payload.temperature
      // Update temperature in the device
      this.setTemperature(temperature)

      // Update temperate in the twin
      twin.properties.reported.update({
        currentTemperature: this.currentTemperature
      }, (err: any) => {
        if (err) throw err
      })
      response.send(200, 'Temperature set')
    })

    // SET_MODE Method
    this.onDeviceMethod('SET_MODE', (request, response) => {
      console.log('Device method called', 'SET_MODE', request.payload)

      const mode = request.payload.mode
      // Update mode in the device
      this.setMode(mode)

      // Update mode in the twin
      twin.properties.reported.update({
        mode: this.mode
      }, (err: any) => {
        if (err) throw err
      })
      response.send(200, 'Mode set')
    })
  }

  getTemperature() {
    return this.currentTemperature
  }

  private setTemperature(temperature: number) {
    this.currentTemperature = temperature
  }

  getMode() {
    return this.mode
  }

  private setMode(mode: 'COOL' | 'FAN' | 'OFF') {
    this.mode = mode
    if (mode === 'OFF') {
      this.isConsumingEnergy = false
    } else {
      this.isConsumingEnergy = true
    }
  }

  getSwing() {
    return this.isSwing
  }

  private setSwing(isSwing: boolean) {
    this.isSwing = isSwing
  }
}