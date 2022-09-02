import axios from "axios";

//used to import http method
export default axios.create({
  baseURL: "https://ap-southeast-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-review-kbvvo/service/restaurant/incoming_webhook/",
  headers: {
    "Content-type": "application/json"
  }
});

