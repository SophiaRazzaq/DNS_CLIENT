
import { DNSBuffer } from './buffer';

export class DNSQuestion {
  name: string;
  type: number;
  qclass: number;

  constructor(name: string = '', type: number = 1, qclass: number = 1) {
    this.name = name;
    this.type = type;
    this.qclass = qclass;
  }

  write(buffer: DNSBuffer) {
    buffer.writeString(this.name);
    buffer.writeUInt16(this.type);
    buffer.writeUInt16(this.qclass);
  }

  read(buffer: DNSBuffer) { //current offset
    this.name = buffer.readString();
    this.type = buffer.readUInt16();
    this.qclass = buffer.readUInt16();
    
}
}