export default class SoundEvent {
  private readonly location: string

  public constructor(location: string) {
    this.location = location
  }

  public getLocation(): string {
    return this.location
  }
}