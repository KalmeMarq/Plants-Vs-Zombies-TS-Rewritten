import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AlamanacCloseButton from '@/gui/components/AlmanacCloseButton'
import FitWidthButton from '@/gui/components/FitWidthButton'
import SeedChooserButton from '@/gui/components/SeedChooserButton'
import AlamanacPlantsScreens from '@/gui/screen/AlmanacPlantsScreen'
import AlamanacZombiesScreens from '@/gui/screen/AlmanacZombiesScreen'
import GUIScreen from '@/gui/screen/GUIScreen'
import { Graphics } from '@pixi/graphics'
import { Sprite } from '@pixi/sprite'

export default class AlmanacScreen extends GUIScreen {
  public constructor(core: Core, onClose: () => void) {
    super()

    this.addChild(Sprite.from('AlmanacIndexBack'))

    const title = this.addChild(new FontText(core.fontManager, Font.HouseofTerror28, 'Suburban Almanac - Index', 0xDBDBDB))
    title.setAnchor(0.5, 0)
    title.setPos(400, 20)

    this.addChild(new SeedChooserButton(core, 134, 342, 'View Plants', () => {
      core.setScreen(new AlamanacPlantsScreens(core))
    }))

    this.addChild(new FitWidthButton(486, 342, 210, 'View Zombies', () => {
      core.setScreen(new AlamanacZombiesScreens(core))
    }))

    this.addChild(new AlamanacCloseButton(core, 697, 567, onClose))

    const sf = this.addChild(Sprite.from('Sunflower'))
    sf.position.set(169, 249)
    sf.scale.set(0.7, 0.7)

    const zG = this.addChild(new Graphics())
    zG.position.set(559, 249)
    zG.beginFill(0x00ffff)
    zG.drawRect(0, 0, 64, 79)
    zG.endFill()
  }
}
