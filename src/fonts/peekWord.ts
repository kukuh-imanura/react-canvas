const peekWord = (text: string, startIndex: number) => {
  let i = startIndex;
  let word = '';

  while (i < text.length && text[i] !== ' ' && text[i] !== '\n') {
    word += text[i];
    i++;
  }

  return word; // tanpa spasi
};

export default peekWord;
