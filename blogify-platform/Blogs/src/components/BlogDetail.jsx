import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://localhost:5006/blogs/blogdetail/${slug}`
        );
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <div>
        <div className="container mx-auto  py-8">
          <h1 className="text-3xl font-semibold mb-4 flex align-items-center justify-center">
            {blog.title}
          </h1>
          <h2 className="text-xl font-medium mb-2">
            subtitle: {blog.subtitle}
          </h2>
          <div className="ml-10">
            <div
              className="mb-5"
              dangerouslySetInnerHTML={{ __html: blog.markdownContent }}
            />
            <div className="flex align-center justify-center">
              {blog.attachmentFile && (
                <img className="img" src={blog.attachmentFile} alt="no photo" />
              )}
            </div>
          </div>
        </div>
      {blog.selectedAuthor == "false" && (
        <div className="text-gray-600 mr-10 flex justify-end font-bold text-3xl">
          By: {blog.createdBy}
        </div>
      )}
      </div>
    </>
  );
};

export default BlogDetail;
