"use strict";
exports.__esModule = true;
exports.DNSQuery = void 0;
var header_1 = require("./header");
var question_1 = require("./question");
var DNSQuery = /** @class */ (function () {
    function DNSQuery() {
        this.header = new header_1.DNSHeader();
        this.questions = [];
        this.answers = [];
        this.authorities = [];
        this.additionals = [];
    }
    /**
     * Write the DNS query to the buffer.
     * @param buffer The DNS buffer to write the query to.
     */
    DNSQuery.prototype.write = function (buffer) {
        this.header.write(buffer);
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            question.write(buffer);
        }
    };
    /**
     * Read the DNS query from the buffer.
     * @param buffer The DNS buffer to read the query from.
     */
    DNSQuery.prototype.read = function (buffer) {
        this.header.read(buffer);
        for (var i = 0; i < this.header.qdCount; i++) {
            var question = new question_1.DNSQuestion();
            question.read(buffer);
            this.questions.push(question);
        }
        for (var i = 0; i < this.header.anCount; i++) {
            var answer = {}; // Placeholder for actual resource record parsing
            this.answers.push(answer);
        }
        for (var i = 0; i < this.header.nsCount; i++) {
            var authority = {}; // Placeholder for actual resource record parsing
            this.authorities.push(authority);
        }
        for (var i = 0; i < this.header.arCount; i++) {
            var additional = {}; // Placeholder for actual resource record parsing
            this.additionals.push(additional);
        }
    };
    return DNSQuery;
}());
exports.DNSQuery = DNSQuery;
