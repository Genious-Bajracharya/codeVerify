import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(Array(6).fill(false));
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()

  const handleChange = (index, value) => {
    // if (value.length > 1) return; //
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to right
    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  

  //handle backspace
  const handleDelete = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  //handle code paste
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    const newCode = pasteData.split("");
    setCode([...newCode, ...Array(6 - newCode.length).fill("")]);

    newCode.forEach((char, index) => {
      if (index < 6) {
        document.getElementById(`input-${index}`).value = char;
      }
    });

    document.getElementById(`input-${newCode.length - 1}`).focus();
  };

  const handleSubmit = async () => {
    try {
      const verificationCode = code.join("");

      const response = await axios.post("http://localhost:5000/api/verify", {
        code: verificationCode,
      });

      if (response.status === 200) {
        alert(response.data.message);
        navigate('/success')
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Server error, please try again later.");
      }
    }
  };

  return (
    <div className=" h-screen grid items-center">
      <div className=" p-8 bg-gray-100 mx-auto rounded-lg shadow-lg shadow-gray-200">
        <h1 className=" text-3xl font-bold text-center"> Verification Code:</h1>
        <div className="flex flex-col items-center p-8">
          <div className="flex gap-1">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onDelete={(e) => handleDelete(index, e)}
                onPaste={handlePaste}
                onChange={(e) => handleChange(index, e.target.value)}
                className={`w-10 h-10 text-center text-lg border-2 rounded ${
                  error[index] ? "border-red-500" : "border-gray-600"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-indigo-950 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
