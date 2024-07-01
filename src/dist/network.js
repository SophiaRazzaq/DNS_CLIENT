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
exports.DNSNetwork = void 0;
var dgram_1 = require("dgram");
var DNSNetwork = /** @class */ (function () {
    function DNSNetwork(server, port, timeout) {
        if (server === void 0) { server = '8.8.8.8'; }
        if (port === void 0) { port = 53; }
        if (timeout === void 0) { timeout = 5000; }
        this.server = server;
        this.port = port;
        this.timeout = timeout;
    }
    DNSNetwork.prototype.send = function (buffer) {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var client = dgram_1["default"].createSocket('udp4');
                        // Handle socket errors
                        client.on('error', function (err) {
                            console.error('Socket error:', err);
                            client.close();
                            reject(err);
                        });
                        // Set a timeout for the response
                        var timer = setTimeout(function () {
                            console.error('DNS query timed out');
                            client.close();
                            reject(new Error('DNS query timed out'));
                        }, _this.timeout);
                        //  client.send(packet, serverPort, serverAddress, (err) => {
                        // Send the DNS query
                        client.send(buffer, 0, buffer.length, _this.port, _this.server, function (err) {
                            if (err) {
                                clearTimeout(timer);
                                console.error('Error sending DNS query:', err);
                                //  client.close();
                                // reject(err);
                            }
                        });
                        // Handle incoming messages
                        client.on('message', function (msg) {
                            clearTimeout(timer);
                            client.close();
                            resolve(msg);
                        });
                        // Debugging logs
                        console.log("Sending DNS query to " + _this.server + ":" + _this.port + "...");
                        console.log('Query buffer:', buffer.toString('hex'));
                    })];
            });
        });
    };
    return DNSNetwork;
}());
exports.DNSNetwork = DNSNetwork;
