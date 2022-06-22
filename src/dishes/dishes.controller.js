const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

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

function validateDishDetails(req, res, next){
    const { data: { name, description, price, image_url } = {} } = req.body;
    let message;

    if(!name || name==="")
        message = "Dish must include a name";
    else if(!description || description==="")
        message = "Dish must include a description";
    else if(!price || price==="")
        message = "Dish must include a price";
    else if(price <= 0 || !Number.isInteger(price))
        message = "Dish must have a price that is an integer greater than 0";
    else if(!image_url || image_url==="")
        message = "Dish must include an image url";

    if(message){
        return next({
            status: 400,
            message: message,
        })
    }
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
    create: [validateDishDetails, priceIsValid, create],
    read: [dishExists, read],
    update: [validateDishDetails, dishExists, priceIsValid, update],
}
