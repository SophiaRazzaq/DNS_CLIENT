import { DNSBuffer } from './buffer';

export class DNSAnswer {
    name: string;
    type: number;
    class: number;
    ttl: number;
    len: number;
    rdata: string;

    constructor() {
        this.name = '';
        this.type = 0;
        this.class = 0;
        this.ttl = 0;
        this.len = 0;
        this.rdata = '';
    }

    write(buffer: DNSBuffer) {
        buffer.writeString(this.name);
        buffer.writeUInt16(this.type);
        buffer.writeUInt16(this.class);
        buffer.writeUInt32(this.ttl);
        buffer.writeUInt16(this.len);
        buffer.writeRData(this.rdata, this.type, this.len); 
    }

    read(buffer: DNSBuffer) {
        this.name = buffer.readDomainName();
        this.type = buffer.readUInt16();
        this.class = buffer.readUInt16();
        this.ttl = buffer.readUInt32();
        this.len = buffer.readUInt16();
        this.rdata = buffer.readRData(this.type, this.len);
    }

    getName(): string {
        return this.name;
    }

    getType(): number {
        return this.type;
    }

    getClass(): number {
        return this.class;
    }

    getTTL(): number {
        return this.ttl;
    }

    getRdlength(): number {
        return this.len;
    }

    getRdata(): string {
        return this.rdata;
    }
}
