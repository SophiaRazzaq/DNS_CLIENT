import { DNSBuffer } from './buffer';

export class LabelSequence {
  private constructor() {}

  static parse(buff: DNSBuffer): LabelSequence {
    return new LabelSequence();
  }

  static write(domainName: string, buffer: DNSBuffer) {
    const parts = domainName.split('.');
    for (const part of parts) {
      buffer.writeUInt8(part.length);
      for (let i = 0; i < part.length; i++) {
        buffer.writeUInt8(part.charCodeAt(i));
      }
    }
    buffer.writeUInt8(0);
  }

  static read(buffer: DNSBuffer): string {
    let domainName = '';
    let length = buffer.readUInt8();
    while (length !== 0) {
      if (domainName.length > 0) {
        domainName += '.';
      }
      domainName += buffer.readString();
      length = buffer.readUInt8();
    }
    return domainName;
  }

  static isLabelSequence(obj: any): obj is LabelSequence {
    return obj instanceof LabelSequence;
  }
}
