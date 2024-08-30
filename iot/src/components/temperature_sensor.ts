class TemperatureController {
    temperature: number
    constructor() {
        this.temperature = 0
    }
    getTemperature() {
        return this.temperature
    }
    setTemperature(temperature: number) {
        this.temperature = temperature
    }
}