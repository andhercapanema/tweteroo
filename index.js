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

    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;

    if (!user || !tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const newTweet = { username: user, tweet };

    tweets.push(newTweet);

    res.status(201).send("OK");
});

function filterDisplayedTweets(numberedPage) {
    const oldestTweetToDisplay = tweets.length - numberedPage * 10;
    const newestTweetToDisplay = tweets.length - (numberedPage - 1) * 10;

    return tweets.slice(
        oldestTweetToDisplay >= 0 ? oldestTweetToDisplay : 0,
        newestTweetToDisplay
    );
}

function getAvatars(displayedTweets) {
    return displayedTweets.map((tweet) => ({
        ...tweet,
        avatar: users.find((user) => user.username === tweet.username).avatar,
    }));
}

app.get("/tweets", (req, res) => {
    const page = req.query.page || 1;
    const numberedPage = Number(page);
    const hasEnoughTweetsToShow = (numberedPage - 1) * 10 < tweets.length;

    if (
        numberedPage < 1 ||
        isNaN(page) ||
        (numberedPage !== 1 && !hasEnoughTweetsToShow)
    ) {
        res.status(400).send("Informe uma página válida!");
        return;
    }

    const displayedTweets = filterDisplayedTweets(numberedPage);
    const tweetsWithAvatars = getAvatars(displayedTweets);

    res.status(200).send(tweetsWithAvatars);
});

app.get("/tweets/:filteredUser", (req, res) => {
    const { filteredUser } = req.params;
    const tweetsFromFilteredUser = tweets.filter(
        (tweet) => tweet.username === filteredUser
    );

    res.status(200).send(tweetsFromFilteredUser);
});

app.listen(5000);
