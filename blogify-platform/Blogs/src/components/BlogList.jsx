import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5006/blogs/published_blogs"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setBlogs(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        <h1 className="text-3xl font-semibold mb-4 flex justify-center align-middle">
          List of Published Blogs
        </h1>
        <ul className="divide-y divide-gray-200 flex flex-col justify-center align-middle">
          {blogs.map((blog, index) => (
            <li key={blog._id} className="py-4">
              <div className="flex justify-center align-middle item">
                <span className="mr-2 font-semibold text-3xl">
                  {index + 1}.
                </span>
                  <Link
                    to={`/blogs${blog.url}`}
                    className=" hover:underline text-3xl"
                  >
                    {blog.title}  
                  </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default BlogList;
