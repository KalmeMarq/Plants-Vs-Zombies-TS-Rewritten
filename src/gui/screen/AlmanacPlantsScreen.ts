import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AlamanacCloseButton from '@/gui/components/AlmanacCloseButton'
import AlamanacIndexButton from '@/gui/components/AlmanacIndexButton'
import GUIScreen from '@/gui/screen/GUIScreen'
import Plant from '@/plants/test/Plant'
import Plants from '@/plants/test/Plants'
import Sounds from '@/sound/Sounds'
import { BaseTexture, Texture } from '@pixi/core'
import { Graphics } from '@pixi/graphics'
import { Rectangle } from '@pixi/math'
import { Sprite } from '@pixi/sprite'

class SeedPacket extends Sprite {
  public constructor(almanac: AlamanacPlantsScreens, core: Core, plant: Plant) {
    super()

    this.texture = new Texture(BaseTexture.from('SeedsAtlas'), new Rectangle(100, 0, 50, 70))
    const icon = Sprite.from(plant.icon)
    const p = this.addChild(icon)
    p.scale.set(0.35, 0.35)
    p.anchor.set(0.5, 0)
    p.x = this.width / 2
    p.y = 10

    this.interactive = true
    this.buttonMode = true

    const g = new Graphics()
    g.beginFill(0xffffff, 0.3)
    g.drawRect(0, 0, this.width, this.height)
    g.endFill()

    this.on('click', () => {
      if (almanac.selectedPlant !== plant) almanac.core.soundManager.playSound(Sounds.TAP)
      almanac.emit('selected', icon.texture, Plants.getById(plant.id))
    })

    this.on('pointerover', () => {
      this.addChild(g)
    })

    this.on('pointerout', () => {
      this.removeChild(g)
    })

    const t0 = this.addChild(new FontText(core.fontManager, Font.Pico129, plant.cost.toString(), 0x000000))
    t0.setAnchor(1, 0)
    t0.setPos(this.width - 19, this.height - t0.height - 3)
  }
}

export default class AlamanacPlantsScreens extends GUIScreen {
  public core: Core
  public selectedIcon: Sprite
  public selectedPlant: Plant
  public constructor(core: Core) {
    super()

    this.core = core

    const plantsList = Plants.getList().filter(p => p.requiredLevel <= (core.currentUser?.currentLevel ?? 0)).filter(p => p.id !== 'cherry_bomb' && p.id !== 'potato_mine')

    this.addChild(Sprite.from('AlmanacPlantBg'))

    const title = this.addChild(new FontText(core.fontManager, Font.HouseofTerror28, 'Suburban Almanac - Plants', 0xD49E2A))
    title.setAnchor(0.5, 0)
    title.setPos(400 + title.width * 0.25 / 2, 18)
    title.scale.set(0.75, 0.75)

    this.addChild(new AlamanacIndexButton(core, 34, 567))
    this.addChild(new AlamanacCloseButton(core, 697, 567))

    this.selectedIcon = Sprite.from('PeaShooter')
    this.selectedPlant = Plants.PEASHOOTER

    function getAlmanacGround(levelType: 'day' | 'night' | 'day_pool' | 'night_pool' | 'roof') {
      switch (levelType) {
        case 'roof':
          return 'AlmanacGroundRoof'
        case 'day_pool':
          return 'AlmanacGroundDayPool'
        case 'night_pool':
          return 'AlmanacGroundNightPool'
        case 'night':
          return 'AlmanacGroundNight'
        case 'day':
        default:
          return 'AlmanacGroundDay'
      }
    }

    const q = this.addChild(Sprite.from(getAlmanacGround(this.selectedPlant.levelType)))
    q.position.set(523, 109)

    const p = this.addChild(Sprite.from('AlmanacPlantCard'))
    p.position.set(460, 88)

    for (let i = 0; i < plantsList.length; i++) {
      const sp = this.addChild(new SeedPacket(this, core, plantsList[i]))
      sp.position.set(26 + (52 * i), 92)
    }

    const j = this.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft18Yellow, 'Peashooter'))
    j.setAnchor(0.5, 0)
    j.setPos(618, 270)

    const k = this.addChild(this.selectedIcon)
    k.position.set(574, 145)
    k.scale.set(0.75, 0.75)

    const cost = this.addChild(new FontText(core.fontManager, Font.BrianneTod12, 'Cost: ', 0x8E421A))
    cost.setPos(485, 522)
    const costValue = this.addChild(new FontText(core.fontManager, Font.BrianneTod12, this.selectedPlant.cost.toString(), 0xCB231C))
    costValue.setPos(485 + cost.width + 4, 522)

    const rechargeValue = this.addChild(new FontText(core.fontManager, Font.BrianneTod12, this.selectedPlant.rechargeTime.name, 0xCB231C))
    rechargeValue.setAnchor(1, 0)
    rechargeValue.setPos(741, 522)

    const recharge = this.addChild(new FontText(core.fontManager, Font.BrianneTod12, 'Recharge: ', 0x8E421A))
    recharge.setAnchor(1, 0)
    recharge.setPos(741 - 4 - rechargeValue.width, 522)

    this.on('selected', (icon, plant: Plant) => {
      this.selectedIcon.texture = icon
      this.selectedPlant = plant

      costValue.setText(plant.cost.toString())
      rechargeValue.setText(this.selectedPlant.rechargeTime.name)
      recharge.setPos(741 - 4 - rechargeValue.width, 522)
      q.texture = Texture.from(getAlmanacGround(this.selectedPlant.levelType))

      j.setText(core.pvzTexts.lawnStrings[plant.id.toUpperCase()][0])
    })
  }
}
