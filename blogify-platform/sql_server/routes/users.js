const pool = require("../pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = "mandu";

async function registerUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const userData = JSON.parse(body);
      const { firstName, lastName, email, password } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
      const [data] = await pool
        .query(query, [firstName, lastName, email, hashedPassword])
        .catch(console.error);
      res.statusCode = 201;
      res.end(JSON.stringify({ message: "yes" }));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "no" }));
    }
  });
}

async function loginUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const { email, password } = JSON.parse(body);
      const query = "SELECT * FROM users WHERE email = ?";
      const [data] = await pool.query(query, [email]);
      if (data.length > 0) {
        const isPasswordValid = await bcrypt.compare(
          password,
          data[0].password
        );
        if (isPasswordValid) {
          jwt.sign({ 'data':data[0] }, jwtKey, (err, token) => {
            if (err) {
              res.end(JSON.stringify({ result: "something went wrong" }));
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true,user:data[0],result: "something went wrong","auth": token }));
          });
        } else {
          res.statusCode=(401)
          res.end(JSON.stringify({ message: "Invalid credentials" }));
        }
      } else {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            success: false,
            message: "Invalid email or password",
          })
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.statusCode = 400;
      res.end("Invalid JSON");
    }
  });
}

module.exports = { registerUser, loginUser };
