import React, { useState, useEffect, useContext, useHistory } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { EditorContext } from "./EditorContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";
import { useCookies } from "react-cookie";

const storage = getStorage(app);

const Editpage = (props) => {
  const [isPublish, setIsPublish] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isClick, setIsClick] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [errors, setErrors] = useState({});
  const { editorData, setEditorData } = useContext(EditorContext);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [showAuthor, setShowAuthor] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    markdownContent: "",
    attachmentFile: "",
    url: "",
    selectedAuthor: "",
    publishTime: "",
    status: "draft",
    authorName: "",
  });
  const { id } = useParams();
  const token1 = cookies.token;
  const pattern = /^\/.{1,}$/;
  let authorName;

  const handleCheckboxChange = () => {
    setShowAuthor(!showAuthor);
    console.log(showAuthor);
    setFormData({ ...formData, selectedAuthor: showAuthor });
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    const errors = {};
    if (formData.title == "") {
      errors.title = "";
    }
    if (!pattern.test(formData.url)) {
      errors.url = "";
    }
    setErrors(errors);
    if (errors.title != "" && errors.url != "") {
      const data = JSON.stringify(formData);
      localStorage.setItem("formData", data);
      localStorage.setItem("url", window.location.href);
      navigateTo("/preview");
    }
  };

  const checkFileds = () => {
    const errors = {};
    if (formData.title == "") {
      errors.title = "";
    }
    if (!pattern.test(formData.url)) {
      errors.url = "";
    }
    setErrors(errors);
    if (formData.title && formData.url) {
      setIsPublish(true);
    } else {
      setIsPublish(false);
    }
  };

  const logout = () => {
    removeCookie("token");
    navigateTo("/login");
  };

  const saveDateAndTime = async (e) => {
    const date = document.getElementById("publishDate");
    const time = document.getElementById("publishTime");
    e.preventDefault();
    // const { date, time } = formData;
    errors.date = false;
    errors.time = false;
    // Validate required fields
    if (!date.value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, date: true }));
      return;
    }

    if (!time.value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, time: true }));
      return;
    }
    if (!errors.date && !errors.time) formData.status = "scheduled";
    const part1 = date.value.split("-");
    const part2 = time.value.split(":");
    formData.publishTime = new Date(
      part1[0],
      part1[1] - 1,
      part1[2],
      part2[0],
      part2[1]
    );
    setFormData({ ...formData });
    await saveBlog(e);
    navigateTo("/listing");
  };

  useEffect(() => {
    if (cookies.token == undefined) {
      toast.error("you are not logged in");
      navigateTo("/login");
    }
  }, [0]);
  const handleUpload = async (event) => {
    const storageRef = ref(storage, event.target.files[0].name);

    await uploadBytes(storageRef, event.target.files[0])
      .then((res) => {
        return res.metadata.fullPath;
      })
      .then(async (res) => {
        await getDownloadURL(ref(storage, res)).then((url) => {
          formData.attachmentFile = url;
        });
      })
      .catch((err) => console.log);
  };

  if (id !== undefined && localStorage.getItem("url") !== "preview") {
    useEffect(() => {
      const fetchBlog = async () => {
        const data = await fetch(`http://localhost:5006/blogs/${id}`);
        const fetchedData = await data.json();
        formData.title = fetchedData.title;
        formData.subtitle = fetchedData.subtitle;
        formData.attachmentFile = fetchedData.attachmentFile;
        formData.url = fetchedData.url;
        formData.authorName = fetchedData.createdBy;
        setFormData({ ...fetchedData, authorName: fetchedData.createdBy });
      };
      fetchBlog();
    }, [id]);
  }

  if (localStorage.getItem("formData") !== null) {
    const data = localStorage.getItem("formData");
    const blog = JSON.parse(data);
    console.log(blog);
    if (formData.title == "") formData.title = blog.title;
    if (formData.subtitle == "") formData.subtitle = blog.subtitle;
    if (formData.markdownContent == "")
      formData.markdownContent = blog.markdownContent;
    if (formData.attachmentFile == "")
      formData.attachmentFile = blog.attachmentFile;
    if (formData.url == "") formData.url = blog.url;
    if (formData.authorName == "") formData.authorName = blog.authorName;
  }

  if (id === undefined)
    formData.authorName = localStorage.getItem("authorName");
  const navigateTo = useNavigate();

  const changePage = () => {
    toast.error("your data is not saved");
    localStorage.removeItem("formData");
    localStorage.removeItem("url");
    navigateTo("/listing");
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
    const data = JSON.stringify(formData);
    localStorage.setItem("formData", data);
  };

  const handleChange1 = (e) => {
    setFormData({ ...formData, markdownContent: e });
    const data = JSON.stringify(formData);
    localStorage.setItem("formData", data);
  };

  const saveBlog = async (e) => {
    const errors = {};
    if (formData.title == "") {
      errors.title = "";
    }
    if (!pattern.test(formData.url)) {
      errors.url = "";
    }
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      e.preventDefault();
      try {
        setFormData({ ...formData });
        let response;
        if (id === undefined) {
          response = await fetch("http://localhost:5006/blogs/create-blog", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, token: token1 }),
          });
        } else {
          response = await fetch(`http://localhost:5006/blogs/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, token: token1 }),
          });
        }
        if (response.ok) {
          // Data successfully sent
          const data = await response.json();
          authorName = data.authorName;
          toast.success("your Data successfully saved");
          localStorage.removeItem("formData");
          localStorage.removeItem("url");
          navigateTo("/listing");
        } else {
          toast.error("This URL already used in a blog.");
          console.error("Failed to send data");
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };

  const openContextMenu = (event) => {
    event.preventDefault();
    setIsClick(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };
  const closeContextMenu = () => {
    setIsClick(false);
  };
  const handleReset = async () => {
    formData.title = "";
    formData.subtitle = "";
    formData.markdownContent = {};
    formData.attachmentFile = "";
    formData.url = "";
     setFormData(formData);
    console.log(formData);
    try {
      if (id !== undefined) {
        response = await fetch(`http://localhost:5006/blogs/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, token: token1 }),
        });
        window.location.reload();
      }
      console.log('hii')
    } catch (error) {
      console.error("Error sending data:", error);
    }
    localStorage.removeItem("formData");
    localStorage.removeItem("url");
  };
  const openModal = () => {
    setIsPublish(true);
  };
  const closeModal = () => {
    setIsPublish(false);
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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

  return (
    <>
      <div className="outer flex">
        <div className="left flex flex-col justify-between">
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

        <div className="right">
          <div className="first flex justify-between">
            <div className="p-7 flex">
              <button className="flex" onClick={changePage}>
                <svg
                  width="50"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5995 5.3974C14.9314 5.72934 14.9314 6.26753 14.5995 6.59948L9.20052 11.9984L14.5995 17.3974C14.9314 17.7293 14.9314 18.2675 14.5995 18.5995C14.2675 18.9314 13.7293 18.9314 13.3974 18.5995L7.3974 12.5995C7.06545 12.2675 7.06545 11.7293 7.3974 11.3974L13.3974 5.3974C13.7293 5.06545 14.2675 5.06545 14.5995 5.3974Z"
                    fill="#201F37"
                  />
                </svg>

                <h1 className="font-bold text-2xl mr-3">Home Page</h1>
              </button>
              {formData.status == "scheduled" && (
                <div className="rounded-2">
                  <label className="bg-blue-200 text-blue-900 p-1">
                    Scheduled
                  </label>
                </div>
              )}
              {formData.status == "draft" && (
                <div className="rounded-2">
                  <label className="bg-yellow-200 text-yellow-900 p-1">
                    Draft
                  </label>
                </div>
              )}
            </div>

            <div className="flex h-10 justify-around items-center p-10">
              <button onClick={openContextMenu}>
                <svg
                  width="45"
                  height="70"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-4"
                >
                  <rect
                    x="1"
                    y="1"
                    width="34"
                    height="34"
                    rx="5"
                    fill="white"
                  />
                  <rect
                    x="1"
                    y="1"
                    width="34"
                    height="34"
                    rx="5"
                    stroke="#C7D2FE"
                    strokeWidth="2"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1667 16.3359C11.25 16.3359 10.5 17.0859 10.5 18.0026C10.5 18.9193 11.25 19.6693 12.1667 19.6693C13.0833 19.6693 13.8333 18.9193 13.8333 18.0026C13.8333 17.0859 13.0833 16.3359 12.1667 16.3359ZM23.8333 16.3359C22.9167 16.3359 22.1667 17.0859 22.1667 18.0026C22.1667 18.9193 22.9167 19.6693 23.8333 19.6693C24.75 19.6693 25.5 18.9193 25.5 18.0026C25.5 17.0859 24.75 16.3359 23.8333 16.3359ZM16.3333 18.0026C16.3333 17.0859 17.0833 16.3359 18 16.3359C18.9167 16.3359 19.6667 17.0859 19.6667 18.0026C19.6667 18.9193 18.9167 19.6693 18 19.6693C17.0833 19.6693 16.3333 18.9193 16.3333 18.0026Z"
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
                    <ul className=" border-2 rounded">
                      <li
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`p-3 ${isHovered ? "bg-gray-200 " : "p-3)"}`}
                        onClick={handlePreview}
                      >
                        Preview
                      </li>
                      <li
                        onMouseEnter={handleMouseEnter1}
                        onMouseLeave={handleMouseLeave1}
                        className={`p-3 text-red-600 ${
                          isHovered1 ? "bg-gray-200 " : "p-3 text-red-600"
                        }`}
                        onClick={() => handleReset()}
                      >
                        Reset
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <button
                className=" text-black p-1.5 rounded border-2 mr-4 w-20"
                onClick={changePage}
              >
                cancel
              </button>
              <button
                className="bg-blue-600  text-white font-bold py-2 px-4 rounded mr-4"
                onClick={saveBlog}
              >
                Save
              </button>
              <button
                className="bg-green-600  text-white font-bold py-2 px-4 rounded"
                onClick={checkFileds}
              >
                Publish
              </button>
            </div>
          </div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="second flex">
            <div className="eleft p-5 flex flex-col">
              <div className="flex flex-col">
                <div>
                  <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                    *
                  </span>
                  <label htmlFor="title">Title</label>
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Home Page"
                  value={formData.title}
                  onChange={handleChange}
                  className="editInput p-1 border-2 outline-none  rounded mt-2"
                  required
                />
                {errors.title == "" && (
                  <span className="text-orange-700">Enter title</span>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label htmlFor="subtitle" className="mb-2">
                  Sub Text
                </label>
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  placeholder="This is the home page"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="editInput p-1 border-2 outline-none mb-3 rounded"
                />
              </div>
              <div className="flex flex-col mb-20" data-color-mode="light">
                <div className="mb-2">
                  <label htmlFor="markdownContent">Body</label>
                </div>
                <ReactQuill
                  theme="snow"
                  value={formData.markdownContent}
                  onChange={handleChange1}
                  className="editor"
                />
              </div>
              <div>
                <label htmlFor="attachments" className="">
                  Attchments
                </label>
                <div
                  className="flex mt-2 border bg-gray-100 attch rounded p-2"
                  id="image"
                >
                  <input type="file" onChange={handleUpload} multiple />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="" className="">
                  Supported files: JPEG. PNG. PDF. DOC. XLX. PPT.
                </label>
              </div>
            </div>
            <div className="line1 border-l"></div>
            <div className="eright w-full">
              <div className="p-4 ">
                <div className="flex flex-col">
                  <div className="flex-1">
                    {/* Main content */}
                    <label htmlFor="configurations" className="font-black">
                      Configurations
                    </label>

                    <button
                      className="float-right bg-gray-300 p-1 mr-2 font-black rounded"
                      onClick={toggleSidebar}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50043 4.49653C4.77706 4.21991 5.22555 4.21991 5.50217 4.49653L10.0013 8.99566L14.5004 4.49653C14.7771 4.21991 15.2255 4.21991 15.5022 4.49653C15.7788 4.77315 15.7788 5.22164 15.5022 5.49826L11.003 9.9974L15.5022 14.4965C15.7788 14.7731 15.7788 15.2216 15.5022 15.4983C15.2255 15.7749 14.7771 15.7749 14.5004 15.4983L10.0013 10.9991L5.50217 15.4983C5.22555 15.7749 4.77706 15.7749 4.50043 15.4983C4.22381 15.2216 4.22381 14.7731 4.50043 14.4965L8.99957 9.9974L4.50043 5.49826C4.22381 5.22164 4.22381 4.77315 4.50043 4.49653Z"
                          fill="#6C6B80"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="border-b border-gray-800 w-full mt-2 "></div>

                  {isOpen && (
                    <div className="flex flex-col">
                      <div className="flex flex-col mt-6">
                        <div>
                          <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                            *
                          </span>
                          <label htmlFor="URL" className="font-normal">
                            URL
                          </label>
                        </div>
                        <input
                          type="text"
                          name="url"
                          id="url"
                          placeholder="/Homepage"
                          value={formData.url}
                          onChange={handleChange}
                          className="in p-1 border-2 outline-none rounded "
                          required
                        />
                        {errors.url == "" && (
                          <span className="text-orange-700">
                            URL must start with '/' and have at least one
                            character after it.
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col mt-4">
                        <label htmlFor="authorName">Author</label>
                        <input
                          type="text"
                          name="authorName"
                          id="authorName"
                          placeholder={formData.authorName}
                          onChange={handleChange}
                          className="in p-1 border-2 outline-none mb-3 rounded "
                          disabled
                        />
                      </div>

                      <div className="flex flex-col mt-3">
                        <div className="flex">
                          <input
                            type="checkbox"
                            name="selectedAuthor"
                            id="selectedAuthor"
                            className="w-4 mr-3"
                            onChange={handleCheckboxChange}
                            checked={showAuthor}
                          />
                          <label htmlFor="">Show Author</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isPublish && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white  rounded shadow-lg w-1/4">
              <div className="flex justify-between bg-gray-900 p-2 rounded">
                <div>
                  <label htmlFor="" className="text-white p-4 font-medium">
                    Publish
                  </label>
                </div>
                <div>
                  <button className="" onClick={closeModal}>
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
                        d="M5.3974 5.3974C5.72934 5.06545 6.26753 5.06545 6.59948 5.3974L11.9984 10.7964L17.3974 5.3974C17.7293 5.06545 18.2675 5.06545 18.5995 5.3974C18.9314 5.72934 18.9314 6.26753 18.5995 6.59948L13.2005 11.9984L18.5995 17.3974C18.9314 17.7293 18.9314 18.2675 18.5995 18.5995C18.2675 18.9314 17.7293 18.9314 17.3974 18.5995L11.9984 13.2005L6.59948 18.5995C6.26753 18.9314 5.72934 18.9314 5.3974 18.5995C5.06545 18.2675 5.06545 17.7293 5.3974 17.3974L10.7964 11.9984L5.3974 6.59948C5.06545 6.26753 5.06545 5.72934 5.3974 5.3974Z"
                        fill="#E1E1E8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <form className="p-5" onSubmit={saveDateAndTime}>
                <div className="mb-4">
                  <label htmlFor="publishDate" className="block text-gray-700">
                    Publish Date:
                  </label>
                  <input
                    type="date"
                    id="publishDate"
                    name="date"
                    className="border border-gray-300 px-4 py-2 rounded w-full"
                    onChange={handleChange}
                  />
                  {errors.date && (
                    <span className="text-orange-700">select date</span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="publishTime" className="block text-gray-700">
                    Publish Time:
                  </label>
                  <input
                    type="time"
                    id="publishTime"
                    name="time"
                    className="border border-gray-300 px-4 py-2 rounded w-full"
                    onChange={handleChange}
                  />
                  {errors.time && (
                    <span className="text-orange-700">select time</span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className=" text-black px-4 py-2 rounded mr-2 border-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={saveDateAndTime}
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Editpage;
