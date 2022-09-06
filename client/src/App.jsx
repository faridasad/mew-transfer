import "./app.scss";
import axios from "axios";
import { useState } from "react";

function App() {
  const [filename, setFilename] = useState("");
  const [itemlink, setItemlink] = useState("");
  const [nextStep, setNextStep] = useState(false);
  const data = new FormData();

  const uploadFile = (files) => {
    Array.from(files).forEach((file) => {
      data.append("file", file);
    });

    for (const value of data.values()) {
      console.log(value);
    }
  };

  const addFile = (e) => {
    const files = e.target.files;
    uploadFile(files);
  };

  const getLink = () => {
    axios
      .post("http://localhost:3000/upload", data)
      .then(res => console.log(res.statusText))
      /* .then((res) => setItemlink(res.data.fileLink)); */
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
        <form className="upload-container" encType="multipart/form-data">
          <div className="add-files">
            <input
              onChange={addFile}
              type="file"
              id="addFile"
              multiple
              required
            />
            <span className="add-button">+</span>
            <p>Add your files</p>
            {filename && (
              <>
                <span className="divider"></span>
                <span className="uploaded-filename">{filename}</span>
              </>
            )}
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
          {nextStep && (
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
          {!nextStep && (
            <button type="submit" onClick={(e) => {e.preventDefault(); getLink()} }>
              Get a link
            </button>
          )}
        </form>
      </main>
    </>
  );
}

export default App;
