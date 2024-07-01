"use strict";
exports.__esModule = true;
exports.extractIp = void 0;
var header_1 = require("./header");
function extractIp(buffer) {
    var header = new header_1.DNSHeader();
    header.read(buffer); // Read the DNS header from the buffer
    console.log('Received DNS response:', header);
    var answerCount = header.anCount;
    console.log('Answer Count:', answerCount);
    var ipAddresses = [];
    if (answerCount > 0) {
        // Skip the question section
        while (buffer.readUInt8() !== 0)
            ;
        buffer.advanceOffset(4); // Skip QTYPE and QCLASS (2 bytes each)
        for (var i = 0; i < answerCount; i++) {
            // Read the answer section
            buffer.advanceOffset(2); // Skip Name (2 bytes)
            var type = buffer.readUInt16(); // Type (2 bytes)
            buffer.advanceOffset(4); // Skip Class (2 bytes) and TTL (4 bytes)
            var dataLength = buffer.readUInt16(); // Data length (2 bytes)
            console.log('Answer Type:', type);
            console.log('Data Length:', dataLength);
            if (type === 1 && dataLength === 4) {
                // Type A record and data length 4 (IPv4 address)
                var ipBytes = [];
                for (var j = 0; j < 4; j++) {
                    ipBytes.push(buffer.readUInt8());
                }
                var ipAddress = ipBytes.join('.');
                console.log('Extracted IPv4 address:', ipAddress);
                ipAddresses.push(ipAddress);
            }
            else if (type === 28 && dataLength === 16) {
                // Type AAAA record and data length 16 (IPv6 address)
                var ipBytes = [];
                for (var j = 0; j < 16; j++) {
                    ipBytes.push(buffer.readUInt8());
                }
                var ipAddress = ipBytes.map(function (byte) { return byte.toString(16).padStart(2, '0'); }).join(':');
                console.log('Extracted IPv6 address:', ipAddress);
                ipAddresses.push(ipAddress);
            }
            else if (type === 5) {
                // Type CNAME record
                var cname = buffer.readString();
                console.log('Extracted CNAME:', cname);
                ipAddresses.push(cname);
            }
            else {
                // Skip the data section for unrecognized types
                buffer.advanceOffset(dataLength);
            }
        }
    }
    return ipAddresses;
}
exports.extractIp = extractIp;
