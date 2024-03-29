var mysql = require("mysql2");
var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kobi09pollak",
  database: "project6",
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    res.status(400).json({ error: "userName and password are required" });
    return;
  }
  con.connect(function (err) {
    if (err) throw err;
    // console.log(userName, password);
    // console.log("Connected!");

    const sql = `SELECT * FROM passwords AS p JOIN users AS u ON p.userId = u.id WHERE u.userName = '${userName}' AND p.password = '${password}'`;

    con.query(sql, function (err, results, fields) {
      if (err) throw err;
      // console.log("query done");
      res.statusCode = 200;
      res.send(
        results.length === 0
          ? JSON.stringify(false)
          : JSON.stringify(results[0])
      );
    });
  });
});

app.get(`/todos/:userId`, (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const completedSort = req.query.completedSort || false;
  const idSort = req.query.idSort || false;
  const randomSort = req.query.randomSort || false;
  con.connect(function (err) {
    if (err) throw err;
    const sql = `select * from todos as t where t.userId = ${userId} order by ${
      idSort ? "id" : completedSort ? "completed" : randomSort ? "RAND()" : "id"
    } ASC`;
    console.log(sql);
    con.query(sql, function (err, results, fields) {
      if (err) throw err;
      // console.log(results);
      res.send(JSON.stringify(results));
    });
  });
});

app.post("/todos/new", (req, res) => {
  const newTodo = req.body;
  if (!newTodo.userId || !newTodo.title || !newTodo.completed) {
    res.status(400).send("ha ha ha");
    return;
  }
  con.connect(function (err) {
    if (err) throw err;
  });
  // Insert the new todo into the database
  const sql = `INSERT INTO todos SET ?`;
  // console.log(sql);
  con.query(sql, newTodo, (error, results, fields) => {
    if (error) {
      console.error("Error inserting new todo:", error);
      res.status(500).json({ error: "Failed to create new todo." });
    } else {
      // console.log(results);
      res.status(200).json(results);
    }
  });
});

app.post("/posts/new", (req, res) => {
  const newPost = req.body;
  // if (!newTodo.userId || !newTodo.title || !newTodo.completed) {
  //   res.status(400).send("ha ha ha");
  //   return;
  // }
  // con.connect(function (err) {
  //   if (err) throw err;
  // });
  // Insert the new todo into the database
  const sql = `INSERT INTO posts SET ?`;
  console.log(sql);
  con.query(sql, newPost, (error, results, fields) => {
    if (error) {
      console.error("Error inserting new post:", error);
      res.status(500).json({ error: "Failed to create new todo." });
    } else {
      console.log(results);
      res.status(200).json(results);
    }
  });
});

app.get("/comments/:postId", (req, res) => {
  const postId = req.params.postId;
  const sql = `SELECT * FROM comments WHERE comments.postId = '${postId}'`;
  con.query(sql, function (err, results) {
    if (err) throw err;
    res.status(200).json(results);
  });
});

app.get(`/posts/:userId`, (req, res) => {
  const userId = req.params.userId;
  const withComments = req.query.withComments;
  // console.log(withComments);
  let sql;
  if (withComments === true) {
    sql = `select * from posts as p join comments as c on p.userId = ${userId} and p.id = c.postId`;
  } else {
    sql = `select * from posts where userId = ${userId}`;
  }
  con.query(sql, function (err, results, fields) {
    if (err) throw err;
    // console.log(results);
    res.send(JSON.stringify(results));
  });
});

app.post("/todos", (req, res) => {
  const { completed, postId } = req.body;

  // Update the todo in the database
  const updateQuery = `UPDATE todos SET completed = ${completed} WHERE id = ${postId}`;
  con.connect(function (err) {
    if (err) throw err;
  });
  con.query(updateQuery, (error, results, fields) => {
    if (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Failed to update todo." });
    } else {
      res.status(200).json({ message: "Todo updated successfully." });
    }
  });
});

app.post("/todos/delete", (req, res) => {
  const deleteElement = req.body;
  // console.log(deleteElement);
  // Delete the todo from the database
  const deleteQuery = `DELETE FROM todos WHERE id = ${deleteElement.todoId}`;
  con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
  });
  con.query(
    deleteQuery,
    [deleteElement.userId, deleteElement.todoId],
    (error, results, fields) => {
      if (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Failed to delete todo." });
      } else {
        res.status(200).json({ message: "Todo deleted successfully." });
      }
    }
  );
});

app.post("/posts/delete", (req, res) => {
  const deleteElement = req.body;
  // console.log(deleteElement);
  // Delete the todo from the database
  const deletePost = `DELETE FROM posts WHERE id = ${deleteElement.id}`;
  const deleteComments = `DELETE FROM comments WHERE postId = ${deleteElement.userId}`;
  con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
  });
  con.query(
    deletePost,
    [deleteElement.userId, deleteElement.id],
    (error, results, fields) => {
      if (error) {
        console.log('aaaaa')
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post." });
      } else {
        con.query(
          deleteComments,
          [deleteElement.userId, deleteElement.id],
          (error, results, fields) => {
            if (error) {
              console.error("Error deleting comment:", error);
              res.status(500).json({ error: "Failed to delete commend." });
            } else {
              res.status(200).json({ message: "commend deleted successfully." });
            }
          }
        );
      }
    }
  );
  
});

app.post("/register", (req, res) => {
  const {
    username,
    password,
    name,
    email,
    phone,
    address,
    website,
    company
  } = req.body;

  const insertUserQuery = `INSERT INTO users (username, password, name, email, phone, address, website, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [username, password, name, email, phone, address, website, company];
  con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
  });
  con.query(insertUserQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log('User registered successfully');
      res.json({ message: "User registered successfully" });
    }
  });
});



app.get('/info/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const sql = `SELECT * FROM users WHERE userName = '${username}'`;
  con.query(sql,  function (err, results, fields){
    if (err) throw err;
    console.log(results);
    res.send(JSON.stringify(results[0]));
    })
  })

const port = 3070; // or any port number you prefer
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
