document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  displayImage();
});

async function displayImage() {
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "none";
  const search_query = document.getElementById("userInput").value;
  const images = await fetchingDataFromPexels(search_query);
  console.log(images);
  const imageContainer = document.getElementById("imageContainer");

  // It resets the previous search result in UI
  imageContainer.innerHTML = "";

  images.map((image) => {
    const img = document.createElement("img");
    img.src = image.src.original;
    img.className = "fetched-img";
    imageContainer.appendChild(img);
  });

  formContainer.style.display = "flex";
}

async function fetchingDataFromPexels(search_query) {
  const apiKey = "API_KEY";

  if (search_query !== "") {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${search_query}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log(data.photos);
      return data.photos;
    } catch (err) {
      console.log("Error while fetching the data from API, " + err.message);
      return [];
    }
  } else {
    return [];
  }
}
