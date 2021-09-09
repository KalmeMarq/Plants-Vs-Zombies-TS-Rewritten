export type IPVZTexts = {
  [key: string]: string[]
}

export type IPVZReanimTicks = {
  x?: number,
  y?: number,
  sx?: number,
  sy?: number,
  kx?: number,
  ky?: number,
  i?: number,
  f?: number,
  a?: number
}

export type IPVZReanimTrack = {
  name: string,
  ticks: IPVZReanimTicks[]
}

export type IPVZReanim = {
  fps: number,
  tracks: IPVZReanimTrack[]
}

export type IPVZResourceContents = {
  type: 'SetDefaults' | 'Image' | 'Sound',
  id?: string,
  idprefix?: string,
  path: string,
  cols?: number,
  rows?: number,
  minsubdivide?: boolean
  a8r8g8b8?: boolean
  ddsurface?: boolean,
  alphagrid?: string
}

export type IPVZResource = {
  id: string,
  contents: IPVZResourceContents[]
}

export type IPVZResources = {
  resources: IPVZResource[]
}

export type IPVZRect = [number, number, number, number]
export type IPVZOffset = [number, number]
export type IPVZKerningPairs = string[]
export type IPVZCharList = string[]
export type IPVZKerningValues = number[]
export type IPVZWidthList = number[]
export type IPVZRectList = IPVZRect[]
export type IPVZOffsetList = IPVZOffset[]

export type IPVZFontLayer = {
  createLayer: string,
  layerSetImage: string,
  layerSetAscent: number,
  layerSetCharWidths: [IPVZCharList, IPVZWidthList],
  layerSetImageMap: IPVZRectList,
  layerSetCharOffsets: IPVZOffsetList,
  layerSetKerningPairs?: [IPVZKerningPairs, IPVZKerningValues],
  layerSetAscentPadding: number,
  layerSetLineSpacingOffset: number,
  layerSetPointSize: number,
  setDefaultPointSize: number
}

export type IPVZFont = {
  charList: IPVZCharList,
  widthList: IPVZWidthList,
  rectList: IPVZRectList,
  offsetList: IPVZOffsetList,
  layers: IPVZFontLayer[]
}

export type INewPVZFont = {
  [key: string]: {
    w: number;
    offset: [number, number];
    rect: IPVZRect
  }
}

export default class Convert {
  public static toPVZTexts(str: string): IPVZTexts {
    const obj: IPVZTexts = {}
    const splitted = str.split(/\r\n/g)

    let key = ''
    let values: string[] = []
    for (let i = 0; i < splitted.length; i++) {
      const el = splitted[i]

      if (el.startsWith('[') && el.endsWith(']')) {
        key = el.substring(1, el.length - 1)
      } else if (el.length > 0) {
        values.push(el)
      } else {
        const nx = splitted[i + 1]

        if (key.length > 0 && nx && nx.startsWith('[') && nx.endsWith(']')) {
          obj[key] = values
          key = ''
          values = []
        }
      }

      if (i + 1 === splitted.length) {
        obj[key] = values
      }
    }

    return obj
  }

  /** @deprecated */
  public static oldfontInfo(str: string): IPVZFont {
    const obj: IPVZFont = {
      charList: [],
      widthList: [],
      rectList: [],
      offsetList: [],
      layers: []
    }

    let pos = 0

    let a = str.indexOf('Define CharList')
    let b = str.indexOf(');')
    pos = b + 2

    let c = str.slice(a + 'Define CharList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace("'\"'", '"\\""')
    c = c.replace(/',/g, '",')
    c = c.replace(/,'/g, ',"')
    c = c.replace("['", '["')
    c = c.replace("']", '"]')

    obj.charList = JSON.parse(c)

    a = str.indexOf('Define WidthList')
    b = str.indexOf(');', pos)
    pos = b + 2

    c = str.slice(a + 'Define WidthList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'

    obj.widthList = JSON.parse(c)

    a = str.indexOf('Define RectList')
    b = str.indexOf(');', pos)
    pos = b + 2

    c = str.slice(a + 'Define RectList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace(/\(/g, '[')
    c = c.replace(/\)/g, ']')

    obj.rectList = JSON.parse(c)

    a = str.indexOf('Define OffsetList')
    b = str.indexOf(');', pos)
    pos = b + 2

    c = str.slice(a + 'Define OffsetList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace(/\(/g, '[')
    c = c.replace(/\)/g, ']')

    obj.offsetList = JSON.parse(c)

    const rest = str.slice(pos, str.length).trim()

    const d = rest.split('\r\n')
    d.forEach((v, i) => {
      d[i] = v.replace(/\s{2,}/g, '=')
    })

    let currLayer: IPVZFontLayer = {
      createLayer: '',
      layerSetImage: '',
      layerSetAscent: 0,
      layerSetCharWidths: [[], []],
      layerSetImageMap: [],
      layerSetCharOffsets: [],
      layerSetAscentPadding: 0,
      layerSetLineSpacingOffset: 0,
      layerSetPointSize: 0,
      setDefaultPointSize: 0
    }

    d.forEach(v => {
      const g = v.split('=')
      if (g.length === 2) {
        g[1] = g[1].replace(';', '')
      }

      if (g[0] === '') {
        obj.layers.push(currLayer)
        currLayer = {
          createLayer: '',
          layerSetImage: '',
          layerSetAscent: 0,
          layerSetCharWidths: [[], []],
          layerSetImageMap: [],
          layerSetCharOffsets: [],
          layerSetAscentPadding: 0,
          layerSetLineSpacingOffset: 0,
          layerSetPointSize: 0,
          setDefaultPointSize: 0
        }
      }

      if (g[0] === 'CreateLayer') {
        currLayer.createLayer = g[1]
      }

      if (g[0] === 'LayerSetImage') {
        let n = g[1]
        n = n.slice(n.indexOf("'") + 1, n.lastIndexOf("'"))
        currLayer.layerSetImage = n
      }

      if (g[0] === 'LayerSetAscent') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetAscent = parseFloat(n)
      }

      if (g[0] === 'LayerSetAscentPadding') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetAscentPadding = parseFloat(n)
      }

      if (g[0] === 'LayerSetLineSpacingOffset') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetLineSpacingOffset = parseFloat(n)
      }

      if (g[0] === 'LayerSetPointSize') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetPointSize = parseFloat(n)
      }

      if (g[0] === 'LayerSetCharWidths') {
        if (currLayer.layerSetCharWidths[0].length === 0 && currLayer.layerSetCharWidths[1].length === 0) {
          let n = g[1]
          n = n.replace(currLayer.createLayer, '').trim()

          const m = n.split(' ')
          m.forEach((v, i) => {
            m[i] = v[0].toLowerCase() + v.substring(1, v.length)
          })

          const j = m[0]
          const k = m[1]

          if ((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
          (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
            // currLayer.layerSetCharWidths = [obj[j] as any, obj[k] as any]
          }
        } else {
          let n = g[1]
          n = n.replace(currLayer.createLayer, '').trim()
          n = n.replace(/\(/g, '[')
          n = n.replace(/\)/g, ']')
          n = n.replace(/'/g, '"')

          const p = [JSON.parse(n.substring(0, n.indexOf(']') + 1)), JSON.parse(n.substring(n.indexOf(']') + 1, n.length))]

          currLayer.layerSetCharWidths[0].push(p[0])
        }
      }

      if (g[0] === 'LayerSetImageMap') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()

        const m = n.split(' ')
        m.forEach((v, i) => {
          m[i] = v[0].toLowerCase() + v.substring(1, v.length)
        })

        const j = m[0]
        const k = m[1]

        if ((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
        (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
          currLayer.layerSetImageMap = [obj[j] as IPVZRect, obj[k] as IPVZRect]
        }
      }

      if (g[0] === 'LayerSetCharOffsets') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()

        const m = n.split(' ')
        m.forEach((v, i) => {
          m[i] = v[0].toLowerCase() + v.substring(1, v.length)
        })

        const j = m[0]
        const k = m[1]

        if ((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
        (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
          currLayer.layerSetCharOffsets = [obj[j] as IPVZOffset, obj[k] as IPVZOffset]
        }
      }
    })

    obj.layers.push(currLayer)

    return obj
  }

  public static newFontInfo(str: string): INewPVZFont {
    const oldFontInfoFormat = this.oldfontInfo(str)

    const newFontInfoFormat: { [key: string]: { w: number, offset: [number, number], rect: [number, number, number, number] } } = {}
    oldFontInfoFormat.charList.forEach((c, i) => {
      newFontInfoFormat[c] = {
        w: oldFontInfoFormat.widthList[i],
        offset: oldFontInfoFormat.offsetList[i],
        rect: oldFontInfoFormat.rectList[i] as IPVZRect
      }
    })

    return newFontInfoFormat
  }
}
