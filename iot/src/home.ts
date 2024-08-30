import { Climate } from './components/Climate'
import { DeviceOptions } from './utils/device'


async function main() {
  const livimgRoomClimateConfig: DeviceOptions = {
    deviceId: 'dev-h-02',
    deviceName: 'Living Room Climate',
    modelId: 'dtmi:aiot:group1:Climate;1',
    location: 'LIVING_ROOM',
    key: '46AFa0tODQfBrPmxE8K8GZ9F2WNKY8NsxAIoTAVg0+g=',
    energyConsumption: 3500
  }
  const livingRoomClimate = new Climate(livimgRoomClimateConfig)

  await livingRoomClimate.connect()
  await livingRoomClimate.getTwin()
}

main()