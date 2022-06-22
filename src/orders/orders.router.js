const router = require("express").Router();

// TODO: Implement the /orders routes needed to make the tests pass

router
    .route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete);

router
    .route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;
