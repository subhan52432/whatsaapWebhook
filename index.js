const express = require('express')
const body_parser = require('body-parser')
const axios = require('axios')
require('dotenv').config()

const app = express().use(body_parser.json())

const token = process.env.TOKEN
const myToken = process.env.MYTOKEN

app.listen(process.env.PORT, () => { 
    console.log('webhook is listening')
})

app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"]
    let challenge = req.query["hub.challenge"]
    let token = req.query["hub.verify_token"]

    

    if (mode && token) {
        if (mode === "subscribe" && token === myToken) {
            res.status(200).send(challenge)
        } else {
            res.status(403)
        }
    }
})  

app.post('/webhook', (req, res) => {
    let body_param = req.body
    console.log(JSON.stringify(body_param, null, 2))

    if (body_param.object) {
        console.log("inside body Param")
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            const phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id
            const from = body_param.entry[0].changes[0].value.messages[0].from
            const msg_body = body_param.entry[0].changes[0].value.messages[0].text.body

            console.log("phone no "+ phone_no_id)
            console.log("from "+ from)
            console.log("body param "+ msg_body)
            axios({
                method: "post",
                url:"https://graph.facebook.com/v15.0/110385328550555/messages",
                headers: {
                    "Authorization": "Bearer EAAJRJLa6zZC4BAFCdNlCcVZC3J6aXkiufFDFyYX5fl4DnpWnkgILXNz2EqCMSOIVCxYXTsaUAymtHC3rduAdWq6kfv00GT1rcCSo5CwCpfdcNgMOdCjfm8Mq67aEz3wZB5tpdnPjeexmlSloJQEwppz1hBZBGnSQQzYZBIlMOzu5AF1nNOM8MHONG0iDguiiu8B7isfNtT3uhmh09ZC7DQ",
                    "Content-type": "application/json"
                    
                },
                data:{
                    messaging_product:"whatsaap",
                    to:from,
                    text:{
                        body:"Hi I am Subhan, Your msg is "+msg_body 
                    }
                }
                
            })
            .then(function(response){
                console.log(response);
            })
            .catch(function (error) {
                console.log("This is error "+error);
            })
            
//             axios.post(
//                 "https://graph.facebook.com/v15.0/110385328550555/messages",
//                 {
//                     messaging_product: "whatsaap",
//                     to: from,
//                     text: {
//                         body: "Hi I am Subhan, Your msg is " + msg_body
//                     }
//                 },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     params: { access_token: token }, //Add userID as a param 
//                 })
//                 .then(response => console.log("repsonse", response.status))
//                 .catch(function (error) {
//                     console.log("This is error " + error);
//                 })
            
            res.sendStatus(200)
        } else{
            res.sendStatus(404)
        }
    }
})

app.get("/",(req,res)=>{
    res.status(200).send("Hello this is a webhook setup")
})
