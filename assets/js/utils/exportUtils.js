/**
 * Export Utilities Module
 *
 * Functions to export palettes in various formats
 *
 * @module exportUtils
 */

/**
 * Generate CSS custom properties from palette
 *
 * @param {Array<Object>} palette - Array of color objects
 * @returns {string} CSS string
 */
export function exportAsCSS(palette) {
  const cssVars = palette
    .map(
      (color) => `  --${color.name}: ${color.hex}; /* L*: ${color.lightness} */`
    )
    .join("\n");

  return `:root {\n${cssVars}\n}`;
}

/**
 * Generate JSON from palette
 *
 * @param {Array<Object>} palette - Array of color objects
 * @returns {string} JSON string
 */
export function exportAsJSON(palette) {
  const jsonObj = palette.reduce((acc, color) => {
    acc[color.name] = {
      hex: color.hex,
      lightness: color.lightness,
      isBase: color.isBase,
    };
    return acc;
  }, {});

  return JSON.stringify(jsonObj, null, 2);
}

/**
 * Generate SVG swatches from palette
 *
 * @param {Array<Object>} palette - Array of color objects
 * @returns {string} SVG string
 */
export function exportAsSVG(palette) {
  const swatchWidth = 60;
  const swatchHeight = 60;
  const totalWidth = swatchWidth * palette.length;

  let svg = `<svg width="${totalWidth}" height="${swatchHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <title>Scientific Color Palette - Perceptually Uniform</title>\n`;

  palette.forEach((color, index) => {
    const x = index * swatchWidth;
    svg += `  <rect x="${x}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${color.hex}"`;

    if (color.isBase) {
      svg += ` stroke="#3b82f6" stroke-width="3"`;
    }

    svg += `>\n`;
    svg += `    <title>${color.name}: ${color.hex} (L*: ${color.lightness})</title>\n`;
    svg += `  </rect>\n`;
  });

  svg += "</svg>";
  return svg;
}

/**
 * Copy text to clipboard
 *
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    throw err;
  }
}
