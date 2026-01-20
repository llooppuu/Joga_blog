const Express = require("express")
const mongodb = require('mongodb').MongoClient
const dotenv = require("dotenv")
dotenv.config()
const hbs = require("express-handlebars")
const path = require('path')

const app = Express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")
app.engine("hbs", hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/"
}))

app.use(Express.static("public"))

connectToDB = async (connectionString) => {
    try{
        const client = await mongodb.connect(connectionString)
        db = client.db()
        console.log("Connected to mongoDB")
        return db
    }
    catch(err){
        console.log(err)
    }
}

const user = process.env.MONGO_USER
const password = process.env.MONGO_PASSWORD
const host = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT
const dbname = process.env.MONGO_DATABASE
const port = 3001

let db, connectionString = `mongodb://${user}:${password}@${host}:${mongoPort}/${dbname}`;

(async () => {
    db = await connectToDB(connectionString);
})();

app.get("/", async (req, res) => {
    const articles = await (await db).collection('articles').find().toArray()
    res.render("index", {articles: articles})
})

app.get("/article/:slug", async (req, res) => {
    const article = await (await db).collection("articles").findOne({slug: req.params.slug})
    res.render("article", {article: article})
})

app.get("/author/:author_id", async(req, res) => {
    const articles = await (await db).collection("articles").find({author_id: req.params.author_id}).toArray()
    const author = await (await db).collection("authors").findOne({slug: req.params.author_id})
    res.render("author", {articles: articles, authorName: author.name})
})

app.listen(port, () => {
    console.log(`On http://localhost:${port}`)
})