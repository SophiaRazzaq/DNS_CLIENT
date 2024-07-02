import { DNSBuffer } from './buffer';

export class DNSHeader {
  #left_bytes: number;
  #right_bytes: number;



  private constructor(b1: number, b2: number) {
    this.#left_bytes = b1;
    this.#right_bytes = b2;
  }

  
  // Wrapper function for the private constructor
  static fromBytes(b1: number, b2: number): DNSHeader {
    return new DNSHeader(b1, b2);
  }

  static create(qr: number, opcode: number): DNSHeader {
    const b1 = ((qr << 7) & 0x80) | ((opcode << 3) & 0x78);
    const b2 = 0;
    return new DNSHeader(b1, b2);
  }

  // Static method to parse DNSHeader from DNSBuffer
  static parse(buffer: DNSBuffer): DNSHeader {
    const b1 = buffer.readUInt8();
    const b2 = buffer.readUInt8();
    return new DNSHeader(b1, b2);
  }

  // Method to write DNSHeader into DNSBuffer
  write(buffer: DNSBuffer) {
    buffer.writeUInt8(this.#left_bytes);
    buffer.writeUInt8(this.#right_bytes);
  }

  // Method to read DNSHeader from DNSBuffer
  read(buffer: DNSBuffer) {
    this.#left_bytes = buffer.readUInt8();
    this.#right_bytes = buffer.readUInt8();
  }

  // Getters for various header fields
  get qr(): number {
    return (this.#left_bytes >> 7) & 0x01;
  }

  get opCode(): number {
    return (this.#left_bytes >> 3) & 0x0F;
  }

  get aa(): number {
    return (this.#left_bytes >> 2) & 0x01;
  }

  get tc(): number {
    return (this.#left_bytes >> 1) & 0x01;
  }

  get rd(): number {
    return this.#left_bytes & 0x01;
  }

  get ra(): number {
    return (this.#right_bytes) & 0x01;
  }

  get z(): number {
    return (this.#right_bytes) & 0x07;
  }

  get rCode(): number {
    return this.#right_bytes & 0x0F;
  }

  get qdCount(): number {
    return (this.#left_bytes) | this.#right_bytes;
  }

  get anCount(): number {
    return (this.#left_bytes) | this.#right_bytes;
  }

  get nsCount(): number {
    return (this.#left_bytes) | this.#right_bytes;
  }

  get arCount(): number {
    return (this.#left_bytes) | this.#right_bytes;
  }
}
