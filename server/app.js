 // index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./DB');
const userRouter = require('./routes/users');
const blogRouter = require('./routes/blogs');
const app = express();
const cron = require('node-cron');
const Blog = require('./models/Blog');
app.use(cors());
//const moment = require('moment'); 
const PORT =  process.env.PORT;
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/blogs', blogRouter);
const nodemailer = require('nodemailer');
const moment = require('moment');


cron.schedule('* * * * *', async () => {
  try {
    const utcTimestamp = new Date();
    const localTime = moment.utc(utcTimestamp).local()
    const scheduledPosts = await Blog.find({ status: 'scheduled', publishTime: { $lte:localTime } });
    scheduledPosts.forEach(async (post) => {
      // Update status to published
      post.status = 'published';
      await post.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mandanisahil304@gmail.com',
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: 'mandanisahil304@gmail.com',
        to: post.email,
        subject: 'Your blog is published ',
        text: `Your blog is published on our website.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
      console.log('Blog post published:', post.title);
    });
  } catch (error) {
    console.error('Error publishing scheduled blog posts:', error);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
