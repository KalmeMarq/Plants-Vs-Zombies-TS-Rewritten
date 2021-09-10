import BinaryReader from '@/data/binary/BinaryReader'
import BinaryWriter from '@/data/binary/BinaryWriter'

export default class User {
  public id: number
  public name: string
  public agreedZombatarTOS: boolean
  public money: number
  public currentLevel: number
  public achievements = {
    sunny_day: 0,
    mustache_mode: 0
  }

  public constructor(id: number, name: string) {
    this.id = id
    this.name = name
    this.agreedZombatarTOS = false
    this.money = 0
    this.currentLevel = 15
  }

  public load(): void {
    const li = localStorage.getItem('user' + this.id)

    if (li) {
      const data = JSON.parse(li)

      this.agreedZombatarTOS = data.agreedZombatarTOS
      this.money = data.money
      this.currentLevel = data.currentLevel
      this.achievements = data.achievements
    }
  }

  public save(): void {
    localStorage.setItem('user' + this.id, JSON.stringify({
      id: this.id,
      name: this.name,
      agreedZombatarTOS: this.agreedZombatarTOS,
      money: this.money,
      currentLevel: this.currentLevel,
      achievements: this.achievements
    }))
  }

  public remove(): void {
    localStorage.removeItem('user' + this.id)
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
