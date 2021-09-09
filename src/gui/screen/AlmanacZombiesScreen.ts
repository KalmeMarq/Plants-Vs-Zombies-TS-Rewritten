import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AlamanacCloseButton from '@/gui/components/AlmanacCloseButton'
import AlamanacIndexButton from '@/gui/components/AlmanacIndexButton'
import GUIScreen from '@/gui/screen/GUIScreen'
import { Sprite } from 'pixi.js'

export default class AlamanacZombiesScreens extends GUIScreen {
  public constructor(core: Core) {
    super()

    this.addChild(Sprite.from('AlmanacZombieBg'))

    const title = this.addChild(new FontText(core.fontManager, Font.HouseofTerror28, 'Suburban Almanac - Zombies', 0xD49E2A))
    title.setAnchor(0.5, 0)
    title.setPos(400 + title.width * 0.25 / 2, 18)
    title.scale.set(0.75, 0.75)

    this.addChild(new AlamanacIndexButton(core, 34, 567))
    this.addChild(new AlamanacCloseButton(core, 697, 567))
  }
}
