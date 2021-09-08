import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import Core, { Font, FontText } from "../..";
import AlamanacCloseButton from "../components/AlmanacCloseButton";
import SeedChooserButton from "../components/SeedChooserButton";
import AlamanacPlantsScreens from "./AlmanacPlantsScreen";
import GUIScreen from "./GUIScreen";
import MainMenuScreen from "./MainMenuScreen";

export default class AlmanacScreen extends GUIScreen {
  public constructor(core: Core) {
    super()

    this.addChild(Sprite.from('AlmanacIndexBack'))

    // const title = this.addChild(new Text('Suburban Almanac - Index', {
    //   fill: 0xDBDBDB,
    //   fontSize: 30
    // }))
    // title.position.set(400, 30)
    // title.anchor.set(0.5, 0)

    const title = this.addChild(new FontText(core.fontManager, Font.HouseofTerror28, 'Suburban Almanac - Index', 0xDBDBDB))
    title.setAnchor(0.5, 0)
    title.setPos(400, 20)

    // const l = this.addChild(new Graphics().beginFill(0x000000).drawRect(0, 0, 80, 80).endFill())

    this.addChild(new SeedChooserButton(core, 134, 352, 'View Plants', () => {
      core.setScreen(new AlamanacPlantsScreens(core))
    }))

    this.addChild(new AlamanacCloseButton(core, 697, 567))

    // const clb = this.addChild(Sprite.from('AlmanacCloseBtn'))
    // clb.position.set(700, 560)
    // clb.interactive = true

    // clb.on('click', () => {
    //   core.setScreen(new MainMenuScreen(core))
    // })

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