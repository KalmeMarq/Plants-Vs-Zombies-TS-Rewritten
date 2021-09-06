export default class Options {
  public sound_master: number
  public sound_music: number
  public sound_plants: number
  public sound_zombies: number
  public sound_crazy_dave: number
  public fullscreen: boolean

  public constructor() {
    this.fullscreen = false
    this.sound_master = 1.0
    this.sound_music = 1.0
    this.sound_plants = 1.0
    this.sound_zombies = 1.0
    this.sound_crazy_dave = 1.0
    this.load()
  }

  public load(): void {
    const rawdata = localStorage.getItem('options')
    if(!rawdata) return

    const data = JSON.parse(rawdata)
    this.sound_master = data.sound_master
    this.sound_music = data.sound_music
    this.sound_plants = data.sound_plants
    this.sound_zombies = data.sound_zombies
    this.sound_crazy_dave = data.sound_crazy_dave
    this.fullscreen = data.fullscreen
  }

  public save(): void {
    const data = {
      sound_master: this.sound_master,
      sound_music: this.sound_music,
      sound_plants: this.sound_plants,
      sound_zombies: this.sound_zombies,
      sound_crazy_dave: this.sound_crazy_dave,
      fullscreen: this.fullscreen
    }

    localStorage.setItem('options', JSON.stringify(data))
  }
}