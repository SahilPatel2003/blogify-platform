const pool = require("../pool");
const jwt = require("jsonwebtoken");
const secretKey = "mandu";
const moment = require("moment");


async function createBlog(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    const blogData = JSON.parse(body);
    try {
      const token = blogData.token;
      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        try {
          const verifiedToken = jwt.verify(token, secretKey);
          const userInfo = verifiedToken.data;
          const fullName = userInfo.firstName + " " + userInfo.lastName;
          const email = userInfo.email;
          const authorName = fullName;
          let {
            title,
            subtitle,
            markdownContent,
            attachmentFile,
            url,
            selectedAuthor,
            publishTime,
            status,
          } = blogData;
          let publishTime1;
          if(publishTime!==undefined)
          {
          const date = new Date(publishTime); 
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
      
           publishTime1= `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
         
          const query = `INSERT INTO blogs(title, subtitle, markdowncontent, attachmentFile, url,selectedAuthor,createdBy,modifiedBy,email,status,publishTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

          const [data] = await pool.query(query, [
            title,
            subtitle,
            markdownContent,
            attachmentFile,
            url,
            selectedAuthor,
            fullName,
            fullName,
            email,
            status,
            publishTime1
          ]);

          const query1 = `SELECT * FROM blogs`;
          const data1 = await pool.query(query1);
          res.statusCode = 201;
          res.end(
            JSON.stringify({ success: true, blogs: data1[0], authorName })
          );
        } catch (error) {
          console.error("Error verifying token:", error.message);
        }
      } else {
        console.error("Invalid token.");
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 400;
      res.end({ message: err.message });
    }
  });
}

async function updateBlog(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    const {token,createdAt,modifiedAt,publishTime,...updatedData} = JSON.parse(body);
    try {
      const token1 =token;
      const decodedToken = jwt.decode(token1);
      if (decodedToken) {
        try {
          const verifiedToken = jwt.verify(token, secretKey);
          const userInfo = verifiedToken.data;
          const fullName = userInfo.firstName + " " + userInfo.lastName;
          updatedData.modifiedBy=fullName;
          const email = userInfo.email;
          let publishTime1;
          
          let status1='draft';
          console.log(publishTime);
          const query2 = "SELECT publishTime from blogs WHERE id = ?";
          const [data2] = await pool.query(query2, [id]);
          if(publishTime!==undefined || data2[0].publishTime!==null)
          {
            let date;
            if(publishTime!==undefined) date = new Date(publishTime); 
            else date = new Date(data2[0].publishTime);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          updatedData.status='scheduled';
           publishTime1= `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
          updatedData.publishTime=publishTime1;
          const query = "UPDATE blogs SET ? WHERE id = ?";
          const [data] = await pool.query(query, [updatedData, id]);
          const query1 = `SELECT * FROM blogs`;
          const data1 = await pool.query(query1);
          res.statusCode = 201;
          res.end(
            JSON.stringify({ success: true, blogs: data1[0], auther:fullName })
          );
        } catch (error) {
          console.error("Error verifying token:", error.message);
        }
      } else {
        console.error("Invalid token.");
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 400;
      res.end({ message: err.message });
    }
  });
}

async function getBlogs(req, res) {
  try {
    const query = `SELECT * FROM blogs`;
    const data = await pool.query(query);
    const query1=`SELECT DISTINCT createdBy FROM blogs`
    const [authorNames]=await pool.query(query1);
    let allAuthors=[];
    for(let value of authorNames){
       allAuthors.push(value.createdBy);
    }
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, blogs: data[0] ,authors:allAuthors}));
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end({ message: err.message });
  }
}

async function getOneBlog(req, res, id) {
  try {
    const query = "SELECT * FROM blogs WHERE id = ?";
    const data = await pool.query(query, [id]);
    res.end(
      JSON.stringify({
        success: true,
        message: "Blog fetched successfully",
        blog: data,
      })
    );
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end({ message: err.message });
  }
}

async function deleteBlog(req, res, id) {
  try {
    const query = "DELETE FROM blogs WHERE id = ?";
    const data = await pool.query(query, [id]);
    res.end(
      JSON.stringify({ success: true, message: "Blog deleted successfully" })
    );
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end({ message: err.message });
  }
}

async function published_blogs(req, res){
  try {
    const query = `SELECT * FROM blogs WHERE status='published'`;
    const [data] = await pool.query(query);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, blogs: data}));
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end({ message: err.message });
  }
}

async function blog_detail(req,res,slug){
  const slug1=`/${slug}`
  try {
    const query = `SELECT * FROM blogs WHERE url= ?`;
    const [data] = await pool.query(query,[slug1]);
    console.log(data);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, blogs: data}));
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end({ message: err.message });
  }
}

module.exports = { createBlog, getBlogs, getOneBlog, updateBlog, deleteBlog ,published_blogs,blog_detail};
