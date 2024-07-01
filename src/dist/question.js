"use strict";
exports.__esModule = true;
exports.DNSQuestion = void 0;
var DNSQuestion = /** @class */ (function () {
    function DNSQuestion(name, type, qclass) {
        if (name === void 0) { name = ''; }
        if (type === void 0) { type = 1; }
        if (qclass === void 0) { qclass = 1; }
        this.name = name;
        this.type = type;
        this.qclass = qclass;
    }
    DNSQuestion.prototype.write = function (buffer) {
        buffer.writeString(this.name);
        buffer.writeUInt16(this.type);
        buffer.writeUInt16(this.qclass);
    };
    DNSQuestion.prototype.read = function (buffer) {
        this.name = buffer.readString();
        this.type = buffer.readUInt16();
        this.qclass = buffer.readUInt16();
    };
    return DNSQuestion;
}());
exports.DNSQuestion = DNSQuestion;
