// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
// also used https://ruby2js.com/demo

import rgbToHex from "./rgbHexConverter";

let golden_ratio_conjugate = 0.618033988749895;

function colourGen() {
  let h = Math.random();
  h += golden_ratio_conjugate;
  h %= 1;
  h = hsv_to_rgb(h, 0.3, 0.99);
  return h;
}

// HSV values in [0..1[
// returns [r, g, b] values from 0 to 255
function hsv_to_rgb(h, s, v) {
  let r, g, b;
  let output;
  let h_i = parseInt(h * 6);
  let f = h * 6 - h_i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  if (h_i === 0) [r, g, b] = [v, t, p];
  if (h_i === 1) [r, g, b] = [q, v, p];
  if (h_i === 2) [r, g, b] = [p, v, t];
  if (h_i === 3) [r, g, b] = [p, q, v];
  if (h_i === 4) [r, g, b] = [t, p, v];
  if (h_i === 5) [r, g, b] = [v, p, q];

  output = rgbToHex(r * 256, g * 256, b * 256); // passing here because im lazy and dont want to extract from an array
  return output;
}

export default colourGen;
