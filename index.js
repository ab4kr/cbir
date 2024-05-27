const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const port = 5000;
const app = express();

// DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DB_PASSWORD",
  database: "DB_NAME",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Database connection successful");
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "bVSYjJaDdNw0RDgPZJ7i0c1duOqpuMx0",
    resave: false,
    saveUnitialized: true,
  })
);

// Serving Static Files
app.use(express.static(__dirname + "/public"));

// Serving Landing page(Home.html) on root
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "html", "home.html"));
});

// Register Route
app.post("/sign-up", function (req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (name, email, password) VALUES ( ?, ?, ?)",
    [name, email, hashedPassword],
    function (err, result) {
      if (err) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).send({ message: "User already exists!" });
        } else {
          res.status(500).send({ message: "Something went wrong in DB", err });
        }
      } else {
        const userId = result.insertId;
        res
          .status(200)
          .send({ message: "User successfully registered.", userId });
      }
    }
  );
});

// Get User Info Route
app.get("/user-info", function (req, res) {
  if (!req.session.user) {
    res.status(400).send({ message: "User not Logged in" });
  }
  res.status(200).send(req.session.user);
});

// Login Route
app.post("/sign-in", function (req, res) {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (err, result) {
      if (err) {
        console.log("Database error", err);
        res.status(500).send({ message: "Database error" });
      }

      if (result.length > 0) {
        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
          res.status(400).send({ message: "Bad user credentials" });
        } else {
          req.session.user = {
            user_id: user.id,
            email: user.email,
            name: user.name,
          };
          res.status(200).send({ message: "Logged in successfully!" });
        }
      } else {
        res.status(500).send("Bad User Credentials");
      }
    }
  );
});

// Saving User's History
app.post("/save-history", function (req, res) {
  const { userId, query } = req.body;
  if (!userId || !query) {
    res.status(400).send({ message: "Missing userId or query" });
  }

  db.query(
    "INSERT INTO search_history (user_id, query ) VALUES (?, ?)",
    [userId, query],
    function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error while saving search history" });
      } else {
        res.status(200).send({ message: "Search History saved Successfully." });
      }
    }
  );
});

// Get History
app.get("/get-history", function (req, res) {
  if (!req.session.user) {
    res.status(400).send({ message: "Not Logged in" });
  }

  const userId = req.session.user.user_id;

  db.query(
    "SELECT query, created_at FROM search_history WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    function (err, results) {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error while fetching the search history." });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Logout Route
app.post("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      res.status(500).send({ message: "Something went wrong during logout." });
    } else {
      res.status(200).send({ message: "User logged out successfully." });
    }
  });
});

app.listen(port, function () {
  console.log("App is listening on port ", port);
});
