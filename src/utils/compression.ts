export function compressData(data: unknown): string {
  const json = JSON.stringify(data);
  const compressed = lzwCompress(json);
  const bytes: number[] = [];
  for (const code of compressed) {
    bytes.push((code >> 8) & 0xff, code & 0xff);
  }
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

export function decompressData<T = unknown>(input: string): T | null {
  try {
    const binary = atob(input);
    const codes: number[] = [];
    for (let i = 0; i < binary.length; i += 2) {
      codes.push((binary.charCodeAt(i) << 8) | binary.charCodeAt(i + 1));
    }
    const json = lzwDecompress(codes);
    return JSON.parse(json) as T;
  } catch {
    try {
      return JSON.parse(input) as T;
    } catch {
      return null;
    }
  }
}

function lzwCompress(uncompressed: string): number[] {
  const dictionary: Record<string, number> = {};
  const result: number[] = [];
  let dictSize = 256;
  for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }
  let w = '';
  for (const c of uncompressed) {
    const wc = w + c;
    if (dictionary.hasOwnProperty(wc)) {
      w = wc;
    } else {
      result.push(dictionary[w]);
      dictionary[wc] = dictSize++;
      w = c;
    }
  }
  if (w !== '') {
    result.push(dictionary[w]);
  }
  return result;
}

function lzwDecompress(compressed: number[]): string {
  const dictionary: Record<number, string> = {};
  let dictSize = 256;
  for (let i = 0; i < 256; i++) {
    dictionary[i] = String.fromCharCode(i);
  }
  let w = String.fromCharCode(compressed[0]);
  let result = w;
  for (let i = 1; i < compressed.length; i++) {
    const k = compressed[i];
    let entry: string;
    if (dictionary[k]) {
      entry = dictionary[k];
    } else if (k === dictSize) {
      entry = w + w[0];
    } else {
      throw new Error('Invalid compressed data');
    }
    result += entry;
    dictionary[dictSize++] = w + entry[0];
    w = entry;
  }
  return result;
}
