import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";


const Listing = () => {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [data, setData] = useState([]);
  const [autherNames, setAutherNames] = useState([]);
  const [selectedRaw, setSelectedRaw] = useState(0);
  const [postData, setPostData] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const navigateTo = useNavigate();

  const addPage = () => {
    navigateTo("/Editpage");
  };

  const logout = () => {
    removeCookie("token");
    navigateTo("/login");
  };

  useEffect(() => {
    if (cookies.token == undefined) {
      toast.error("you are not logged in");
      navigateTo("/login");
    }
  }, [0]);

  const openContextMenu = (event) => {
    event.preventDefault();
    setIsClick(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const selected = (id) => {
    setSelectedRaw(id);
  };

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:5006/blogs/delete_blog/${selectedRaw}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      });
  };

  const handleEdit = async () => {
    navigateTo(`/Editpage/${selectedRaw}`, { state: { postData } });
  };

  const closeContextMenu = () => {
    setIsClick(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  
  const filteredBlogPosts = data.filter(post => {
    // Filter by title search input
    if (searchInput && !post.title.toLowerCase().includes(searchInput.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter && statusFilter !== post.status) {
      return false;
    }

    // Filter by author name
    if (authorFilter && authorFilter !== post.createdBy) {
      return false;
    }

    return true; // Include post if it passes all filters
  });




  useEffect(() => {
    fetchData();
  }, []);


    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5006/blogs/get-blogs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const {blogs,authorNames}=jsonData
        setData(blogs);
        setAutherNames(authorNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

  
  let id=0;

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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.14844 6.99844C3.14844 6.529 3.529 6.14844 3.99844 6.14844H19.9984C20.4679 6.14844 20.8484 6.529 20.8484 6.99844C20.8484 7.46788 20.4679 7.84844 19.9984 7.84844H3.99844C3.529 7.84844 3.14844 7.46788 3.14844 6.99844ZM3.14844 11.9984C3.14844 11.529 3.529 11.1484 3.99844 11.1484L13.9984 11.1484C14.4679 11.1484 14.8484 11.529 14.8484 11.9984C14.8484 12.4679 14.4679 12.8484 13.9984 12.8484L3.99844 12.8484C3.529 12.8484 3.14844 12.4679 3.14844 11.9984ZM3.99844 16.1484C3.529 16.1484 3.14844 16.529 3.14844 16.9984C3.14844 17.4679 3.529 17.8484 3.99844 17.8484H19.9984C20.4679 17.8484 20.8484 17.4679 20.8484 16.9984C20.8484 16.529 20.4679 16.1484 19.9984 16.1484H3.99844Z"
                  fill="#201F37"
                />
              </svg>

              <div>
                <h1 className="font-bold text-2xl ml-5">Pages</h1>
                <p className="ml-5">Create and publish pages.</p>
              </div>
            </div>

            <div className="flex h-10 justify-around items-center p-12">
              <button
                className="bg-blue-700  text-white font-bold py-2 px-4 rounded mr-4"
                onClick={addPage}
              >
                + Add Page
              </button>
            </div>
          </div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="second">
            <div className="first flex justify-between items-center p-6">
              {/* Left side */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="border mr-4 search border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 "
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div>
                  <p>{data.length} records</p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex ">
                <div>
                  <label htmlFor="Status" className="mr-3">
                    Status
                  </label>
                  <select
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="border  border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 
                    mr-5"
                  >
                    <option value="">All</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="Created" className="mr-3">
                    Created By
                  </label>
                  <select
                    value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Authors</option>
                    {autherNames.map((autherNames1) => {
                      return <option key={id++} value={autherNames1}>{autherNames1}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="second overflow-x-auto mt-5">
              <table className="table-auto w-full border-collapse border border-gray-300 ">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Title</th>
                    <th className="border border-gray-300 px-4 py-2">URL</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Created By
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Created At
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Modified By
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Modified At
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Table rows go here */}
                  {filteredBlogPosts.map((filteredBlogPosts) => (
                    <tr key={filteredBlogPosts._id}>
                      <td className="flex border border-gray-300 px-4 py-2 justify-between">
                        {filteredBlogPosts.title}
                        <button
                          onClick={(event) => {
                            openContextMenu(event);
                            selected(filteredBlogPosts._id);
                          }}
                        >
                          <svg
                            width="25"
                            height="23"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="p4 hover:bg-gray-200"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33333 6.66406C2.6 6.66406 2 7.26406 2 7.9974C2 8.73073 2.6 9.33073 3.33333 9.33073C4.06667 9.33073 4.66667 8.73073 4.66667 7.9974C4.66667 7.26406 4.06667 6.66406 3.33333 6.66406ZM12.6667 6.66406C11.9333 6.66406 11.3333 7.26406 11.3333 7.9974C11.3333 8.73073 11.9333 9.33073 12.6667 9.33073C13.4 9.33073 14 8.73073 14 7.9974C14 7.26406 13.4 6.66406 12.6667 6.66406ZM6.66667 7.9974C6.66667 7.26406 7.26667 6.66406 8 6.66406C8.73333 6.66406 9.33333 7.26406 9.33333 7.9974C9.33333 8.73073 8.73333 9.33073 8 9.33073C7.26667 9.33073 6.66667 8.73073 6.66667 7.9974Z"
                              fill="#201F37"
                            />
                          </svg>
                        </button>
                        {isClick && (
                          <div
                            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
                            onClick={closeContextMenu}
                          >
                            <div
                              className="absolute z-10 bg-white border-gray-300 shadow-lg menu"
                              style={{
                                top: menuPosition.y + 16,
                                left: menuPosition.x - 92,
                              }}
                            >
                              <ul className="  rounded">
                                <li
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                  className={`p-3 ${
                                    isHovered ? "bg-gray-200 " : "p-3"
                                  }`}
                                  onClick={handleEdit}
                                >
                                  Edit
                                </li>
                                <li
                                  onMouseEnter={handleMouseEnter1}
                                  onMouseLeave={handleMouseLeave1}
                                  className={`p-3 text-red-600 ${
                                    isHovered1
                                      ? "bg-gray-200 "
                                      : "p-3 text-red-600"
                                  }`}
                                  onClick={handleDelete}
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {filteredBlogPosts.url}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {filteredBlogPosts.createdBy}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 createTime">
                        {filteredBlogPosts.createdAt}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {filteredBlogPosts.modifiedBy}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {filteredBlogPosts.modifiedAt}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {filteredBlogPosts.status=='draft' && 
                           <div className="rounded-2"><label className="bg-yellow-200 text-yellow-900 p-1">Draft</label></div>
                        }
                        {filteredBlogPosts.status=='scheduled' && 
                           <div className="rounded-2"><label className="bg-blue-200 text-blue-900 p-1">Scheduled</label></div>
                        }
                        {filteredBlogPosts.status=='published' && 
                           <div className="rounded-2"><label className="bg-green-200 text-green-900 p-1">Published</label></div>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
