import fs from 'fs';
import { DNSBuffer } from './lib/buffer';

export class FileReader {
  static readFile(filePath: string): Buffer {
    return fs.readFileSync(filePath);
  }
}
