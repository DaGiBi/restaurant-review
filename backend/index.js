import app from "./server.js"
import mondodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantDAO.js"
import ReviewsDAO from "./dao/ReviewsDAO.js"

dotenv.config()
const Mongoclient = mondodb.MongoClient

const port = process.env.PORT || 8000 // access the port
 
Mongoclient.connect(
    process.env.RESTREVIEW_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true}
)

.catch(err => {
    console.error(err.stack)
    process.exit(1)
})

.then(async (client,conn) => {
    await RestaurantsDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)
    app.listen(port, () => { // open server
        console.log(`listening on port ${port}`)
    })
})