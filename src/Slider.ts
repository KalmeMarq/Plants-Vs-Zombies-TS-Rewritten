import { Graphics, Text } from "pixi.js"
import Core from "."

export default class Slider extends Graphics {
  private currValue: number
  private handle: Graphics
  private label: Text

  public constructor(x: number, y: number, getValue: () => number, setValue: (v: number) => void, getLabel: (value: number) => string) {
    super()
    this.beginFill(0x777777)
    this.drawRect(0, 0, 300, 20)
    this.endFill()

    this.interactive = true
    this.position.set(x, y)

    this.currValue = getValue()

    this.handle = new Graphics()
    this.handle.position.set(Math.max(Math.min(this.width * this.currValue - 15, 300 - 30), 0), -5)
    this.handle.beginFill(0x0000ff)
    this.handle.drawRect(0, 0, 30, 30)
    this.handle.endFill()
    this.addChild(this.handle)

    this.label = new Text(getLabel(this.currValue), {
      fill: 0xffffff,
      fontSize: 16
    })
    this.label.anchor.set(0.5, 0)
    this.label.position.x = this.width / 2
    this.addChild(this.label)

    const core = Core.getInstance()

    this.on('click', (e) => {
      this.handle.position.x = Math.max(Math.min(e.data.global.x - this.x - 15, 300 - 30), 0)
      this.currValue = ((this.handle.position.x / (this.width - 30)))
      this.label.text = getLabel(this.currValue)
      setValue(this.currValue)

      core.options.save()
    })


    const onDragStart = () => {
      core.app.stage.interactive = true;
      core.app.stage.addListener('pointermove', onDrag)
    }

    const onDragEnd = () => {
      core.app.stage.interactive = false;
      core.app.stage.removeListener('pointermove', onDrag) 
    }

    this.handle.interactive = true
    this.handle.addListener('pointerdown', onDragStart)
    this.handle.addListener('pointerup', onDragEnd)
    this.handle.addListener('pointerupoutside', onDragEnd)

    const onDrag = (e: any) => {
      this.handle.position.x = Math.max(Math.min(e.data.global.x - this.x - 15, 300 - 30), 0)
      this.currValue = ((this.handle.position.x / (this.width - 30)))
      this.label.text = getLabel(this.currValue)
      setValue(this.currValue)

      core.options.save()
    }
  }
}
