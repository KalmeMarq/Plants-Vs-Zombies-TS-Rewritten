export default class BinaryReader {
  public buffer: Uint8Array
  public view: DataView
  public pos = 0

  public constructor(data: Uint8Array) {
    this.buffer = new Uint8Array(data)
    this.view = new DataView(this.buffer.buffer)
  }

  public readUint32(): number {
    const value = this.view.getUint32(this.pos, true)
    this.pos += 4
    return value
  }

  public readInt32(): number {
    const value = this.view.getInt32(this.pos, true)
    this.pos += 4
    return value
  }

  public readUint16(): number {
    const value = this.view.getUint16(this.pos, true)
    this.pos += 2
    return value
  }

  public readInt16(): number {
    const value = this.view.getInt16(this.pos, true)
    this.pos += 2
    return value
  }

  public readByte(): number {
    const value = this.view.getInt8(this.pos)
    this.pos += 1
    return value
  }

  public readBytes(length: number): Uint8Array {
    const value = []
    for (let i = 0; i < length; i++) {
      value.push(this.readByte())
    }
    return new Uint8Array(value)
  }
}
