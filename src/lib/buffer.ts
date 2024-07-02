import { write } from "fs";

export class DNSBuffer {
  private buffer: Buffer;
  private offset: number;
    static init: any;

  constructor(buffer?: Buffer) {
    this.buffer = buffer || Buffer.alloc(512);
    this.offset = buffer ? buffer.length : 0;
  }

  writeUInt16(value: number) {
    this.buffer[this.offset++] = value >> 8;
    this.buffer[this.offset++] = value & 0xFF;
  }

  readUInt16(): number {
    const value = (this.buffer[this.offset] << 8) | this.buffer[this.offset + 1];
    this.offset += 2;
    return value;
  }

  writeUInt32(value: number) {
    this.buffer[this.offset++] = (value >> 24) & 0xFF;
    this.buffer[this.offset++] = (value >> 16) & 0xFF;
    this.buffer[this.offset++] = (value >> 8) & 0xFF;
    this.buffer[this.offset++] = value & 0xFF;
  }

  readUInt32(): number {
    const value = (this.buffer[this.offset] << 24) | (this.buffer[this.offset + 1] << 16) | (this.buffer[this.offset + 2] << 8) | this.buffer[this.offset + 3];
    this.offset += 4;
    return value;
  }

  writeUInt8(value: number) {
    this.buffer[this.offset++] = value;
  }

  readUInt8(): number {
    return this.buffer[this.offset++];
  }

  writeString(value: string) {
    const parts = value.split('.');
    for (const part of parts) {
      this.writeUInt8(part.length);
      for (let i = 0; i < part.length; i++) {
        this.writeUInt8(part.charCodeAt(i));
      }
    }
    this.writeUInt8(0); 
  }


  writeStr(s:string) : void {
  for(const char of s) {
       this.buffer[this.offset++]=char.charCodeAt(0);
  }
  }

  readString(): string {
    let result = '';
    let length = this.readUInt8();
    while (length > 0) {
      if (result.length > 0) {
        result += '.';
      }
      result += this.buffer.toString('ascii', this.offset, this.offset + length);
      this.offset += length;
      length = this.readUInt8();
    }
    return result;
  }


  writeDomainName(value: string) {
    const parts = value.split('.');
    for (const part of parts) {
      this.writeUInt8(part.length);
      for (let i = 0; i < part.length; i++) {
        this.writeUInt8(part.charCodeAt(i));
      }
    }
    this.writeUInt8(0); 
  }

  writeRData(rdata: string, type: number, length: number) {
    switch (type) {
      case 1: // A record (IPv4 address)
        const ipParts = rdata.split('.');
        for (const part of ipParts) {
          this.writeUInt8(parseInt(part, 10));
        }
        break;
      case 28: // AAAA record (IPv6 address)
        const ipv6Parts = rdata.split(':');
        for (const part of ipv6Parts) {
          const value = parseInt(part, 16);
          this.writeUInt16(value);
        }
        break;
      case 5: // CNAME record (Canonical Name)
        this.writeDomainName(rdata);
        break;
      default:
        console.warn(`Unsupported record type: ${type}, skipping`);
        break;
    }
  }

  readDomainName(): string {
    let domain = '';
    let length = this.readUInt8();

    while (length > 0) {
      if ((length & 0xc0) === 0xc0) {
        // Pointer format
        const pointer = ((length & 0x3f) << 8) | this.readUInt8();
        const savedOffset = this.offset;
        this.offset = pointer;
        domain += this.readDomainName();
        this.offset = savedOffset;
        return domain;
      } else {
        // Label format
        if (domain.length > 0) {
          domain += '.';
        }
        domain += this.buffer.toString('ascii', this.offset, this.offset + length);
        this.offset += length;
      }
      length = this.readUInt8();
    }

    return domain;
  }

  readRData(type: number, length: number): string {
    switch (type) {
      case 1: // A record (IPv4 address)
        const ipBytes: number[] = [];
        for (let i = 0; i < 4; i++) {
          ipBytes.push(this.readUInt8());
        }

        return ipBytes.join('.');
      case 28: // AAAA record (IPv6 address)
        const ipv6Bytes: number[] = [];
        for (let i = 0; i < 16; i++) {
          ipv6Bytes.push(this.readUInt8());
        }
        return ipv6Bytes.map(byte => byte.toString(16).padStart(2, '0')).join(':');

      case 5: // CNAME record (Canonical Name)
        return this.readDomainName();
      default:
        console.warn(`Unsupported record type: ${type}, skipping`);
        this.advanceOffset(length);
        return '';
    }
  }

  readBytes(length: number): Buffer {
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  getBuffer(): Buffer {
    return this.buffer.slice(0, this.offset);
  }


  seekStart() :void{
    this.offset = 0;
  }
  
  getBuff() :Buffer {
    return this.buffer;
  
  }

  setBuffer(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  advanceOffset(bytes: number) {
    this.offset += bytes;
  }

  getOffset(): number {
    return this.offset;
  }

  setOffset(offset: number): void {
    this.offset = offset;
  }
}
