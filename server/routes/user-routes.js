
import express from "express";

// This will help us connect to the database
import bcrypt from "bcrypt";

// This help convert the id from string to ObjectId for the _id.


import { insertUser, getUsers, getUserById, editUser } from "../controllers/user-controller.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all possible users.
router.get("/", getUsers);

// This section will help you create a new record.
router.post("/", insertUser);

router.get("/:id", getUserById);

// This section will help you update a record by id.
router.patch("/:id", editUser);

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

export default router;