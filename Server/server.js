const express = require("express")
require("dotenv").config()
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const cors = require("cors")
const colors = require("colors")
const connectDb = require("./connect_db/db_config")


const PORT = process.env.PORT || 3000
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(notFound);
app.use(errorHandler);

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
// venue routes
app.use("/api/venue" , require("./routes/venueRoutes"))



app.listen(PORT , () => {
    console.log(`Server is running at port : ${PORT}`.bgCyan)
})