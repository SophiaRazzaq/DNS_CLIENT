import { DNSBuffer } from './buffer';

export class DNSHeader {
  id: number;
  flags: number;
  qdCount: number;
  anCount: number;
  nsCount: number;
  arCount: number;

  constructor() {
    this.id = 0;
    this.flags = 0;
    this.qdCount = 0;
    this.anCount = 0;
    this.nsCount = 0;
    this.arCount = 0;
  }



  write(buffer: DNSBuffer) {
    buffer.writeUInt16(this.id);
    buffer.writeUInt16(this.flags);
    buffer.writeUInt16(this.qdCount);
    buffer.writeUInt16(this.anCount);
    buffer.writeUInt16(this.nsCount);
    buffer.writeUInt16(this.arCount);
  }



  read(buffer: DNSBuffer) {
    this.id = buffer.readUInt16();
    this.flags = buffer.readUInt16();
    this.qdCount = buffer.readUInt16();
    this.anCount = buffer.readUInt16();
    this.nsCount = buffer.readUInt16();
    this.arCount = buffer.readUInt16();
    this.flags = parseInt(this.flags.toString(2)); // Convert flags to binary as it was showing in decimal 
  
  }


  get qr() {
    return (this.flags >> 15) & 1;
  }

  get opCode() {
    return (this.flags >> 11) & 0b1111;
  }
  
  get aa() {
    return (this.flags >> 10) & 1;
  }

  get tc() {
    return (this.flags >> 9) & 1;
  }
  

  get rd() {
    return (this.flags >> 8) & 1;
  }

  get ra() {
    return (this.flags >> 7) & 1;
  }

  get z() {
    return (this.flags >> 4) & 0b111;
  }

  get rcode() {
    return this.flags & 0b1111;
    
  }
}
