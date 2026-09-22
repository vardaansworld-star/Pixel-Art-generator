# Pixel Art Generator

A simple,lightweight browser tool for drawing small pixel art sprites and exporting them as clean,high-resolution PNGs.

## Why I Built This

I recently started learning 2D game development in Godot for Hack Club's **Haven** event. While working on my game, I kept running into the same problem: I needed quick, simple 8x8 or 16x16 pixel sprites for testing, but opening heavy desktop art software or searching online for placeholder assets was slowing down my workflow. 

I built this web tool so I could quickly sketch sprite ideas in my browser and download crisp PNGs ready to drop directly into Godot

## Features

- **Grid Sizing:** Switch between 8x8, 16x16, and 32x32 canvas sizes depending on the sprite scale you need
- **Drawing Tools:** Pencil for painting, Eraser for clearing pixels, and an Eyedropper to pick colors straight off the canvas
- **Continuous Line Strokes:** Uses line interpolation so drawing fast with the mouse doesn't leave gaps between pixels
- **Palette & Color Picker:** Quick-select color swatches plus a native color picker for custom hex codes
- **Crisp PNG Export:** Automatically upscales the canvas on export so your saved PNG files aren't tiny 16x16 pixel thumbnails when saved to disk.
- **Grid Toggle & Clear:** Easily toggle visible grid lines on or off while drawing

## Tech Stack

- Plain HTML
- CSS3 (styled with a dark slate sidebar and light workspace using the *Succulent* font)
- Vanilla JavaScript

No build tools, npm packages, or external frameworks required

## How to Run

1. Clone or download the repo
2. Open index.html in any web browser
3. Start drawing!
## OR
Simply use the global link = 
