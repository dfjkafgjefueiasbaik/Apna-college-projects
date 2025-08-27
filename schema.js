//server side validation of schema
const Joi = require('joi');

module.exports.listingSchema = Joi.object({//joi ka object create kr rhe hai jiska name listingSchema hai 
    listing : Joi.object({//create object name listing (it act as key for Joi object of listingSchema) jo k joi ka object hoga usme hm schema define kr rhe hai
        title : Joi.string().required(),//requied() means ye to must hai present hona he chaiye
        description : Joi.string().required(),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image:Joi.string().allow("",null)//image hai vo emoty bhi ho skti hai ya null value bhi jayegi agar hmne default set kr rkhi hogi to empty ke jagh aa jayegi 
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})