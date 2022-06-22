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

function read(req, res, next) {
    res.json({ data: res.locals.order });
}

function update(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    res.locals.order = {
        id: res.locals.order.id,
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        dishes: dishes,
        status: status,
    };
    res.json({ data: res.locals.order });
}

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

function validateOrderId(req, res, next){
    const {orderId} = req.params;
    const foundOrder = orders.find(order => order.id === orderId);

    if(foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order Id not found: ${orderId}`
    })
}

function validateStatus(req, res, next){
    const {orderId} = req.params;
    const {data: {id, status}={}} = req.body;

    let message;
    if(id && id !== orderId)
        message = `Order id does not match route id. Order: ${id}, Route: ${orderId}.`
    else if(!status || status === "" || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery"))
        message = "Order must have a status of pending, preparing, or out-for-delivery, delivered";
    else if(status === "delivered")
        message = "A delivered order cannot be changed";
    
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
    read: [validateOrderId, read],
    update: [validateOrder, validatesOrderId, validateStatus, update],
}