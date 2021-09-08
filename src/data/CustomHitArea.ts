import { Polygon } from "pixi.js";

export default abstract class CustomHitArea {
  protected shapes: Polygon[] = []

  public getShapes(): Polygon[] {
    return this.shapes
  }

  public putShape(shape: number[]): void {
    this.shapes.push(new Polygon(shape))
  }

  public contains(x = 0, y = 0) {
    return (!this.shapes || this.shapes.length === 0)
      ? false
      : this.shapes.some(shape => shape.contains(x, y));
  }
}