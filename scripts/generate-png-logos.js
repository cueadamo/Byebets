import fs from "fs";
import zlib from "zlib";

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const bufToCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(bufToCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, getPixel) {
  const lineSize = 1 + width * 4;
  const raw = Buffer.alloc(height * lineSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * lineSize;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", compressed),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
}

// 5x7 font data for crisp text rendering
const FONT_5X7 = {
  B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  y: [0x11, 0x11, 0x11, 0x0f, 0x01, 0x09, 0x06],
  e: [0x0e, 0x11, 0x1f, 0x10, 0x11, 0x11, 0x0e],
  e_cap: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  t: [0x04, 0x0e, 0x04, 0x04, 0x04, 0x05, 0x02],
  s: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  S: [0x0e, 0x11, 0x10, 0x0e, 0x01, 0x11, 0x0e],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  D: [0x1c, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1c],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  ".": [0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c],
  " ": [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
};

function renderLogoPng(isLight) {
  const width = 600;
  const height = 165;

  const navy = isLight ? [255, 255, 255, 255] : [11, 35, 64, 255];
  const electricBlue = [41, 121, 255, 255];
  const gold = [185, 139, 62, 255];
  const transparent = [0, 0, 0, 0];

  return createPng(width, height, (x, y) => {
    // 1. Draw Door Arch Icon (left side, x: 20..95, y: 20..140)
    if (x >= 20 && x <= 95 && y >= 20 && y <= 140) {
      const ix = (x - 20) / 75; // 0..1
      const iy = (y - 20) / 120; // 0..1

      // Outer arch shape
      const isArch = iy > 0.3 || Math.pow(ix - 0.5, 2) / 0.25 + Math.pow(iy - 0.3, 2) / 0.09 <= 1;

      if (isArch) {
        // Inner door cutout
        const isInner =
          iy > 0.35 &&
          iy < 0.95 &&
          ix > 0.15 &&
          ix < 0.85 &&
          (iy > 0.4 || Math.pow(ix - 0.5, 2) / 0.12 + Math.pow(iy - 0.4, 2) / 0.05 <= 1);

        if (isInner) {
          // Electric blue gradient fill inside door
          const ratio = (iy - 0.35) / 0.6;
          const r = Math.round(41 + (100 - 41) * ratio);
          const g = Math.round(121 + (181 - 121) * ratio);
          const b = 255;
          return [r, g, b, 255];
        }
        return navy;
      }
    }

    // 2. Draw "ByeBets" large text (x: 120..580, y: 25..105)
    // Scale 5x7 font x10 -> 50x70 per char
    const titleScale = 10;
    const titleY = 25;

    // "Bye" (3 chars, navy/white)
    const byeText = ["B", "y", "e"];
    for (let c = 0; c < byeText.length; c++) {
      const char = byeText[c];
      const charX = 135 + c * (5 * titleScale + 12);
      if (x >= charX && x < charX + 5 * titleScale && y >= titleY && y < titleY + 7 * titleScale) {
        const fontGrid = FONT_5X7[char] || FONT_5X7["B"];
        const gx = Math.floor((x - charX) / titleScale);
        const gy = Math.floor((y - titleY) / titleScale);
        if ((fontGrid[gy] & (1 << (4 - gx))) !== 0) {
          return navy;
        }
      }
    }

    // "Bets" (4 chars, electric blue)
    const betsText = ["B", "e", "t", "s"];
    const betsStartX = 135 + 3 * (5 * titleScale + 12) + 20;
    for (let c = 0; c < betsText.length; c++) {
      const char = betsText[c];
      const charX = betsStartX + c * (5 * titleScale + 12);
      if (x >= charX && x < charX + 5 * titleScale && y >= titleY && y < titleY + 7 * titleScale) {
        const fontGrid = FONT_5X7[char] || FONT_5X7["B"];
        const gx = Math.floor((x - charX) / titleScale);
        const gy = Math.floor((y - titleY) / titleScale);
        if ((fontGrid[gy] & (1 << (4 - gx))) !== 0) {
          return electricBlue;
        }
      }
    }

    // 3. Draw Subtitle "ESCOLHAS HOJE. LIBERDADE SEMPRE." (x: 135..580, y: 120..140)
    const subScale = 2.5;
    const subY = 122;
    const subText = "ESCOLHAS HOJE. LIBERDADE SEMPRE.";
    let subX = 136;
    for (let i = 0; i < subText.length; i++) {
      const char = subText[i];
      const charW = 5 * subScale + 3;
      if (x >= subX && x < subX + 5 * subScale && y >= subY && y < subY + 7 * subScale) {
        const fontGrid = FONT_5X7[char === "E" ? "e_cap" : char] || FONT_5X7[" "];
        const gx = Math.floor((x - subX) / subScale);
        const gy = Math.floor((y - subY) / subScale);
        if (fontGrid && (fontGrid[gy] & (1 << (4 - gx))) !== 0) {
          return gold;
        }
      }
      subX += charW;
    }

    return transparent;
  });
}

// Write logo.png and logo-white.png
fs.writeFileSync("public/logo.png", renderLogoPng(false));
fs.writeFileSync("public/logo-white.png", renderLogoPng(true));

console.log("Generated public/logo.png and public/logo-white.png successfully!");
