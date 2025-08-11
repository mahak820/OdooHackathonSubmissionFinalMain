const express = require("express")
require("dotenv").config()

const cors = require("cors")
const colors = require("colors")
const connectDb = require("./connect_db/db_config")


const PORT = process.env.PORT || 3000
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

//DB connection 
connectDb()

//Default Routes
app.get("/" , (req , res) => {

    res.json({
        msg : "TEMPLATE 1 IS RUNNING"
    })

})

//Authentication routes
app.use("/api/auth" , require("./routes/Authentication/authRoutes"))




app.listen(PORT , () => {
    console.log(`Server is running at port : ${PORT}`.bgCyan)
})