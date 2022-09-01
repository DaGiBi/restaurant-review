import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn){
        if(reviews){
            return
        }
        try{
            reviews = await conn.db(process.env.RESTREVIEW_NS).collection("reviews") //to select to specific data in cluser which is restaurant. 
        }catch(e){
            console.error(
                `enable to establish connection in the userDAO ${e}`,
            )
        }
    }

    static async addReview (restaurantId, user, review, date){
        try {
            const reviewDoc = { name: user.name,
                            user_id: user._id,
                            date: date,
                            text: review,
                            restaurant_id: ObjectId(restaurantId),
                        }
            //insert 1 object into mongodb
            return await reviews.insertOne(reviewDoc)
        } catch (e){
            console.error(`unable to post review ${e}`)
            return {error:e}
        }   
    }

    static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId)},
        { $set: { text: text, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne(
                { _id: ObjectId(reviewId),
                 user_id: userId,
                }
            )
            return deleteResponse
        } catch (e){
            console.error(`unable to delete review ${e}`)
            return {error:e}
        } 

    }
        
}