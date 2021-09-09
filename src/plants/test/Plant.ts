import RechargeTime from '@/plants/test/RechargeTime'

export default class Plant {
  public id: string
  public cost: number
  public requiredLevel: number
  public levelType: 'day' | 'night' | 'day_pool' | 'night_pool' | 'roof'
  public type: 'plant' | 'plant_upgrade'
  public rechargeTime: RechargeTime
  public icon: string

  public constructor(id: string, cost: number, rechargeTime: RechargeTime, requiredLevel: number, levelType: 'day' | 'night' | 'day_pool' | 'night_pool' | 'roof', icon: string) {
    this.id = id
    this.cost = cost
    this.requiredLevel = requiredLevel
    this.levelType = levelType
    this.type = 'plant'
    this.rechargeTime = rechargeTime
    this.icon = icon
  }
}
