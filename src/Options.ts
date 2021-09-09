export default class Options {
  public soundMaster: number
  public soundMusic: number
  public soundPlants: number
  public soundZombies: number
  public soundCrazyDave: number
  public fullscreen: boolean

  public constructor() {
    this.fullscreen = false
    this.soundMaster = 1.0
    this.soundMusic = 1.0
    this.soundPlants = 1.0
    this.soundZombies = 1.0
    this.soundCrazyDave = 1.0
    this.load()
  }

  public load(): void {
    const rawdata = localStorage.getItem('options')
    if (!rawdata) return

    const data = JSON.parse(rawdata)
    this.soundMaster = data.sound_master
    this.soundMusic = data.sound_music
    this.soundPlants = data.sound_plants
    this.soundZombies = data.sound_zombies
    this.soundCrazyDave = data.sound_crazy_dave
    this.fullscreen = data.fullscreen
  }

  public save(): void {
    const data = {
      sound_master: this.soundMaster,
      sound_music: this.soundMusic,
      sound_plants: this.soundPlants,
      sound_zombies: this.soundZombies,
      sound_crazy_dave: this.soundCrazyDave,
      fullscreen: this.fullscreen
    }

    localStorage.setItem('options', JSON.stringify(data))
  }
}
