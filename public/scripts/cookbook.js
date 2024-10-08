function checkInput(form) {
  var searchQuery = form.search.value;
  if (searchQuery.trim() === "") {  
    printWarning("searchErr", "Please enter a search query");
    return false;
  } else {
    var RegEx = /^[a-zA-Z\s]+$/;
    if (!RegEx.test(searchQuery)) {
      printWarning("searchErr", "Please enter a valid query (letters only)");
      return false;
    } else {
      printWarning("searchErr", "");
      return true;
    }
  }
}
// Meal description functions
document.addEventListener("DOMContentLoaded", function () {
  const accordionContent = document.querySelectorAll(".description-content");

  accordionContent.forEach((item, index) => {
    let header = item.querySelector("header");
    header.addEventListener("click", () => {
      item.classList.toggle("open");

      let description = item.querySelector(".content-description");
      if (item.classList.contains("open")) {
        description.style.height = `${description.scrollHeight}px`;
      } else {
        description.style.height = "0px";
      }
      removeOpen(index);
    });
  });
});

function removeOpen(index1) {
  const accordionContent = document.querySelectorAll(".description-content");
  accordionContent.forEach((item2, index2) => {
    if (index1 !== index2) {
      item2.classList.remove("open");
      let des = item2.querySelector(".content-description");
      des.style.height = "0px";
    }
  });
}
window.displayDescription = function (overlayID, mealName, mealDescription) {
  var id = document.getElementById(overlayID);
  if (!id) {
    console.error("Element with ID " + overlayID + " not found");
    return;
  }

  var name = id.querySelector(".dishName");
  var description = id.querySelector(".extension");

  if (!name) {
    console.error(
      "Element with class 'dishName' not found inside " + overlayID
    );
    return;
  }

  if (!description) {
    console.error(
      "Element with class 'extension' not found inside " + overlayID
    );
    return;
  }

  name.textContent = mealName;
  description.textContent = mealDescription;

  id.style.display = "block";
};

window.closeWindow = function (ID) {
  var window = document.getElementById(ID);
  if (!window) {
    console.error("Element with ID " + ID + " not found");
    return;
  }
  window.style.display = "none";
};

function loadMeals(page) {
  fetch(`?page=${page}`)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      document.querySelector(".meals-container").innerHTML =
        doc.querySelector(".meals-container").innerHTML;
      document.querySelector("#pagination-links").innerHTML =
        doc.querySelector("#pagination-links").innerHTML;

      history.pushState({}, "", `?page=${page}`);
      attachPaginationEventListeners(); 
    })
    .catch((error) => console.error("Error fetching meals:", error));
}


function attachPaginationEventListeners() {
  const paginationLinks = document.querySelectorAll(".pagination a");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const page = this.getAttribute("href").split("=")[1];
      loadMeals(page);
    });
  });
}


document.addEventListener("DOMContentLoaded", attachPaginationEventListeners);
