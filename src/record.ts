import { DNSBuffer } from './buffer';
// record / asnwer 
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

    read(buffer: DNSBuffer) {
        console.log("_______________________________________________________________");
        console.log("Offset before name:", buffer.getOffset());
        this.name = buffer.readDomainName();

        console.log("Offset before reading type and class:", buffer.getOffset());

        this.type = buffer.readUInt16();
        this.class = buffer.readUInt16();
        //console.log(this.type);
        console.log("Offset after reading type and class:", buffer.getOffset());

        this.ttl = buffer.readUInt32();
        this.len = buffer.readUInt16();

        console.log("Offset after reading TTL and length:", buffer.getOffset());

        this.rdata = buffer.readRData(this.type, this.len);

        console.log("Offset after reading RData:", buffer.getOffset());
        
        console.log("_______________________________________________________________");
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
