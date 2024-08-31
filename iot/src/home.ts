import { Climate } from './components/Climate'
import { DeviceOptions } from './utils/device'


async function main() {
  const livimgRoomClimateConfig: DeviceOptions = {
    deviceId: '<device-id>',
    deviceName: 'Living Room Climate',
    modelId: 'dtmi:aiot:group1:Climate;1',
    location: 'LIVING_ROOM',
    key: '<key>',
    energyConsumption: 3500
  }
  const livingRoomClimate = new Climate(livimgRoomClimateConfig)

  await livingRoomClimate.connect()
  await livingRoomClimate.getTwin()
}

main()