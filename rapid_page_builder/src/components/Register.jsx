// Register.js

import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigateTo = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (formData.firstName.length < 5) {
      errors.firstName = "First name must be at least 5 characters";
    }
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    // Password validation
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(formData.password)) {
    //   errors.password = 'Password must be strong (at least 8 characters, one uppercase, one lowercase, one number, and one special character)';
    // }
    if (formData.password.length < 3) {
      errors.password = "Password must be at least 3 characters";
    }
    // Password matching
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5006/api/users/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          console.log("Registration successful");
          toast.success("Registration successful!");
          navigateTo("/login");
        } else {
          console.error("Failed to register user");
          toast.error("You are already registered with this email");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex border-2 border-indigo-600 justify-center items-center main flex-col px-6 py-12 lg:px-8">
      <div className="flex flex-row  mx-10 ju items-center	w-80">
        <svg
          width="49"
          height="48"
          viewBox="0 0 49 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.1581 10.864C29.0585 11.6913 26.2358 12.032 23.2671 20.6461C19.8847 30.4769 21.6124 34.1026 23.2184 36.5603C24.3621 38.3123 19.3007 37.6067 18.3274 36.6333C14.7503 33.1536 19.5197 28.5545 16.6483 27.5082C14.507 26.7052 16.8673 34.1999 15.1153 33.8593C11.4896 33.1293 10.3459 25.3668 10.5163 23.0065C10.7353 19.7701 12.0736 19.8918 13.266 18.4074C14.507 16.8987 14.945 14.9277 15.9183 13.2487C17.3053 10.8397 25.8708 8.77129 28.1581 10.864ZM21.1987 17.1421C22.0504 15.7064 22.5371 14.1977 21.1257 15.7794C18.887 18.2857 14.7016 25.1965 18.011 24.7585C20.2984 24.4422 19.4467 20.0864 21.1987 17.1421Z"
            fill="#4F46E5"
          />
          <path
            d="M38.5035 23.253C38.4305 26.4163 26.0447 25.2727 29.3784 28.509C32.2011 31.2344 34.8291 25.6863 37.4571 25.9783C39.0145 26.1487 38.4305 28.1197 38.1142 29.166C36.7271 33.7408 31.9577 38.1452 27.164 38.1452C21.7133 38.1452 22.1513 26.8057 24.171 20.9656C26.7747 13.4709 29.5001 11.0862 31.1547 11.6702C34.7805 12.9112 38.4305 17.4616 38.0168 20.7223C37.7248 23.0583 26.9694 22.6933 29.427 23.983C31.3007 24.9563 38.5278 22.2553 38.5035 23.253Z"
            fill="#4F46E5"
          />
        </svg>
        <h2 className="text-3xl font-bold">Rapid page Builder</h2>
      </div>

      <div className="flex mt-10 inner ">
        <form
          className="border rounded-lg p-10 inner"
          id="formSubmit"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl mb-10 font-bold">Register</h2>
          <div className="flex flex-col mb-4">
            <label htmlFor="" className="mb-2">
              First Name
              <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                *
              </span>
            </label>
            <input
              type="text"
              placeholder="First Name"
              className=" flex flex-col  border rounded-md p-2"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && (
              <span className="text-orange-700">{errors.firstName}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="" className="mb-3">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="flex flex-col  border rounded-md p-2 mt-2"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="mb-2">
              Email
              <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                *
              </span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="flex flex-col  border rounded-md p-2 mt-2"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <span className="text-orange-700">{errors.email}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="" className="mb-2">
              password
              <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                *
              </span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="flex flex-col  border rounded-md p-2 mt-2"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="text-orange-700">{errors.password}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="" className="mb-2">
              confirm password
              <span className="flex-shrink-0 flex-grow-0 text-left text-sm text-[#da0128]">
                *
              </span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="flex flex-col  border rounded-md p-2 mt-2"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <span className="text-orange-700">{errors.confirmPassword}</span>
            )}
          </div>
          <div className="mb-4 flex">
            <input
              type="checkbox"
              name="checkbox"
              id="checkbox"
              onChange={handleChange}
              required
            />
            <p className="">Subscribe to our newsletter</p>
          </div>

          <div className="mb-8">
            <p className="w-[656px] flex-shrink-0 flex-grow-0 self-stretch text-left text-sm">
              <span className="w-[656px] flex-shrink-0 flex-grow-0 self-stretch text-left text-sm text-gray-500">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
              </span>
              <span className="w-[656px] flex-shrink-0 flex-grow-0 self-stretch text-left text-sm text-indigo-600">
                privacy policy
              </span>
              <span className="w-[656px] flex-shrink-0 flex-grow-0 self-stretch text-left text-sm text-gray-500">
                .
              </span>
            </p>
          </div>

          <button
            type="submit"
            className="flex justify-center items-center bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        <div>
          <p className="mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login here
            </Link>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
