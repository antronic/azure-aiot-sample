import { Climate } from './components/Climate'
import { DeviceOptions } from './utils/device'


async function main() {
  const livimgRoomClimateConfig: DeviceOptions = {
    deviceId: 'dev-02',
    deviceName: 'Living Room Climate',
    modelId: 'dtmi:aiot:group1:Climate;1',
    location: 'LIVING_ROOM',
    key: 'yJ2G9PBRnyfTvWJCZtqIziv/KRP34oCpuAIoTFdeFps=',
    energyConsumption: 3500
  }
  const livingRoomClimate = new Climate(livimgRoomClimateConfig)

  await livingRoomClimate.connect()
  await livingRoomClimate.getTwin()
}

main()