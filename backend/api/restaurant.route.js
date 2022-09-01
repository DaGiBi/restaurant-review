import express from "express";
import RestaurantController from "./restaurant.controller.js"
import ReviewsCtrl from "./review.controller.js"

const router =  express.Router()

router.route("/").get(RestaurantController.apiGetRestaurants)
router.route("/id/:id").get(RestaurantController.apiGetRestaurantById) //get param
router.route("/cuisines").get(RestaurantController.apiGetRestaurantCuisines)

router
    .route("/review") //multiline route
    .post(ReviewsCtrl.apiPostReview) // post body
    .put(ReviewsCtrl.apiUpdateReview) //put body
    .delete(ReviewsCtrl.apiDeleteReview) //delete body and query
export default router