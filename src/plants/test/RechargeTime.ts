export default class RechargeTime {
  public static VERY_SLOW = new RechargeTime('very slow', 1)
  public static SLOW = new RechargeTime('slow', 2)
  public static FAST = new RechargeTime('fast', 4)

  public name: string
  public value: number

  private constructor(name: string, value: number) {
    this.name = name
    this.value = value
  }
}
