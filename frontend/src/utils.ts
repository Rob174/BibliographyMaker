
import * as FlatColors  from "flat-colors";
import tinycolor from 'tinycolor2';
export let getNColorsFlat = (n: number) => {
    let colors = [];
    for (let i = 0; i < n; i++) {
        const hueId = i;
        const hue = (hueId * 360) / n;
        const color = tinycolor({h: hue, s: 75, l: 50}).toHexString();
        const flatColor = FlatColors(color)
        colors.push(`rgb(${flatColor[0]}, ${flatColor[1]}, ${flatColor[2]})`);
      }
    return colors;
}