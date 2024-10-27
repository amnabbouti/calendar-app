const fetchFiles = async () => {
  try {
    const response = await fetch("/list-files-data");
    const files = await response.json();
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = files.length
      ? files
          .map(
            (file) => `
                    <li>
                        <a href="/download/${file}" download>${file}</a>
                        <button onclick="deleteFile('${file}')">Delete</button>
                    </li>`
          )
          .join("")
      : "<li>No files found.</li>";
  } catch (error) {
    console.error("Error fetching file list:", error);
    document.getElementById("file-list").innerHTML =
      "<li>Error loading files.</li>";
  }
};

const deleteFile = async (fileName) => {
  try {
    const response = await fetch(
      `/delete-file?fileName=${encodeURIComponent(fileName)}`,
      { method: "DELETE" }
    );
    const message = await response.text();
    showNotification(message, "success");
    fetchFiles();
  } catch (error) {
    console.error("Error deleting file:", error);
    showNotification("Error deleting file.", "error");
  }
};

const showNotification = (message, type) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  notification.style.color = type === "success" ? "#00ff00" : "#ff0000";
  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
};

document.addEventListener("DOMContentLoaded", fetchFiles);
