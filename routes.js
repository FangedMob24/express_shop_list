const express = require("express");
const router = new express.Router();
const itemsDb = require("./fakeDb.js")

// get /items (get the list)
router.get('/', (req, res) => {
    return res.status(200).json(itemsDb)
})

// post /items (add to the list)
router.post('/', (req, res) => {
    const { name, price } = req.body

    if (!name || price === undefined) {
        return res.status(404).json({ error: "Name and price are required." });
    }

    itemsDb.push({ name, price });
    return res.status(201).json({"added": req.body});

})

// get /items/:name (get an items from the list)
router.get('/:name', (req, res) => {

    const { name } = req.params;

    answer = itemsDb.find(i => i.name === name);
    if(answer) {
        return res.status(200).json(answer);
    }
    else {
        return res.status(404).json({ message: "Not Found" });
    }
    
})

// patch /items/:name modifiy a single item
router.patch('/:name', (req, res) => {
    const { name } = req.params;

    answer = itemsDb.find(i => i.name === name);
    if(answer) {

        answer.name = req.body.name || answer.name;
        answer.price = req.body.price || answer.price;
        return res.json({"updated": {answer}});
    }
    else {
        return res.status(404).json({"message": "not found"});
    }
})

//delete /items/:name (delete a single item)
router.delete('/:name', (req, res) => {
    const { name } = req.params;

    answer = itemsDb.findIndex(i => i.name === name);
    if(answer === -1) {
        return res.status(404).json({ message: "not found"});
    }

    itemsDb.splice(answer, 1);
    return res.json({ message: "Deleted"})
})

module.exports = router;