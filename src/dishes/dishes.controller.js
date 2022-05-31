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
    const dishId = req.params.id;
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
    const foundDish = res.locals.dish;
    res.json({ data: foundDish});
};

const update = (req, res, next) => {
    
};

module.exports = {
    list,
}
