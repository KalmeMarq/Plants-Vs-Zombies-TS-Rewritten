import { Sprite } from "@pixi/sprite";
import Core from "../..";
import SeedChooserButton from "../components/SeedChooserButton";
import GUIScreen from "./GUIScreen";
import MainMenuScreen from "./MainMenuScreen";

export default class HelpScreen extends GUIScreen {
  public constructor(core: Core) {
    super()

    const bg = this.addChild(Sprite.from('Background1'))
    bg.scale.set(2, 2)
    bg.position.set(-600, -140)

    const z = this.addChild(Sprite.from('ZombieNote'))
    const zm = z.addChild(Sprite.from('ZombieNoteMask'))
    z.mask = zm

    const zhm = z.addChild(Sprite.from('ZombieNoteHelpMask'))
    const zh = zhm.addChild(Sprite.from('ZombieNoteHelp'))
    zhm.mask = zh

    zhm.position.set(45, 45)

    z.position.set(400 - z.width / 2)
    this.addChild(new SeedChooserButton(core, 320, 492, 'Main Menu', () => {
      core.setScreen(new MainMenuScreen(core))
    }))
  }
}