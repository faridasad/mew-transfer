import "./app.scss";
import axios from "axios";
import { useState, useMemo, useRef } from "react";
import {formatBytes} from "./utils/sizeFormatter.js";

function App() {
  const [userFiles, setUserFiles] = useState([]);
  const [itemlink, setItemlink] = useState("");
  const [error, setError] = useState({
    status: false,
    errorText: "",
  });
  const formData = useMemo(() => new FormData(), []);
  const titleInput = useRef(null);

  const uploadFile = (files) => {
    let arr = [];
    Array.from(files).forEach((file) => {
      if (file.size > 25 * 1000 * 1000)
        setError({ status: true, errorText: "File size exceeded!" });
      else {
        setError({ ...error, status: false });
        formData.append("file", file);
        arr.push({ name: file.name, size: file.size, type: file.type });
        setUserFiles([...userFiles, ...arr]);
      }
    });

    titleInput.current.value = files[0].name
  };

  const addFile = (e) => {
    const files = e.target.files;
    uploadFile(files);
  };

  const deleteFile = (file, index) => {
    let values = formData.getAll("file");
    values.splice(index, 1);

    formData.delete("file");

    values.forEach((item) => {
      formData.append("file", item);
    });
    setUserFiles(userFiles.filter((item) => item !== file));
  };

  const getLink = (e) => {
    setError({ ...error, status: false });
    e.preventDefault();

    formData.append("title", titleInput.current.value);

    axios
      .post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setItemlink(res.data.fileLink);
      })
      .catch((err) => {
        err.response.status == 400 &&
          setError({ status: true, errorText: err.response.data.error_msg });
      });
  };

  return (
    <>
      <header>
        <img className="logo" src="/mew-logo.png" alt="MEW" />
        <nav className="links">
          <li className="links-item">Pricing</li>
          <li className="links-item">Company</li>
          <li className="links-item">Help</li>
          <li className="links-item">Sign up</li>
          <li className="links-item">Log in</li>
        </nav>
      </header>
      <main>
        <form
          className="upload-container"
          encType="multipart/form-data"
          onSubmit={getLink}
        >
          <div className={"add-files " + (userFiles.length > 0 && "active")}>
            {userFiles.length > 0 && (
              <div className="files-con">
                {userFiles.map((file, index) => (
                  <span key={index} className="filename">
                    <span className="file-details">
                      <p>{file.name}</p>
                      <p>{formatBytes(file.size)} &#x2022; {file.type.split("/").pop()} </p>
                    </span>
                    <span className="close-button" onClick={() => deleteFile(file, index)}>X</span>
                  </span>
                ))}
              </div>
            )}
            <div className="wrapper">
              <input
                onChange={addFile}
                name="file"
                type="file"
                id="file-input"
                multiple
                directory="true"
                title=""
              />
              
              <span className="add-button">+</span>
              <span className="input-text">
                Add your files <br /> <p>(Max size: 25MB)</p>
                
              </span>
              <label className="folder-label" htmlFor="folder-input">or Choose a folder</label>
              <input
                onChange={addFile}
                name="folder"
                type="file"
                id="folder-input"
                multiple
                webkitdirectory="true"
                title=""
                style={{display: "none"}}
              />
              
              
              
              <div className="uploaded-files"></div>
            </div>
          </div>
          <div className="details">
            <input
              type="text"
              ref={titleInput}
              name=""
              id=""
              placeholder="Title"
            />
            <span className="divider"></span>
            <textarea
              name=""
              id=""
              cols="30"
              rows="4"
              placeholder="Message"
            ></textarea>
          </div>
          {error.status == true && (
            <span className="error-text">{error.errorText}</span>
          )}
          {itemlink && userFiles.length > 0 && (
            <div className="link-container">
              <a href={`http://localhost:3000/${itemlink}`}>{itemlink}</a>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(
                    `http://localhost:3000/${itemlink}`
                  )
                }
              >
                <ion-icon name="copy-outline"></ion-icon>
              </span>
            </div>
          )}
          <button disabled={userFiles.length === 0} type="submit">
            Get a link
          </button>
        </form>
      </main>
    </>
  );
}

export default App;
