const express = require("express");
const router = express.Router();

let bugs = [
	{
		id: 1,
		description: "Bug 1",
		userId: 1,
		resolved: true,
	},
	{
		id: 2,
		description: "Bug 2",
		userId: 1,
	},
	{
		id: 3,
		description: "Bug 3",
		userId: 2,
	},
	{
		id: 4,
		description: "Bug 4",
	},
];

router.get("/", (req, res) => {
	res.status(200).send(bugs);
});

router.post("/", (req, res) => {
	const bug = {
		id: Date.now(),
		resolved: false,
		description: req.body.description,
	};
	bugs.push(bug);
	res.status(201).json(bug);
});

// router.patch("/:id", (req, res) => {
// 	const { id } = req.params;
// 	const index = bugs.findIndex((bug) => bug.id === parseInt(id));
// 	bugs[index] = { ...bugs[index], ...res.body };
// 	res.status(200).json(bugs[index]);
// });

router.patch("/:bugId", (req, res) => {
	const { bugId } = req.params;
	const { userId } = req.body;
	const index = bugs.findIndex((bug) => bug.id === parseInt(bugId));
	bugs[index].userId = userId;
	res.status(200).json(bugs[index]);
});

module.exports = router;
