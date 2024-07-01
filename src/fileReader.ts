import fs from 'fs';
import { DNSBuffer } from './buffer';

export class FileReader {
  static readFile(filePath: string): Buffer {
    return fs.readFileSync(filePath);
  }
}
