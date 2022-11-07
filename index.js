import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    const newUser = { username, avatar };

    users.push(newUser);

    res.status(200).send("OK");
});

app.get("/tweets", (req, res) => {
    console.log("deu bom");
});

app.listen(5000);
