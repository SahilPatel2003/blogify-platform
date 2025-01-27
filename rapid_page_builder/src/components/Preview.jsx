import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { EditorContext } from "./EditorContext";
import { useCookies } from "react-cookie";
const Preview = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigateTo = useNavigate();
  const { editorData } = useContext(EditorContext);

   const data=localStorage.getItem('formData');
   const blog=JSON.parse(data);

  const back = () => {
    const url=localStorage.getItem('url');
    localStorage.setItem('url','preview');
    window.location.href=url;
  };

  useEffect(() => {
    if (cookies.token == undefined) {
      toast.error("you are not logged in");
      navigateTo("/login");
    }
  }, [0]);

  const logout = () => {
    removeCookie("token");
    navigateTo("/login");
  };

  return (
    <>
      <div className="outer flex">
        <div className="left flex flex-col justify-between w-20">
          <div className="top">
            <svg
              className="mt-6"
              width="80"
              height="40"
              viewBox="0 0 28 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.6581 0.863985C18.5585 1.69133 15.7358 2.032 12.7671 10.6461C9.38471 20.4769 11.1124 24.1026 12.7184 26.5603C13.8621 28.3123 8.8007 27.6067 7.82735 26.6333C4.25031 23.1536 9.0197 18.5545 6.14833 17.5082C4.00697 16.7052 6.36734 24.1999 4.61531 23.8593C0.989603 23.1293 -0.15408 15.3668 0.0162553 13.0065C0.235258 9.7701 1.57361 9.89176 2.76596 8.40741C4.00697 6.89873 4.44498 4.9277 5.41833 3.24868C6.80534 0.839652 15.3708 -1.22871 17.6581 0.863985ZM10.6987 7.14206C11.5504 5.70638 12.0371 4.19769 10.6257 5.77938C8.38703 8.28575 4.20164 15.1965 7.51102 14.7585C9.79838 14.4422 8.9467 10.0864 10.6987 7.14206Z"
                fill="#4F46E5"
              />
              <path
                d="M28.0035 13.253C27.9305 16.4163 15.5447 15.2727 18.8784 18.509C21.7011 21.2344 24.3291 15.6863 26.9571 15.9783C28.5145 16.1487 27.9305 18.1197 27.6142 19.166C26.2271 23.7408 21.4577 28.1452 16.664 28.1452C11.2133 28.1452 11.6513 16.8057 13.671 10.9656C16.2747 3.47085 19.0001 1.08616 20.6547 1.67017C24.2805 2.91118 27.9305 7.46157 27.5168 10.7223C27.2248 13.0583 16.4694 12.6933 18.927 13.983C20.8007 14.9563 28.0278 12.2553 28.0035 13.253Z"
                fill="#4F46E5"
              />
            </svg>
            <svg
              className="mt-6 ml-4 p-1"
              width="52"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 4H4V12H10.5V4Z"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12H13.5V20H20V12Z"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 4H13.5V9H20V4Z"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 14.9998H4V19.9998H10.5V14.9998Z"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="border-b border-gray-800 w-14 ml-4 mt-3 "></div>
            <svg
              width="50"
              height="50"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-gray-200 ml-4 mt-4"
            >
              <path
                d="M20 28L27.2333 26.0271C27.4917 25.9751 27.75 25.7154 27.75 25.4039V12.4233C27.75 12.1637 27.5433 11.9561 27.2333 12.008L20 13.981"
                stroke="#6C6B80"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 13.9844L20 27.4842"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981"
                fill="#6C6B80"
              />
              <path
                d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981"
                stroke="#6C6B80"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.3203 15.9062L17.937 16.6331"
                stroke="#EEF2FF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.3203 18.5L16.387 18.9153"
                stroke="#EEF2FF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="bottom flex flex-col">
            <button onClick={logout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                id="logout"
                className="w-10 ml-6 mb-5"
              >
                <g data-name="Layer 2">
                  <path d="M26.707,15.293l-5-5a1,1,0,0,0-1.414,1.414L23.586,15H12a1,1,0,0,0,0,2H23.586l-3.293,3.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,26.707,15.293Z"></path>
                  <path d="M10,25H7V7h3a1,1,0,0,0,0-2H6A1,1,0,0,0,5,6V26a1,1,0,0,0,1,1h4a1,1,0,0,0,0-2Z"></path>
                </g>
              </svg>
            </button>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              id="profile"
              className="h-1/3"
            >
              <path
                fill="#2b2e63"
                d="M32 0C14.4 0 0 14.4 0 32s14.4 32 32 32c17.7 0 32-14.4 32-32S49.7 0 32 0zm0 62.1C15.4 62.1 1.9 48.6 1.9 32S15.4 1.9 32 1.9 62.1 15.4 62.1 32 48.6 62.1 32 62.1z"
              ></path>
              <path
                fill="#ededed"
                d="M32 1.9C15.4 1.9 1.9 15.4 1.9 32S15.4 62.1 32 62.1 62.1 48.6 62.1 32 48.6 1.9 32 1.9zm0 10.8c4.8 0 8.8 3.9 8.8 8.8 0 4.8-3.9 8.8-8.8 8.8-4.8 0-8.8-3.9-8.8-8.8.1-4.8 4-8.8 8.8-8.8zm15.9 37.7H16.1c-.5 0-1-.4-1-1 0-9.3 7.6-16.9 16.9-16.9 9.3 0 16.9 7.6 16.9 16.9 0 .6-.4 1-1 1z"
              ></path>
              <path
                fill="#d6d6d6"
                d="M32 1.9C15.4 1.9 1.9 15.4 1.9 32S15.4 62.1 32 62.1 62.1 48.6 62.1 32 48.6 1.9 32 1.9zm0 58.2C16.5 60.1 3.9 47.5 3.9 32S16.5 3.9 32 3.9 60.1 16.5 60.1 32 47.5 60.1 32 60.1z"
              ></path>
              <path
                fill="#2b2e63"
                d="M32 32.5c-9.3 0-16.9 7.6-16.9 16.9 0 .5.4 1 1 1H48c.5 0 1-.4 1-1-.1-9.3-7.7-16.9-17-16.9zm-14.9 16c.5-7.8 7-14 14.9-14s14.4 6.2 14.9 14H17.1z"
              ></path>
              <path
                fill="#f26e61"
                d="M46.9 48.5H17.1c.5-7.8 7-14 14.9-14s14.4 6.2 14.9 14z"
              ></path>
              <path
                fill="#2b2e63"
                d="M32 12.7c-4.8 0-8.8 3.9-8.8 8.8 0 4.8 3.9 8.8 8.8 8.8 4.8 0 8.8-3.9 8.8-8.8 0-4.8-4-8.8-8.8-8.8zm0 15.6c-3.8 0-6.8-3-6.8-6.8s3.1-6.8 6.8-6.8c3.8 0 6.8 3.1 6.8 6.8s-3 6.8-6.8 6.8z"
              ></path>
              <path
                fill="#ffe5ab"
                d="M38.8 21.5c0 3.8-3.1 6.8-6.8 6.8-3.8 0-6.8-3-6.8-6.8s3.1-6.8 6.8-6.8c3.8 0 6.8 3 6.8 6.8z"
              ></path>
              <path
                fill="#e15e5a"
                d="M32 34.5c-7.9 0-14.4 6.2-14.9 14H47c-.6-7.8-7.1-14-15-14zm0 1.5c6.5 0 12.1 4.7 13.2 11H18.8c1.1-6.3 6.7-11 13.2-11z"
              ></path>
              <path
                fill="#f0d39a"
                d="M32 14.7c-3.8 0-6.8 3.1-6.8 6.8s3.1 6.8 6.8 6.8c3.8 0 6.8-3 6.8-6.8s-3-6.8-6.8-6.8zm0 12.1c-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3 5.3 2.4 5.3 5.3-2.4 5.3-5.3 5.3z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="line border-l "></div>
        <div className="right flex-col justify-center items-center">
          <div className="first flex justify-between">
            <div className="p-5 flex">
              <div>
                <h1 className="font-bold text-2xl ml-5">Publish Pages</h1>
              </div>
            </div>

            <div className="flex h-10 justify-around items-center p-10">
              <button
                className="bg-blue-700  text-white font-bold py-2 px-4 rounded mr-4"
                onClick={back}
              >
                Go back
              </button>
            </div>
          </div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="second p-10">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
