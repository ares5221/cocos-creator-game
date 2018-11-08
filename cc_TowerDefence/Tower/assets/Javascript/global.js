/**
 * Created by chu on 2016/12/6 0006.
 */
import PlayerData from './PlayerData'
import SDKManager from './SDKManager'
import EventController from './EventController'
let global = {
    playerData: PlayerData(),
    SDKManager: SDKManager(),
    EventController: EventController({})
}
export default global;