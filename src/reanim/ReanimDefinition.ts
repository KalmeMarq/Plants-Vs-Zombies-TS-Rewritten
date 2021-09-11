import ReanimTrack from '@/reanim/ReanimTrack'

export default class ReanimDefinition {
  public fps: number
  public tracks: ReanimTrack[]
  public trackNameMap: { [key: string]: ReanimTrack }
  public numOfTracks: number

  public constructor() {
    this.fps = 0
    this.tracks = []
    this.trackNameMap = {}
    this.numOfTracks = 0
  }
}
