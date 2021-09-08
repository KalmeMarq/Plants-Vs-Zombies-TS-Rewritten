import { Texture, BaseTexture } from "@pixi/core";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "pixi.js";
import Core, { Font, FontText } from "../..";
import AlamanacCloseButton from "../components/AlmanacCloseButton";
import AlamanacIndexButton from "../components/AlmanacIndexButton";
import GUIScreen from "./GUIScreen";

class SeedPacket extends Sprite {
  public constructor(almanac: AlamanacPlantsScreens, core: Core, sprite: Sprite, cost: number) {
    super()

    this.texture = new Texture(BaseTexture.from('SeedsAtlas'), new Rectangle(100, 0, 50, 70))
    const p = this.addChild(sprite)
    p.scale.set(0.35, 0.35)
    p.anchor.set(0.5, 0)
    p.x = this.width / 2
    p.y = 10

    this.interactive = true
    this.buttonMode = true

    this.on('click', () => {
      almanac.selectedIcon.texture = sprite.texture
    })


    const t0 = this.addChild(new FontText(core.fontManager, Font.Pico129, cost.toString(), 0x000000))
    t0.setAnchor(1, 0)
    t0.setPos(this.width - 19, this.height - t0.height - 3)
  }
}

export default class AlamanacPlantsScreens extends GUIScreen {
  public selectedIcon: Sprite
  public constructor(core: Core) {
    super()

    this.addChild(Sprite.from('AlmanacPlantBg'))    
    // const title = this.addChild(new Text('Suburban Almanac - Plants', {
    //   fill: 0xD49E2A,
    //   fontSize: 28
    // }))
    // title.position.set(400, 26)
    // title.anchor.set(0.5, 0)

    const title = this.addChild(new FontText(core.fontManager, Font.HouseofTerror28, 'Suburban Almanac - Plants', 0xD49E2A))
    title.setAnchor(0.5, 0)
    title.setPos(400 + title.width * 0.2 / 2, 18)
    title.scale.set(0.8, 0.8)

    this.addChild(new AlamanacIndexButton(core, 45, 567))
    this.addChild(new AlamanacCloseButton(core, 697, 567))

    this.selectedIcon = Sprite.from('PeaShooter')

    const s = this.addChild(new SeedPacket(this, core, Sprite.from('PeaShooter'), 100))
    s.position.set(26, 92)

    const s1 = this.addChild(new SeedPacket(this,core,  Sprite.from('SnowPea'), 175))
    s1.position.set(26 + 52, 92)

    const s3 = this.addChild(new SeedPacket(this, core, Sprite.from('Sunflower'), 50))
    s3.position.set(26 + 52 + 52 + 52, 92)

    const s2 = this.addChild(new SeedPacket(this, core, Sprite.from('WallnutBody'), 50))
    s2.position.set(26 + 52 + 52, 92)

    const q = this.addChild(Sprite.from('AlmanacGroundDay'))
    q.position.set(523, 110)

    const p = this.addChild(Sprite.from('AlmanacPlantCard'))
    p.position.set(460, 88)

    const k = this.addChild(this.selectedIcon)
    k.position.set(574, 145)
    k.scale.set(0.75, 0.75)
  }
}