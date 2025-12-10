let cachedAtlas: HTMLImageElement | null = null;

export const loadFontAtlas = () => {
  if (cachedAtlas) return cachedAtlas;

  const img = new Image();
  img.src = '/fonts/04B03/04B03.svg';

  cachedAtlas = img;
  return img;
};
