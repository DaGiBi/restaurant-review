import ReviewsDAO from "../dao/ReviewsDAO.js"

export default class ReviewsController {
    static async apiPostReview(req, res, next){

        try {
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()
            // go to review dao
            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )

            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error : e.message})
        }
    }

    static async apiUpdateReview(req, res, next){
        try{
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                text,
                date,
            )
                // if not exitt throw error
            var { error } = reviewResponse
            if(error){
                res.status(400).json({error})
            }

            if (reviewResponse.modifiedCount === 0)
                throw new Error(
                    "Unable to update review sss",
                )

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req,res,next){
        try{
            const review_id = req.query.id
            const userId = req.body.user_id
            console.groupCollapsed(userId)
            const reviewResponse = await ReviewsDAO.deleteReview(
                review_id,
                userId,
            )
            res.json({status : "success"})

        } catch (e){
            res.status(500).json({error: e.message})
        }
    }
}