import BinaryReader from '@/data/binary/BinaryReader'
import BinaryWriter from '@/data/binary/BinaryWriter'

export default class User {
  public name: string
  public agreedZombatarTOS: boolean
  public money: number
  public currentLevel: number
  public achievements = {
    sunny_day: 0,
    mustache_mode: 0
  }

  public constructor() {
    this.name = 'KalmeMarq'
    this.agreedZombatarTOS = false
    this.money = 0
    this.currentLevel = 15
  }

  public loadUser(reader: BinaryReader): void {
    reader.readInt32()

    this.money = reader.readInt32()
    this.achievements.sunny_day = reader.readByte()
    this.achievements.mustache_mode = reader.readByte()
  }

  public saveUser(): void {
    const writer = new BinaryWriter()
    writer.writeUint32(14)
    writer.writeInt32(this.money)
    Object.values(this.achievements).forEach(v => {
      writer.writeByte(v)
    })
  }
}
