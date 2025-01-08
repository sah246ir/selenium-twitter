"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_headers_1 = require("./Middlewares/cors-headers");
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const puppeteer_1 = require("./puppeteer");
const utils_1 = require("./utils");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.set('views', process.env.VIEWS);
app.set('view engine', 'ejs');
exports.clients = (process.env.CLIENTS || "").split(",");
app.use((0, cors_1.default)({
    origin: exports.clients,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_headers_1.corsHeaders);
const uri = "mongodb://127.0.0.1:27017/test";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
client.connect().then(() => {
    console.log("data");
});
app.post("/run", async (req, res) => {
    try {
        // const trends = await runSelenium()
        const trends = await (0, puppeteer_1.runPuppeteer)();
        if (!trends) {
            return res.status(400).redirect("/");
        }
        const rec = {};
        trends?.trends.forEach((t, i) => {
            rec["trend" + (i + 1)] = t;
        });
        console.log(trends);
        const doc = await client.db().collection("trends").insertOne({
            ...rec,
            timestamp: new Date(),
            ip: trends?.ip,
            selenium_script_id: (0, uuid_1.v4)()
        });
        res.status(200).redirect("/");
    }
    catch (e) {
        console.log(e);
        res.status(500).redirect("/");
    }
});
app.get("/", async (req, res) => {
    try {
        // Fetch the most recent record
        const record = await client.db().collection("trends").find().sort({ "timestamp": -1 }).limit(1).toArray();
        // Define default trends
        const data = record.pop() || {};
        const trend = {
            timestamp: (0, utils_1.formatTimestamp)(data.timestamp),
            selenium_script_id: data.selenium_script_id || "N/A",
            trend1: data.trend1 || "No data available",
            trend2: data.trend2 || "No data available",
            trend3: data.trend3 || "No data available",
            trend4: data.trend4 || "No data available",
            trend5: data.trend5 || "No data available",
            ip: data.ip || "No data available"
        };
        // Render the template with default-safe data
        res.status(200).render("index", { trend, server: process.env.SERVER_URI });
    }
    catch (error) {
        console.error("Error fetching trends:", error);
        res.status(500).send("An error occurred while fetching trends.");
    }
});
// server listen
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:" + process.env.PORT);
});
