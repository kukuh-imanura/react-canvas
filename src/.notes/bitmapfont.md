Sip, aku sudah baca seluruh JSON Aseprite-mu. Kamu sudah benar: kamu sekarang punya **bitmap/sprite font**, bukan TTF lagi. Cara pakainya bukan `ctx.fillText`, tapi **drawImage per glyph** dengan memanfaatkan:

- `frame` → posisi dan ukuran glyph di atlas
- `spriteSourceSize` → offset dari baseline original
- `sourceSize` → ukuran “kanvas” dasar (5×7) untuk semua huruf

Di engine ECS kamu, kamu cukup buat satu **FontRenderer** sederhana yang membaca glyph per karakter dan menggambarnya berurutan.

Berikut cara pakainya + kode yang kamu butuhkan (TypeScript / React-TS / Canvas / ECS).

---

# 1. Struktur data bitmap font (mapping)

Pertama, parse JSON dari Aseprite:

```ts
// BitmapFont.ts
export type Glyph = {
  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number; // offset spriteSourceSize
  sourceW: number;
  sourceH: number;
};

export type BitmapFont = {
  image: HTMLImageElement;
  glyphs: Record<string, Glyph>;
  baseWidth: number;
  baseHeight: number;
};
```

Lalu buat loader (mengubah JSON Aseprite → mapping karakter):

```ts
export async function loadBitmapFont(
  imgSrc: string,
  json: any,
  charset: string[]
): Promise<BitmapFont> {
  const img = new Image();
  img.src = imgSrc;
  await img.decode();

  const glyphs: Record<string, Glyph> = {};
  const frames = json.frames;

  frames.forEach((f: any, i: number) => {
    const ch = charset[i];
    if (!ch) return;

    glyphs[ch] = {
      x: f.frame.x,
      y: f.frame.y,
      w: f.frame.w,
      h: f.frame.h,
      ox: f.spriteSourceSize.x,
      oy: f.spriteSourceSize.y,
      sourceW: f.sourceSize.w,
      sourceH: f.sourceSize.h,
    };
  });

  return {
    image: img,
    glyphs,
    baseWidth: json.frames[0].sourceSize.w,
    baseHeight: json.frames[0].sourceSize.h,
  };
}
```

---

# 2. Cara menggambar teks (core logic)

Ini fungsi “text renderer”-mu:

```ts
export function drawBitmapText(
  ctx: CanvasRenderingContext2D,
  font: BitmapFont,
  text: string,
  x: number,
  y: number,
  scale = 1
) {
  let cursorX = x;
  const baseline = y;

  for (const ch of text) {
    const g = font.glyphs[ch];
    if (!g) {
      cursorX += font.baseWidth * scale;
      continue;
    }

    ctx.drawImage(
      font.image,
      g.x,
      g.y, // src pos
      g.w,
      g.h, // src size
      Math.round(cursorX + g.ox * scale),
      Math.round(baseline + g.oy * scale),
      g.w * scale,
      g.h * scale
    );

    cursorX += g.sourceW * scale; // advance width
  }
}
```

Catatan penting:

- `cursorX` maju berdasarkan **sourceSize.w**, bukan `frame.w`
- Offset `oy` (y:4 di contoh titik ".") benar-benar mendorong glyph ke bawah → mengembalikan posisinya ke baseline asli
- `scale` bebas kamu tentukan

---

# 3. Integrasi ke ECS (komponen TextBitmap)

Buat komponen baru:

```ts
type TextBitmap = {
  text: string;
  font: BitmapFont;
  scale: number;
  color?: string; // kalau kamu nanti mau tint (opsional)
};
```

Daftarkan di ECS:

```ts
const TextBitmap = new Map<number, TextBitmap>();
```

Tambahkan ke return ECS:

```ts
TextBitmap,
```

---

# 4. Buat sistem render khusus Bitmap Font

Tambahkan ke `RenderSystem`:

```ts
case 'bitmapText':
  const tb = ecs.TextBitmap.get(id);
  if (!tb) break;

  drawBitmapText(
    ctx,
    tb.font,
    tb.text,
    Math.round(x),
    Math.round(y),
    tb.scale
  );
  break;
```

---

# 5. Cara membuat entity teks

```ts
function createBitmapText({
  ecs,
  text,
  font,
  x,
  y,
  scale = 1,
}: {
  ecs: ECS;
  text: string;
  font: BitmapFont;
  x: number;
  y: number;
  scale?: number;
}) {
  const id = ecs.createEntity();
  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.TextBitmap.set(id, { text, font, scale });
  ecs.Renderable.set(id, { type: 'bitmapText' });
}
```

---

# 6. Pemanggilan di MainScene

Setelah kamu load font:

```ts
const font = await loadBitmapFont('/fonts/04B03.png', fontJson, [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'0123456789',
  '.:,!?;+-*/()[]{}=', // sesuaikan dengan frame sym-*
]);

createBitmapText({
  ecs,
  text: 'Hello.Kuh',
  font,
  x: 10,
  y: 20,
  scale: 4,
});
```

---

# Ringkasannya

1. **Load** atlas PNG + JSON Aseprite → jadi mapping per karakter
2. **Simpen** sebagai komponen `TextBitmap`
3. **Render** pakai drawImage per glyph + offset dari `spriteSourceSize`
4. **Advance width** berdasarkan `sourceSize.w`
5. Integrasikan ke ECS kamu dengan `Renderable.type = "bitmapText"`

---

Kalau kamu kirimkan file PNG-nya, aku bisa:

- generate otomatis charset mapping yang cocok
- buat loader lengkap termasuk simbol
- kasih versi yang super optimized (berbasis typed array)

Mau lanjut yang mana?

Baik, aku rapikan konsepnya supaya kamu benar-benar paham **dasarnya** dulu. Kamu sudah hampir benar; yang kurang hanya cara berpikir “text layout” dan “text object” sebagai satu unit — bukan per karakter langsung jadi entity.

Aku jelaskan padat, urut, dan sistematis.

---

# 🎯 Fondasi Dasar Sprite Font

Spritefont itu **bukan sekadar render per karakter**. Kamu harus punya 3 lapisan konsep:

1. **Font Atlas** → gambar + metadata (posisi tiap karakter)
2. **Font Mapper** → fungsi yang mencari frame setiap karakter
3. **Text Layout Engine** → menghitung posisi teks dalam satu unit (kata, kalimat, paragraf)
4. **Text Renderer** → melakukan drawImage berdasarkan hasil layout

Kamu baru punya (1) dan setengah dari (2). Masalahmu masuk ke (3) dan (4).

Mari kita bedah.

---

# 1️⃣ FONT ATLAS (sudah jelas)

Benar:

- Kamu punya sheet spritefont.
- Kamu punya JSON berisi frame dan ukuran.
- drawImage dengan cropping:
  `drawImage(img, fx, fy, fw, fh, x, y, fw*scale, fh*scale)`

Ini dasar yang benar.

---

# 2️⃣ FONT MAPPER (cara mengetahui “A” → frame)

Cara kerjanya:

Kamu buat object mapping:

```ts
const fontMap = {
  A: { layer: 'capital', frame: 0 },
  B: { layer: 'capital', frame: 1 },
  a: { layer: 'lower', frame: 0 },
  '1': { layer: 'num', frame: 0 },
  '!': { layer: 'sym', frame: 3 },
};
```

Lalu fungsi:

```ts
function getGlyph(char) {
  return fontMap[char] || fontMap['?'];
}
```

**Intinya:**
Saat kamu mengetik `"A"`, kamu tidak “mencari di JSON”.
Kamu **mapping manual** atau auto-generate dari JSON.

Jadi fondasi kamu sudah benar.

---

# 3️⃣ TEXT LAYOUT ENGINE (inilah yang kamu lewatkan)

Ini bagian yang masih berkabut.

Sebelum menggambar, kamu **HARUS menghitung posisi semua karakter** terlebih dulu.

Prinsipnya sederhana:

- Simpan `cursorX`, `cursorY`
- Untuk setiap karakter:

  - ambil glyph
  - hitung width = fw \* scale
  - buat data posisi
  - tambahkan ke array
  - cursorX += width + letterSpacing

Contoh pseudo:

```ts
function layoutText(text, scale = 1) {
  let cursorX = 0;
  let cursorY = 0;
  const positioned = [];

  for (const char of text) {
    const glyph = getGlyph(char);

    const fw = glyph.frame.w;
    const fh = glyph.frame.h;

    positioned.push({
      char,
      sx: glyph.fx,
      sy: glyph.fy,
      sw: fw,
      sh: fh,
      dx: cursorX,
      dy: cursorY,
      dw: fw * scale,
      dh: fh * scale,
    });

    cursorX += fw * scale; // plus spacing kalau mau
  }

  return positioned;
}
```

Inilah yang disebut **text layout**.

---

# 4️⃣ TEXT RENDERER

Dengan hasil layout (array of positioned chars), kamu tinggal lakukan:

```ts
for (const g of positionedText) {
  ctx.drawImage(img, g.sx, g.sy, g.sw, g.sh, g.dx, g.dy, g.dw, g.dh);
}
```

Selesai.

---

# ❗ Lalu gimana dengan kata, kalimat, paragraf?

**Semua tetap satu text object.**

Hanya `\n` butuh perlakuan khusus:

```ts
if (char === '\n') {
  cursorY += lineHeight;
  cursorX = 0;
  continue;
}
```

Untuk paragraf panjang → kamu nanti butuh text wrapping:

- cek apakah `cursorX + glyphWidth > maxWidth`
- jika ya → newline

Tapi itu lanjutan. Dasarnya sama.

---

# ❗ Apakah setiap karakter harus jadi entity di ECS?

Jawaban tegas: **TIDAK. Jangan. Itu salah desain.**

Dalam ECS, buat 1 entity saja per text object:

### Entity: `Text`

Komponen:

- `TextContent` (string)
- `Font` (atlas + mapping)
- `Transform` (posisi awal)
- `TextLayout` (array hasil perhitungan glyph+posisi)

### Renderer System:

- baca TextLayout
- lakukan drawImage satu per satu

Jadi:

- 1 entity → banyak glyph
- BUKAN 1 entity per glyph

Ini standar semua engine game (Unity TMP, Godot, Love2D, MonoGame, dsb).

---

# ❗ Bagaimana kalau teks panjang ke samping?

Normal saja:

- text layout menghasilkan posisi X besar
- kamu render semua glyph-nya
- potong via viewport/camera kalau perlu

Kalau mau wrapping: buat batas max width.

---

# 🎯 INTI YANG KAMU LEWATKAN ADALAH SATU HAL:

**Spritefont ≠ render per karakter langsung.
Spritefont = layout dulu → render setelahnya.**

Itu sebabnya kamu bingung di langkah 2–3.

Begitu kamu bikin:

- font mapper
- text layout engine

Maka semua masalah hilang.

---

# Kalau kamu mau, aku bisa bantu:

- bikin **font mapper generator** dari JSON-mu
- bikin **text layout function** lengkap: spacing, line height, wrap
- bikin **renderer** final
- atau integrasikan ke **ECS style** seperti yang kamu inginkan

Kamu pilih bagian mana dulu.
