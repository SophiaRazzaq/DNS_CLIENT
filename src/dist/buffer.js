"use strict";
exports.__esModule = true;
exports.DNSBuffer = void 0;
var DNSBuffer = /** @class */ (function () {
    function DNSBuffer(buffer) {
        this.buffer = buffer || Buffer.alloc(512);
        this.offset = buffer ? buffer.length : 0;
    }
    DNSBuffer.prototype.writeUInt16 = function (value) {
        this.buffer[this.offset++] = value >> 8;
        this.buffer[this.offset++] = value & 0xFF;
    };
    DNSBuffer.prototype.getOffset = function () {
        return this.offset;
    };
    DNSBuffer.prototype.setOffset = function (offset) {
        this.offset = offset;
    };
    DNSBuffer.prototype.readUInt16 = function () {
        var value = (this.buffer[this.offset] << 8) | this.buffer[this.offset + 1];
        this.offset += 2;
        return value;
    };
    DNSBuffer.prototype.writeUInt32 = function (value) {
        this.buffer[this.offset++] = (value >> 24) & 0xFF;
        this.buffer[this.offset++] = (value >> 16) & 0xFF;
        this.buffer[this.offset++] = (value >> 8) & 0xFF;
        this.buffer[this.offset++] = value & 0xFF;
    };
    DNSBuffer.prototype.readUInt32 = function () {
        var value = (this.buffer[this.offset] << 24) | (this.buffer[this.offset + 1] << 16) | (this.buffer[this.offset + 2] << 8) | this.buffer[this.offset + 3];
        this.offset += 4;
        return value;
    };
    DNSBuffer.prototype.writeUInt8 = function (value) {
        this.buffer[this.offset++] = value;
    };
    DNSBuffer.prototype.readUInt8 = function () {
        return this.buffer[this.offset++];
    };
    DNSBuffer.prototype.writeString = function (value) {
        var parts = value.split('.');
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            this.writeUInt8(part.length);
            for (var i = 0; i < part.length; i++) {
                this.writeUInt8(part.charCodeAt(i));
            }
        }
        this.writeUInt8(0);
    };
    DNSBuffer.prototype.readString = function () {
        var result = '';
        var length = this.readUInt8();
        while (length > 0) {
            if (result.length > 0) {
                result += '.';
            }
            result += this.buffer.toString('ascii', this.offset, this.offset + length);
            this.offset += length;
            length = this.readUInt8();
        }
        return result;
    };
    DNSBuffer.prototype.getBuffer = function () {
        return this.buffer.slice(0, this.offset);
    };
    DNSBuffer.prototype.setBuffer = function (buffer) {
        this.buffer = buffer;
        this.offset = 0;
    };
    DNSBuffer.prototype.advanceOffset = function (bytes) {
        this.offset += bytes;
    };
    return DNSBuffer;
}());
exports.DNSBuffer = DNSBuffer;
