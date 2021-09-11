import { ReanimTransform } from '@/reanim/ReanimTransform'

export default class ReanimTrack {
  public name: string
  public transforms: ReanimTransform[]
  public numOfTransforms: number

  public constructor() {
    this.name = ''
    this.transforms = []
    this.numOfTransforms = 0
  }
}
