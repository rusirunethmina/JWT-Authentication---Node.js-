require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "rusiru",
    title: "post 1",
  },
  {
    username: "chathu",
    title: "post 2",
  },
];

app.post("/login", (req, res) => {
  // Authenticate user
  const username = req.body.username;
  const user = { name: username };
  const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accesstoken });
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username == req.user.name));
});

//like middlaware/checking the correct user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
