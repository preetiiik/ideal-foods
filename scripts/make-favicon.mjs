/**
 * One-off: build a REAL multi-size favicon.ico (+ PNG fallbacks) from
 * public/ideal-logo.png. Uses pngjs only — no native image deps.
 *
 * Usage: node scripts/make-favicon.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const SRC = "public/ideal-logo.png";

const src = PNG.sync.read(readFileSync(SRC));

// Box-average downscale (good quality for large factors, alpha-aware).
function resize(img, tw, th) {
  const out = new PNG({ width: tw, height: th });
  const sx = img.width / tw;
  const sy = img.height / th;

  for (let y = 0; y < th; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.max(y0 + 1, Math.min(img.height, Math.floor((y + 1) * sy)));
    for (let x = 0; x < tw; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.min(img.width, Math.floor((x + 1) * sx)));

      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * img.width + xx) << 2;
          const al = img.data[i + 3] / 255;
          r += img.data[i] * al;
          g += img.data[i + 1] * al;
          b += img.data[i + 2] * al;
          a += img.data[i + 3];
          n++;
        }
      }
      const o = (y * tw + x) << 2;
      if (a > 0) {
        out.data[o] = Math.round(r / (a / 255));
        out.data[o + 1] = Math.round(g / (a / 255));
        out.data[o + 2] = Math.round(b / (a / 255));
      }
      out.data[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

// Encode a PNG to an uncompressed 32-bit BMP (BITMAPINFOHEADER, top-down rows
// are stored bottom-up with BGRA order; alpha in the 4th byte, ICO-specific).
function pngToIcoBmp(img) {
  const w = img.width, h = img.height;
  const rowSize = w * 4;
  const pixelBytes = rowSize * h;
  const maskRow = Math.ceil(w / 32) * 4;
  const maskBytes = maskRow * h;
  const buf = Buffer.alloc(40 + pixelBytes + maskBytes);

  buf.writeUInt32LE(40, 0); // biSize
  buf.writeInt32LE(w, 4);
  buf.writeInt32LE(h * 2, 8); // ICO: height = image + mask
  buf.writeUInt16LE(1, 12); // planes
  buf.writeUInt16LE(32, 14); // bpp
  buf.writeUInt32LE(0, 16); // compression = BI_RGB
  buf.writeUInt32LE(pixelBytes + maskBytes, 20); // image size

  for (let y = 0; y < h; y++) {
    const srcRow = h - 1 - y; // bottom-up
    for (let x = 0; x < w; x++) {
      const i = (srcRow * w + x) << 2;
      const o = 40 + y * rowSize + x * 4;
      // Straight alpha straight into BGRA — ICO expects non-premultiplied.
      buf[o] = img.data[i + 2];
      buf[o + 1] = img.data[i + 1];
      buf[o + 2] = img.data[i];
      buf[o + 3] = img.data[i + 3];
    }
  }
  // AND mask: all zeros (alpha channel is authoritative).
  return buf;
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count

  const entries = [];
  let offset = 6 + images.length * 16;

  for (const img of images) {
    const data = pngToIcoBmp(img);
    const e = Buffer.alloc(16);
    e[0] = img.width === 256 ? 0 : img.width; // 0 means 256
    e[1] = img.height === 256 ? 0 : img.height;
    e[2] = 0; // palette
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push({ e, data });
  }

  return Buffer.concat([header, ...entries.map((x) => x.e), ...entries.map((x) => x.data)]);
}

// ---- Build ----
const sizes = [16, 32, 48, 64, 128, 256];
const icoImages = sizes.map((s) => resize(src, s, Math.round((s * src.height) / src.width)));

// ICO wants square-ish entries; pad non-square to square with transparency.
const square = (img) => {
  const side = Math.max(img.width, img.height);
  const out = new PNG({ width: side, height: side });
  const dx = Math.floor((side - img.width) / 2);
  const dy = Math.floor((side - img.height) / 2);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, dx, dy);
  return out;
};

writeFileSync("public/favicon.ico", buildIco(icoImages.map(square)));

// PNG fallbacks (some browsers prefer these).
const png32 = square(resize(src, 32, 32));
writeFileSync("public/favicon-32.png", PNG.sync.write(png32));
writeFileSync("public/favicon-180.png", PNG.sync.write(square(resize(src, 180, 180))));
writeFileSync("public/favicon-512.png", PNG.sync.write(square(resize(src, 512, 512))));

console.log(
  "favicon.ico:",
  readFileSync("public/favicon.ico").length,
  "bytes —",
  sizes.join("/"),
  "+ PNG fallbacks written"
);
