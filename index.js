import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const newUser = { username, avatar };

    users.push(newUser);

    res.status(200).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    if (!username || !tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const newTweet = { username, tweet };

    tweets.push(newTweet);

    res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
    const lastTenTweets = tweets
        .slice(tweets.length >= 10 ? tweets.length - 10 : 0)
        .map((tweet) => ({
            ...tweet,
            avatar: users.find((user) => user.username === tweet.username)
                .avatar,
        }));

    res.status(200).send(lastTenTweets);
});

app.listen(5000);
