const { builtinModules } = require("module");
const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


const list = (req, res, next) => {
    res.json({ data: orders });
}

const create = (req, res, next) => {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status: status ? status : "pending",
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
};

function validateOrder(req, res, next){
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    
    let message;
    if(!deliverTo || deliverTo ==="")
        message = "Order must include a deliverTo";
    else if(!mobileNumber || mobileNumber === "")
        message = "Order must include a mobileNumber";
    else if(!dishes)
        message = "Order must include a dish";
    else if(!Array.isArray(dishes) || dishes.length === 0)
        message = "Order must include at least one dish";
    else {
        for (const dish of dishes){
            if(!dish.quantity || dish.quantity <= 0 ||!Number.isInteger(dish.quantity))
                message = `Dish ${dish} must have a quantity that is an integer greater than 0`;
        }
    }
    if(message){
        return next({
            status: 400,
            message: message,
        })
        next();
    }
}

module.exports = {
    list,
    create: [validateOrder, create],
}