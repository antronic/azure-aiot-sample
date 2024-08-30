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

    })

    return twin
  }

  listenForDeviceMethods(): void {
      this.onDeviceMethod('SET_TEMPERATURE', (request, response) => {
        const temperature = request.payload.temperature
        this.setTemperature(temperature)
        response.send(200, 'Temperature set')
      })

      this.onDeviceMethod('SET_MODE', (request, response) => {
        const mode = request.payload.mode
        this.setMode(mode)
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