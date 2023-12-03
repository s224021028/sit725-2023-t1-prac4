var express = require("express")
var app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb://localhost:27017/operations";
app.use(express.static(__dirname + "/public"))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
var port = process.env.port || 3000;
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
let data

async function connectDatabse()
{
    try {
        await client.connect();
        data = client.db().collection("Expressions");
    } catch (exception) {
        console.error(exception);
    }
}

app.get("/history", async (req, res) => {
    var result = await getData()
    console.log(result)
    res.json({data: result})
})

app.post("/result", (req, res) => {
    console.log(req.body)
    var operation = req.body.operation
    var numA = parseFloat(req.body.numA)
    var numB = parseFloat(req.body.numB)
    var showDecimal = req.body.showDecimal
    var ans = calculate(operation, numA, numB, showDecimal)
    storeData(operation, numA, numB, ans, (err, result) => {
        if(err)
            console.error(err)
        else
            res.json({data: result})
        })
})

function calculate(operation, numA, numB, showDecimal)
{
    var ans = 0
    if (operation == "add")
    {
        ans = numA + numB
    }
    else if (operation == "sub")
    {
        ans = numA - numB
    }
    else if (operation == "mul")
    {
        ans = numA * numB
    }
    else if (operation == "div")
    {
        ans = numA / numB
    }
    else if (operation == "mod")
    {
        ans = numA % numB
    }
    else if (operation == "pow")
    {
        ans = numA ** numB
    }
    if (showDecimal == "true")
        return ans
    else
        return Math.round(ans)
}

async function getData()
{
    try {
        return await data.find({}).toArray()
    }
    catch (error) {
        console.error(error);
    }
}

function storeData(operation, numA, numB, ans, callback)
{
    var expression = {operator: operation, numberA: numA, numberB: numB, result: ans}
    data.insertOne(expression, callback)
}

app.listen(port, () => {
    console.log(port)
    connectDatabse()
})