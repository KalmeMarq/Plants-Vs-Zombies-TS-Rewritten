import ReanimDefinition from '@/reanim/ReanimDefinition'
import ReanimTrack from '@/reanim/ReanimTrack'
import { ReanimTransform } from '@/reanim/ReanimTransform'
import { parse as parseYAML } from 'yaml'

export default class Reanimator {
  public reanimDefs: Map<string, ReanimDefinition>

  public constructor() {
    this.reanimDefs = new Map()
  }

  public async load(): Promise<void> {
    const reanims = ['Pumpkin', 'Sun', 'Wallnut']

    for (let i = 0; i < reanims.length; i++) {
      const data = parseYAML(await (await fetch('./static/data/reanim/' + reanims[i] + '.yaml')).text())

      const def = new ReanimDefinition()
      def.fps = data.fps

      const len = data.tracks.length

      for (let j = 0; j < len; j++) {
        const track = data.tracks[j]

        const reaTrack = new ReanimTrack()
        reaTrack.name = track.name
        let lastTrans: null | ReanimTransform = null
        const lenT = track.ticks.length

        for (let k = 0; k < lenT; k++) {
          const tick = track.ticks[k]

          const reatrans = new ReanimTransform()

          if (tick.x) reatrans.tX = tick.x
          if (tick.y) reatrans.tY = tick.y
          if (tick.sx) reatrans.sX = tick.sx
          if (tick.sy) reatrans.sY = tick.sy
          if (tick.kx) reatrans.kX = -2 * tick.kx * Math.PI / 360
          if (tick.ky) reatrans.kY = -2 * tick.ky * Math.PI / 360

          reatrans.fillInFrom(lastTrans)

          reaTrack.transforms.push(reatrans)
          ++reaTrack.numOfTransforms
          lastTrans = reatrans
        }

        def.tracks.push(reaTrack)
        def.trackNameMap[track.name] = reaTrack
        ++def.numOfTracks
      }

      this.reanimDefs.set(reanims[i], def)
    }

    console.log(this.reanimDefs)
  }
}
