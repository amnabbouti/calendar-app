const form = document.getElementById("upload-form");
const responseDiv = document.getElementById("response");
const progressBarInner = document.querySelector(".progress-bar-inner");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "/upload");
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      progressBarInner.style.width = `${Math.round(
        (event.loaded * 100) / event.total
      )}%`;
    }
  };

  xhr.onload = () => {
    responseDiv.innerHTML =
      xhr.status === 200 ? xhr.responseText : "Error uploading file.";
    progressBarInner.parentElement.style.display = "none";
    form.reset();
    showNotification(
      xhr.status === 200
        ? "File uploaded successfully!"
        : "Error uploading file.",
      xhr.status === 200 ? "success" : "error"
    );
  };

  xhr.onerror = () => showNotification("Error uploading file.", "error");

  progressBarInner.parentElement.style.display = "block";
  xhr.send(formData);
});

const showNotification = (message, type) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  notification.style.backgroundColor =
    type === "success" ? "rgba(0, 128, 0, 0.9)" : "rgba(255, 0, 0, 0.9)";
  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
};
