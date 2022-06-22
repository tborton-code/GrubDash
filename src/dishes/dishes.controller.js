const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res, next) => {
    res.json({data: dishes});
};

const create = (req, res, next) => {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
};

function dishExists(req, res, next){
    const dishId = req.params.dishId;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if (foundDish){
        res.locals.dish = foundDish;
        return next();
    } next({
        status: 404,
        message: `Dish Id not found: ${dishId}`
    })
};

const read = (req, res, next) => {
    res.json({ data: res.locals.dish});
};

const update = (req, res, next) => {
    const foundDish = res.locals.dish;
    console.log("here", req.body)
    const { data: { name, description, price, image_url } = {} } = req.body;
    foundDish.name = name;
    foundDish.description = description;

    res.status(200).json({ data: foundDish });
};

function dishHasRequiredFields(req, res, next){
    const REQUIRED_FIELDS = ["name", "description", "image_url", "price"]
    const {data = {}} = req.body
    for (const field of REQUIRED_FIELDS) {
        if (!req.body.data[field]){
            return next({
                status: 400,
                message: `Field "${field}" is missing.`
            })
        };
    };
    next();
}

function priceIsValid(req, res, next){
    const dishPrice = req.body.data.price;
    if(typeof dishPrice !="number" || dishPrice <= 0){
        return next({
            status: 400,
            message: "Dish must have a price that is greater than 0"
        });
    } next();
}

module.exports = {
    list,
    create: [dishHasRequiredFields, priceIsValid, create],
    read: [dishExists, read],
    update: [dishHasRequiredFields, dishExists, priceIsValid, update],
}
