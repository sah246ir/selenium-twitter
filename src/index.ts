 
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers"; 
import { config } from "dotenv";
import { runSelenium } from "./selenium";
import { MongoClient, ServerApiVersion } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
config()
const app = express() 
app.set('views', process.env.VIEWS);
app.set('view engine', 'ejs');
export const clients = (process.env.CLIENTS || "").split(",")

app.use(cors({
    origin: clients,// array of client urls
    credentials: true
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })) 
app.use(corsHeaders);

const uri = "mongodb://127.0.0.1:27017/test";
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);
client.connect().then(()=>{
    console.log("data")
})
app.post("/run",async(req,res)=>{
    try{
        const trends = await runSelenium()
        const rec:Record<string,string> = {}
        trends.forEach((t,i)=>{
            rec["trend"+(i+1)] = t
        })
        console.log(trends) 
        const doc = await client.db().collection("trends").insertOne({
            ...rec,
            timestamp:new Date(),
            ip:"",
            selenium_script_id: uuidv4() 
        })
        res.status(200).redirect("/") 
    }catch(e){
        console.log(e)
        res.status(500).send("An error occurred while fetching trends.");

    }
})

app.get("/", async (req, res) => {
    try {
        // Fetch the most recent record
        const record = await client.db().collection("trends").find().sort({ "timestamp": -1 }).limit(1).toArray();

        // Define default trends
        const data:any = record.pop() || {};
        const trends = {
            timestamp: data.timestamp || "N/A",
            selenium_script_id: data.selenium_script_id || "N/A",
            trend1: data.trend1 || "No data available",
            trend2: data.trend2 || "No data available",
            trend3: data.trend3 || "No data available",
            trend4: data.trend4 || "No data available",
            trend5: data.trend5 || "No data available",
        };

        // Render the template with default-safe data
        res.status(200).render("index", trends);
    } catch (error) {
        console.error("Error fetching trends:", error);
        res.status(500).send("An error occurred while fetching trends.");
    }
});

 

// server listen
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:"+process.env.PORT)
})

 
 


 
