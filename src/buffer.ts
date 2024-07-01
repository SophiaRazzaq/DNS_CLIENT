export class DNSBuffer {
  private buffer: Buffer;
  private offset: number;

  constructor(buffer?: Buffer) {
    this.buffer = buffer || Buffer.alloc(512);
    this.offset = buffer ? buffer.length : 0;
  }

  // Write 16-bit  integer to buffer
  writeUInt16(value: number) {
    this.buffer[this.offset++] = value >> 8;
    this.buffer[this.offset++] = value & 0xFF;
  }

  // Read 16-bit  integer from buffer
  readUInt16(): number {
    const value = (this.buffer[this.offset] << 8) | this.buffer[this.offset + 1];
    this.offset += 2;
    return value;
  }

  // Write 32-bit  integer to buffer
  writeUInt32(value: number) {
    this.buffer[this.offset++] = (value >> 24) & 0xFF;
    this.buffer[this.offset++] = (value >> 16) & 0xFF;
    this.buffer[this.offset++] = (value >> 8) & 0xFF;
    this.buffer[this.offset++] = value & 0xFF;
  }

  // Read 32-bit  integer from buffer
  readUInt32(): number {
    const value = (this.buffer[this.offset] << 24) | (this.buffer[this.offset + 1] << 16) | (this.buffer[this.offset + 2] << 8) | this.buffer[this.offset + 3];
    this.offset += 4;
    return value;
  }

  // Write 8-bit  integer to buffer
  writeUInt8(value: number) {
    this.buffer[this.offset++] = value;
  }

  // Read 8-bit  integer from buffer
  readUInt8(): number {
    return this.buffer[this.offset++];
  }

  // Write string to buffer as DNS label format
  writeString(value: string) {
    const parts = value.split('.');
    for (const part of parts) {
      this.writeUInt8(part.length);
      for (let i = 0; i < part.length; i++) {
        this.writeUInt8(part.charCodeAt(i));
      }
    }
    this.writeUInt8(0); // Terminate with zero-length byte
  }

  // Read string from buffer in DNS label format
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

  // Read domain name from buffer in DNS label compression format
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

  // Read RData based on record type and length
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

  // Read bytes from buffer
  readBytes(length: number): Buffer {
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  // Get current buffer
  getBuffer(): Buffer {
    return this.buffer.slice(0, this.offset);
  }

  // Set buffer
  setBuffer(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  // Advance offset by specified bytes
  advanceOffset(bytes: number) {
    this.offset += bytes;
  }

  // Get current offset
  getOffset(): number {
    return this.offset;
  }

  // Set offset to specific position
  setOffset(offset: number): void {
    this.offset = offset;
  }
}
