// https://stackoverflow.com/a/5624139 - algorithm used for converter

// using this so that i can use the hex value from the colourgenerator

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export default rgbToHex;
