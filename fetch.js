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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndSave = exports.extractMetadata = exports.savePage = exports.fetchPage = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
const fetchPage = (inputUrl) => {
    return new Promise((resolve, reject) => {
        https_1.default
            .get(inputUrl, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => resolve(data));
        })
            .on("error", (err) => reject(new Error(err.message)));
    });
};
exports.fetchPage = fetchPage;
const savePage = (content, domain) => {
    const filename = `${process.cwd()}/${domain}.html`;
    fs_1.default.writeFileSync(filename, content);
    console.log(`Saved: ${filename}`);
};
exports.savePage = savePage;
const extractMetadata = (content) => {
    const numFetch = (content.match(/<a\s+[^>]*href=["']?[^"'>]+["']?[^>]*>/gi) || []).length;
    const images = (content.match(/<img\s+[^>]*src=["']?[^"'>]+["']?[^>]*>/gi) || []).length;
    return {
        numFetch,
        images,
        lastFetch: new Date().toISOString(),
    };
};
exports.extractMetadata = extractMetadata;
const fetchAndSave = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    for (const pageUrl of urls) {
        const domain = new url_1.URL(pageUrl).hostname;
        try {
            const content = yield (0, exports.fetchPage)(pageUrl);
            (0, exports.savePage)(content, domain);
            const metadata = (0, exports.extractMetadata)(content);
            console.log(`Site ${pageUrl}:`, '\n', metadata);
        }
        catch (err) {
            console.error(`Error fetching ${pageUrl}: ${err.message}`);
        }
    }
});
exports.fetchAndSave = fetchAndSave;
const argL = 3;
const args = process.argv.slice(argL);
if (args.length === 0) {
    console.log("Please provide at least one URL.");
}
else {
    (0, exports.fetchAndSave)(args);
}
