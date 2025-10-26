# SurfaceLab v2.0 - Scientific Color Palette Generator

A scientifically accurate color palette generator that creates perceptually uniform color scales using LAB color space mathematics.

## Scientific Foundation

Based on the "Simplest Color Balance" research paper, SurfaceLab uses LAB color space for perceptually uniform lightness distribution, ensuring mathematically consistent and visually smooth color progressions across all scales.

## Features

- **Scientific Algorithm**: Perceptually uniform lightness scaling using LAB color space
- **Real-time Generation**: Instant palette updates as you adjust parameters
- **Multiple Export Formats**: CSS custom properties, JSON, and SVG
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Accessibility**: Keyboard navigation and screen reader support
- **Modular Architecture**: Clean, maintainable, and testable codebase

## Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Choose a base color** using the color picker or hex input
4. **Set the number of steps** (5-50 colors)
5. **Generate your palette** and export in your preferred format

## Project Structure

```
SurfaceLab/
├── index.html                 # Main application
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens
│   │   ├── base.css           # Base styles
│   │   ├── components.css     # Component styles
│   │   └── main.css           # CSS entry point
│   └── js/
│       ├── core/
│       │   ├── colorScience.js        # Core color algorithms
│       │   └── paletteGenerator.js    # Palette generation logic
│       ├── utils/
│       │   ├── exportUtils.js         # Export functionality
│       │   └── validators.js          # Input validation
│       ├── ui/
│       │   ├── ui.js                  # UI controller
│       │   └── notifications.js       # Notification system
│       └── main.js                    # Application entry point
└── README.md
```

## Core Algorithm

### Color Science Module (`colorScience.js`)

The heart of SurfaceLab - contains all color space conversion mathematics:

- **sRGB ↔ Linear RGB**: Gamma correction handling
- **RGB ↔ XYZ**: CIE 1931 color space (D65 illuminant)
- **XYZ ↔ LAB**: Perceptually uniform color space
- **Hex utilities**: Web-safe color format handling

### Palette Generator (`paletteGenerator.js`)

Implements the scientific palette generation algorithm:

1. Convert base color to LAB space
2. Calculate optimal position based on lightness
3. Generate colors with linear lightness distribution
4. Preserve hue and chroma, vary only lightness

## Usage Examples

### Basic Usage

```javascript
// Generate a 20-step palette from blue
const palette = PaletteGenerator.generateUniformScale('#3b82f6', 20);

// Each color object contains:
// {
//   hex: '#1a1a2e',
//   name: 'color-950',
//   isBase: false,
//   lightness: 15
// }
```

### Development API

When running locally, access the development API:

```javascript
// Available in browser console
window.SurfaceLab.test.generatePalette('#ff0000', 10);
window.SurfaceLab.test.hexToLab('#3b82f6');
```

## Export Formats

### CSS Custom Properties
```css
:root {
  --color-1000: #0a0a0f; /* L*: 5 */
  --color-950: #1a1a2e; /* L*: 15 */
  --color-900: #2a2a4e; /* L*: 25 */
  /* ... */
}
```

### JSON
```json
{
  "color-1000": {
    "hex": "#0a0a0f",
    "lightness": 5,
    "isBase": false
  }
}
```

### SVG Swatches
Ready-to-use SVG with proper color metadata for design tools.

## Development

### Architecture Principles

- **Algorithm Isolation**: Color science is completely independent
- **Single Responsibility**: Each module does one thing well
- **Testability**: Every module can be tested in isolation
- **Progressive Enhancement**: HTML works without JS

### Module Dependencies

```
main.js (orchestrator)
├── ui.js → colorScience.js
├── exportUtils.js → (no dependencies)
└── paletteGenerator.js → colorScience.js
```

## Performance

- **Palette Generation**: < 100ms for 50 steps
- **Initial Load**: < 2 seconds
- **UI Interactions**: < 16ms (60fps)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires ES6 modules support.

## Technical Specifications

### Color Spaces
- **Input**: sRGB hex colors (#rrggbb)
- **Processing**: CIE LAB (D65 illuminant)
- **Output**: sRGB hex colors

### Lightness Range
- **Minimum**: L* = 5 (very dark, not pure black)
- **Maximum**: L* = 95 (very light, not pure white)
- **Distribution**: Linear interpolation for perceptual uniformity

### Gamut Handling
- Automatic chroma reduction for out-of-gamut colors
- Preserves hue while ensuring valid sRGB output

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use ES6+ features
- Follow JSDoc commenting
- Maintain module isolation
- Write tests for new features

## License

MIT License - feel free to use in personal and commercial projects.

## References

- "Simplest Color Balance" research paper
- CIE LAB color space specification
- sRGB color space standard (IEC 61966-2-1)

---

**SurfaceLab v2.0** - Where color science meets practical design tools.