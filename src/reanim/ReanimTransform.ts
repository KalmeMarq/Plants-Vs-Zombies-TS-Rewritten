import { Matrix } from '@pixi/math'

export class ReanimTransform {
  public matrix: Matrix
  public sX: number
  public sY: number
  public tX: number
  public tY: number
  public kX: number
  public kY: number
  public alpha: number

  public constructor() {
    this.tX = NaN
    this.tY = NaN
    this.kX = NaN
    this.kY = NaN
    this.sX = NaN
    this.sY = NaN
    this.alpha = NaN
    this.matrix = new Matrix()
  }

  public fillInFrom(other: ReanimTransform | null): void {
    if (other == null) {
      other = new ReanimTransform()
      other.tX = 0
      other.tY = 0
      other.kX = 0
      other.kY = 0
      other.sX = 1
      other.sY = 1
      other.alpha = 1
    }

    if (isNaN(this.tX)) this.tX = other.tX
    if (isNaN(this.tY)) this.tY = other.tY
    if (isNaN(this.kX)) this.kX = other.kX
    if (isNaN(this.kY)) this.kY = other.kY
    if (isNaN(this.sX)) this.sX = other.sX
    if (isNaN(this.sY)) this.sY = other.sY
    if (isNaN(this.alpha)) this.alpha = other.alpha

    this.calcMatrix()
  }

  public calcMatrix(): void {
    this.matrix = new Matrix(Math.cos(this.kX) * this.sX, -Math.sin(this.kX) * this.sX, Math.sin(this.kY) * this.sY, Math.cos(this.kY) * this.sY, this.tX, this.tY)
  }

  public toString(): string {
    return `[] x: ${this.tX} y: ${this.tY} image:`
  }
}
