let data;
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch("/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("loginMessage").innerText = data.message;
          if (data.message === "Logged in successfully!") {
            window.location.href = "/html/dashboard.html";
          }
        });
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch("/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("registerMessage").innerText = data.message;
        });
    });
  }

  if (window.location.pathname === "/html/dashboard.html") {
    fetch("/user-info")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.name) {
          document.getElementById("email").innerText = data.email;

          // Fetch and display search history
          fetch("/get-history")
            .then((response) => response.json())
            .then((history) => {
              const historyContainer =
                document.getElementById("history-container");
              history.forEach((item) => {
                const div = document.createElement("div");
                div.classList.add("card");
                div.textContent = item.query;
                historyContainer.appendChild(div);
              });
            });

          // Add event listener to the search form
          const searchForm = document.getElementById("searchForm");
          if (searchForm) {
            searchForm.addEventListener("submit", function (e) {
              e.preventDefault();
              const query = document.getElementById("userInput").value.trim();
              if (query === "") return;

              // Save the search history
              fetch("/save-history", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, query }),
              })
                .then((response) => {
                  if (response.ok) {
                    // Update the history section
                    const historyContainer =
                      document.getElementById("history-container");
                    const div = document.createElement("div");
                    div.classList.add("card");
                    div.textContent = query;
                    historyContainer.appendChild(div);
                    console.log("Search history saved successfully.");
                  } else {
                    console.error("Failed to save search history.");
                  }
                })
                .catch((error) => {
                  console.error("Error saving search history:", error);
                });

              // Perform the search
              performSearch(query);
            });
          }
        } else {
          window.location.href = "/html/signin.html";
        }
      });
  }
});

function performSearch(query) {
  const search_query = document.getElementById("userInput").value;
  fetchingDataFromPexels(search_query).then((images) => {
    const imageContainer = document.getElementById("imageContainer");

    // It resets the previous search result in UI
    imageContainer.innerHTML = "";

    images.map((image) => {
      const img = document.createElement("img");
      img.src = image.src.original;
      img.className = "fetched-img";
      imageContainer.appendChild(img);
    });
  });
}

function logout() {
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/html/home.html"; // Redirect to home.html after successful logout
      } else {
        response.json().then((data) => {
          console.error("Failed to logout:", data.message);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function showLogin() {
  window.location.href = "/html/signin.html";
}
function showRegister() {
  window.location.href = "/html/signup.html";
}
