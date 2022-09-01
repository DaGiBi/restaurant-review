import mongodb from "mongodb"
const Objectid = mongodb.ObjectId
let restaurants

export default class RestaurantsDAO{
    static async injectDB(conn){ // connnet to db using injectDB bila server start
        if (restaurants){
            return
        }
        try{
            restaurants = await conn.db(process.env.RESTREVIEW_NS).collection("restaurants") //to select to specific data in cluser which is restaurant. 
        } catch(e){
            console.error(
                `enable to establish connection in the DAO ${e}`,
            )
        }
    }

    // method to retrieve data
    static async getRestaurants({
        filters = null, //option to filter out data
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query // 
        if (filters){
            if ("name" in filters){
                query = { $text: { $search: filters["name"] } }
            } else if ( "cuisine" in filters){
                query = { "cuisine": { $eq: filters["cuisine"] } } //iff cuisine equal to filter of  cuisine
            }else if ( "zipcode" in filters){
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }  
        
        let cursor

        try {
            cursor = await restaurants // find all restaurant on db depending on query
                .find(query)
        } catch (e){
            console.error(`unable to issue find command ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
        // limit how much restaurang and skip on which page
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantList, totalNumRestaurants}
        } catch (e){
            console.error(
                `unable to convert to array or problem counting document , ${e}`
            )

            return { restaurantsList: [], totalNumRestaurants: 0}
        }
    }

    static async getRestaurantByID(id) {
        try {
          const pipeline = [    //create pipeline to match diffrenect cluster
            {
                $match: {
                    _id: new Objectid(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",//match variable id with db variable 
                          },
                          pipeline: [ //pipeline to match restaurant id
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$restaurant_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
          return await restaurants.aggregate(pipeline).next() // cluck the pipeline tgether
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
      }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}