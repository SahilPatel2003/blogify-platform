const http = require("http");
const pool = require("./pool");
const url = require("url");
require('dotenv').config();
const { registerUser, loginUser } = require("./routes/users");
const {
  createBlog,
  getBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
  published_blogs,
  blog_detail,
} = require("./routes/blogs");
const { get } = require("../server/routes/users");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  const Headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET,POST,PUT,DELETE,PATCH",
    "Access-Control-Allow-Headers": "token,X-Requested-With,content-type",
  };
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  //   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,POST');
  //   res.setHeader('Access-Control-Allow-Headers', 'token,X-Requested-With,content-type');
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  res.writeHead(200, Headers);
  res.statusCode = 200;
  if (req.url === "/api/users/register" && req.method === "POST") {
    registerUser(req, res);
  } else if (req.url === "/api/users/login" && req.method === "POST") {
    loginUser(req, res);
  } else if (req.url === "/blogs/create-blog" && req.method === "POST") {
    createBlog(req, res);
  } else if (req.url === "/blogs/get-blogs" && req.method === "GET") {
    getBlogs(req, res);
  } else if (req.url === "/blogs/published_blogs" && req.method === "GET") {
    published_blogs(req, res);
  } else if (pathname.startsWith("/blogs/blogdetail") && req.method === "GET") {
    const slug = pathname.split("/")[3];
    blog_detail(req, res, slug);
  } else if (pathname.startsWith("/blogs") && req.method === "GET") {
    const blogId = pathname.split("/")[2];
    getOneBlog(req, res, blogId);
  } else if (pathname.startsWith("/blogs") && req.method === "PATCH") {
    const blogId = pathname.split("/")[2];
    updateBlog(req, res, blogId);
  } else if (
    pathname.startsWith("/blogs/delete_blog") &&
    req.method === "DELETE"
  ) {
    const blogId = pathname.split("/")[3];
    deleteBlog(req, res, blogId);
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

cron.schedule("* * * * *", async () => {
  try {
    // Query for scheduled posts that have passed their publish time
    const query = `SELECT * FROM blogs WHERE status = 'scheduled' AND publishTime <= NOW()`;
    const [rows] = await pool.query(query);
    // Update status to "published" and send email to user for each post
    for (const row of rows) {
      // Update status to "published"
      const query1 = `UPDATE blogs SET status = 'published' WHERE id = ?`;
      await pool.query(query1, [row.id]);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mandanisahil304@gmail.com",
          pass:process.env.EMAIL_password,
        },
      });

      const mailOptions = {
        from: "mandanisahil304@gmail.com",
        to: row.email,
        subject: "Your blog is published ",
        text: `Your blog is published on our website.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  } catch (error) {
    console.error("Error updating scheduled posts:", error);
  } finally {
    await connection.end();
  }
});

const PORT = process.env.PORT || 5006;
  
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
