"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var buffer_1 = require("./buffer");
var header_1 = require("./header");
var question_1 = require("./question");
var query_1 = require("./query");
var network_1 = require("./network");
var fileReader_1 = require("./fileReader");
var cli_1 = require("./cli");
var extractIp_1 = require("./extractIp");
var fs = require("fs");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, domainName, queryType, source, filePath, fileBuffer, header, question, query, dnsNetwork, queryBuffer, responseBuffer, responseQuery, responseTable, responseDNSBuffer, ipAddress, output, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domainName = '';
                    queryType = '';
                    console.log("Welcome to the DNS Query Tool!");
                    return [4 /*yield*/, cli_1.CLI.askQuestion('Read from file or CLI? (file/cli): ')];
                case 1:
                    source = _a.sent();
                    if (!(source.toLowerCase() === 'file')) return [3 /*break*/, 3];
                    return [4 /*yield*/, cli_1.CLI.askQuestion('Enter the file path: ')];
                case 2:
                    filePath = _a.sent();
                    fileBuffer = fileReader_1.FileReader.readFile(filePath);
                    console.log("\nRead successfully from file:", fileBuffer);
                    buffer = new buffer_1.DNSBuffer(fileBuffer);
                    console.log("Buffer content:", buffer.getBuffer().toString('hex'));
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, cli_1.CLI.askQuestion('Enter the domain name: ')];
                case 4:
                    // Read from CLI input
                    domainName = _a.sent();
                    return [4 /*yield*/, cli_1.CLI.askQuestion('Enter the query type (A/AAAA/CNAME): ')];
                case 5:
                    queryType = _a.sent();
                    buffer = new buffer_1.DNSBuffer();
                    header = new header_1.DNSHeader();
                    header.qdCount = 1;
                    question = new question_1.DNSQuestion(domainName, queryType === 'A' ? 1 : queryType === 'AAAA' ? 28 : 5);
                    query = new query_1.DNSQuery();
                    query.header = header;
                    query.questions.push(question);
                    query.write(buffer);
                    console.log("\nQuery written to buffer:", buffer.getBuffer().toString('hex'));
                    _a.label = 6;
                case 6:
                    dnsNetwork = new network_1.DNSNetwork();
                    console.log("\nDNS network initialized");
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    queryBuffer = buffer.getBuffer();
                    console.log("Query buffer to send:", queryBuffer.toString('hex'));
                    return [4 /*yield*/, dnsNetwork.send(queryBuffer)];
                case 8:
                    responseBuffer = _a.sent();
                    console.log("Response buffer received:", responseBuffer.toString('hex'));
                    buffer.setBuffer(responseBuffer);
                    responseQuery = new query_1.DNSQuery();
                    responseQuery.read(buffer);
                    responseTable = {
                        "Header": {
                            "Request ID": responseQuery.header.id,
                            "Flags": responseQuery.header.flags,
                            "QR": responseQuery.header.qr,
                            "OPCode": responseQuery.header.opCode,
                            "AA": responseQuery.header.aa,
                            "TC": responseQuery.header.tc,
                            "RD": responseQuery.header.rd,
                            "RA": responseQuery.header.ra,
                            "Z": responseQuery.header.z,
                            "RCODE": responseQuery.header.rcode
                        },
                        "Question": {
                            "Questions Asked": responseQuery.questions.length,
                            "Answer Count": responseQuery.answers.length,
                            "Authority Count": responseQuery.authorities.length,
                            "Additional Count": responseQuery.additionals.length
                        }
                    };
                    console.log('\nReceived response:');
                    console.table(responseTable);
                    responseDNSBuffer = new buffer_1.DNSBuffer(responseBuffer);
                    ipAddress = extractIp_1.extractIp(responseDNSBuffer);
                    output = "\nReceived response:\nHeader:\n  Request ID: " + responseQuery.header.id + "\n  Flags: " + responseQuery.header.flags + "\n  QR: " + responseQuery.header.qr + "\n  OPCode: " + responseQuery.header.opCode + "\n  AA: " + responseQuery.header.aa + "\n  TC: " + responseQuery.header.tc + "\n  RD: " + responseQuery.header.rd + "\n  RA: " + responseQuery.header.ra + "\n  Z: " + responseQuery.header.z + "\n  RCODE: " + responseQuery.header.rcode + "\n\nQuestion:\n  Domain Name: " + domainName + "\n  Query Type: " + queryType + "\n  Questions Asked: " + responseQuery.questions.length + "\n  Answer Count: " + responseQuery.answers.length + "\n  Authority Count: " + responseQuery.authorities.length + "\n  Additional Count: " + responseQuery.additionals.length + "\n\nExtracted IP address: " + (ipAddress ? ipAddress : 'No IP address found') + "\n    ";
                    fs.writeFileSync('output.txt', output);
                    console.log('\nResponse details saved to output.txt');
                    if (ipAddress) {
                        console.log('\nExtracted IP address:', ipAddress);
                    }
                    else {
                        console.log('\nNo IP address found in the response.');
                    }
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error('\nFailed to send DNS query:', error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main();
