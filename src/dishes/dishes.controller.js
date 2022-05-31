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
};

const read = (req, res, next) => {
};

const update = (req, res, next) => {
};

module.exports = {
    list,
}
