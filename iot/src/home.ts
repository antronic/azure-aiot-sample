import { Climate } from './components/Climate'
import { DeviceOptions } from './utils/device'


async function main() {
  const livimgRoomClimateConfig: DeviceOptions = {
    deviceId: 'dev-01',
    deviceName: 'Living Room Climate',
    modelId: 'dtmi:aiot:group1:Climate;1',
    location: 'LIVING_ROOM',
    key: 'A94wpzYalhrKPWAwBvxutcj/xfCK3wLGhAIoTIrAaXI=',
    energyConsumption: 3000
  }
  const livingRoomClimate = new Climate(livimgRoomClimateConfig)

  await livingRoomClimate.connect()
  await livingRoomClimate.getTwin()
}

main()