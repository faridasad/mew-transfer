import "./app.scss";
import axios from "axios";
import { useState, useMemo } from "react";

function App() {
  const [userFiles, setUserFiles] = useState([]);
  const [itemlink, setItemlink] = useState("");
  const formData = useMemo(() => new FormData(), []);

  const uploadFile = (files) => {
    let arr = [];
    Array.from(files).forEach((file) => {
      formData.append(file.name, file);
      arr.push(file.name);
      setUserFiles([...userFiles, ...arr]);
    });

    for(const value of formData.values()){
      console.log(value)
    }
  };

  const addFile = (e) => {
    const files = e.target.files;
    uploadFile(files);
  };

  const getLink = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:3000/upload", formData)
      .then((res) => setItemlink(res.data.fileLink))
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
        <form className="upload-container" encType="multipart/form-data" onSubmit={getLink}>
          <div className={"add-files " + (userFiles.length > 0 && "active")}>
            {userFiles.length > 0 && (
              <div className="files-con">
                {userFiles.map((file, index) => (
                  <span key={index} className="filename">
                    {file}
                  </span>
                ))}
              </div>
            )}
            <div className="wrapper">
              <input
                onChange={addFile}
                type="file"
                id="addFile"
                multiple
                required
              />
              <span className="add-button">+</span>
              <span className="input-text">
                Add your files <br /> <p>(Max size: 25MB)</p>
              </span>
              <div className="uploaded-files"></div>
            </div>
          </div>
          <div className="details">
            <input type="text" name="" id="" placeholder="Title" />
            <span className="divider"></span>
            <textarea
              name=""
              id=""
              cols="30"
              rows="4"
              placeholder="Message"
            ></textarea>
          </div>
          {itemlink && (
            <div className="link-container">
              <a href={`http://localhost:3000/${itemlink}`}>{itemlink}</a>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(`http://localhost:3000/${itemlink}`)
                }
              >
                <ion-icon name="copy-outline"></ion-icon>
              </span>
            </div>
          )}
          <button
            disabled={userFiles.length === 0}
            type="submit"
          >
            Get a link
          </button>
        </form>
      </main>
    </>
  );
}

export default App;
