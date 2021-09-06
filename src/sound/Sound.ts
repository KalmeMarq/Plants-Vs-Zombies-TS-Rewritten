export default class Sound {
  public location: string
  public volume: number
  public pitch: number

  public constructor(location: string, volume: number, pitch: number) {
    this.location = location
    this.volume = volume
    this.pitch = pitch
  }
}