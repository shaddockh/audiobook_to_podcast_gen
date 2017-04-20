"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var Podcast = require("podcast");
var fs = require("fs");
var dns_1 = require("dns");
var os_1 = require("os");
var defaultPort = 8080;
function getLocalAddress() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, error) {
                    dns_1.lookup(os_1.hostname(), function (err, add, fam) {
                        resolve(add);
                    });
                })];
        });
    });
}
function buildFeed(rootDir) {
    return __awaiter(this, void 0, void 0, function () {
        var podcastConfig, localAddress, feed, files, xmlFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Building feed for " + rootDir);
                    podcastConfig = JSON.parse(fs.readFileSync(rootDir + "/settings.json", "utf8")).podcast;
                    return [4 /*yield*/, getLocalAddress()];
                case 1:
                    localAddress = _a.sent();
                    podcastConfig.feed_url = podcastConfig.feed_url || "http://" + localAddress + ":" + defaultPort + "/" + rootDir;
                    feed = new Podcast(podcastConfig);
                    files = fs.readdirSync(rootDir).filter(function (fn) {
                        return fn.search(podcastConfig.fileRegex) >= 0;
                    });
                    files.forEach(function (fn) {
                        console.log("Processing file: " + fn + " ");
                        var itemConfig = {
                            title: fn,
                            guid: fn,
                            url: podcastConfig.feed_url + "/" + encodeURIComponent(fn),
                            description: fn,
                            date: new Date(),
                            enclosure: {
                                url: podcastConfig.feed_url + "/" + encodeURIComponent(fn),
                                file: rootDir + "/" + fn
                            }
                        };
                        feed.item(itemConfig);
                    });
                    xmlFile = fs.writeFileSync(rootDir + "/feed.xml", feed.xml("\t"));
                    console.log("Feed generation complete.");
                    return [2 /*return*/];
            }
        });
    });
}
if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " directoryName");
    process.exit(-1);
}
buildFeed(process.argv[2]);
//# sourceMappingURL=buildPodcast.js.map