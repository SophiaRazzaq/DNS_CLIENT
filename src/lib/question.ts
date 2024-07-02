import { DNSBuffer } from './buffer';
import { LabelSequence } from './label_seq';

export class DNSQuestion {
  name: string;
  type: number;
  qclass: number;

  constructor(name: string = '', type: number = 1, qclass: number = 1) {
    this.name = name;
    this.type = type;
    this.qclass = qclass;
  }

  sendDomainNameToBuffer(buffer: DNSBuffer) {
    if (!this.name) {
      throw new Error('Domain name must be provided.');
    }
    LabelSequence.write(this.name, buffer);
  }

  write(buffer: DNSBuffer) {
    buffer.writeString(this.name);
    buffer.writeUInt16(this.type);
    buffer.writeUInt16(this.qclass);
  }

  read(buffer: DNSBuffer) {
    this.name = buffer.readString(); 
    this.type = buffer.readUInt16();
    this.qclass = buffer.readUInt16();
  }
  static isDNSQuestion(obj: any): obj is DNSQuestion {
    return (
      typeof obj.name === 'string' &&
      typeof obj.type === 'number' &&
      typeof obj.qclass === 'number'
    );
  }
}
