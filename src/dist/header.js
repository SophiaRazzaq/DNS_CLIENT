"use strict";
exports.__esModule = true;
exports.DNSHeader = void 0;
/**
 * DNSHeader represents the DNS header fields and provides methods
 * to read from and write to a DNS buffer.
 */
var DNSHeader = /** @class */ (function () {
    function DNSHeader() {
        this.id = 0;
        this.flags = 0;
        this.qdCount = 0;
        this.anCount = 0;
        this.nsCount = 0;
        this.arCount = 0;
    }
    /**
     * Write the DNS header fields to the buffer.
     * @param buffer The DNS buffer to write the header fields to.
     */
    DNSHeader.prototype.write = function (buffer) {
        buffer.writeUInt16(this.id);
        buffer.writeUInt16(this.flags);
        buffer.writeUInt16(this.qdCount);
        buffer.writeUInt16(this.anCount);
        buffer.writeUInt16(this.nsCount);
        buffer.writeUInt16(this.arCount);
    };
    /**
     * Read the DNS header fields from the buffer.
     * @param buffer The DNS buffer to read the header fields from.
     */
    DNSHeader.prototype.read = function (buffer) {
        this.id = buffer.readUInt16();
        this.flags = buffer.readUInt16();
        this.qdCount = buffer.readUInt16();
        this.anCount = buffer.readUInt16();
        this.nsCount = buffer.readUInt16();
        this.arCount = buffer.readUInt16();
    };
    Object.defineProperty(DNSHeader.prototype, "qr", {
        /**
         * Extracts the QR bit from the flags.
         */
        get: function () {
            return (this.flags >> 15) & 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "opCode", {
        /**
         * Extracts the opcode from the flags.
         */
        get: function () {
            return (this.flags >> 11) & 15;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "aa", {
        /**
         * Extracts the AA bit from the flags.
         */
        get: function () {
            return (this.flags >> 10) & 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "tc", {
        /**
         * Extracts the TC bit from the flags.
         */
        get: function () {
            return (this.flags >> 9) & 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "rd", {
        /**
         * Extracts the RD bit from the flags.
         */
        get: function () {
            return (this.flags >> 8) & 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "ra", {
        /**
         * Extracts the RA bit from the flags.
         */
        get: function () {
            return (this.flags >> 7) & 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "z", {
        /**
         * Extracts the Z bits from the flags.
         */
        get: function () {
            return (this.flags >> 4) & 7;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNSHeader.prototype, "rcode", {
        /**
         * Extracts the RCODE from the flags.
         */
        get: function () {
            return this.flags & 15;
        },
        enumerable: false,
        configurable: true
    });
    return DNSHeader;
}());
exports.DNSHeader = DNSHeader;
