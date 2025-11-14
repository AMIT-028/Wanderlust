const Joi = require('joi');

const listingschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({url: Joi.string().allow(''),}).default({ url: '' }),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required(),
});

const reviewschema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

module.exports = { listingschema, reviewschema };
