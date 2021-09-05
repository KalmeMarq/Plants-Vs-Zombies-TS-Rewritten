import { Container } from "@pixi/display";
import { Text } from 'pixi.js'
import Core from ".";

export default class DebugOverlay extends Container {
  private core: Core
  public fpsT
  public sunsCT
  public projsT
  public plantsT
  public zombiesT
  public entitiesT
  
  public constructor(core: Core) {
    super()
    this.core = core

    this.addDebugText(`PVZTS Rewritten ${process.env.NODE_ENV === 'development' ? '(v0.1/dev)' : 'v0.1'}`)
    this.addDebugText('Level: null LevelID: -1')
    this.fpsT = this.addDebugText('FPS: ')
    this.sunsCT = this.addDebugText(`SunCount: ${0}`)
    this.projsT = this.addDebugText('Projectiles: 0')
    this.plantsT = this.addDebugText('Plants: 0')
    this.zombiesT = this.addDebugText('Zombies: 0')
    this.entitiesT = this.addDebugText('Entities: 0')
  }

  public addDebugText(str: string): Text {
    const t = new Text(str, {
      fill: 0xdddddd,
      fontSize: 16
    })
    t.y = this.children.length * 18
    t.zIndex = 2000
    this.addChild(t)
    return t
  }

  public update(dt: number): void {
    if(this.core.level) {
      if(dt < 1 && this.core.showDebug) {
        this.fpsT.text = 'FPS: ' + Math.round(this.core.app.ticker.FPS).toString()
        this.projsT.text = `Projectiles: ${this.core.level.projectiles.length + this.core.level.suns.length}`
        this.zombiesT.text = `Zombies: ${this.core.level.zombies.length}`
        
        const pc = this.core.level.slots.filter(s => s.plant !== null).length
        this.plantsT.text = `Plants: ${pc}`
        
        this.entitiesT.text = `Entities: ${pc + this.core.level.zombies.length + this.core.level.projectiles.length + this.core.level.suns.length}`
      }
    }
  }
}