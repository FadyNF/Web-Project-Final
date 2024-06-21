function printWarning(elementID, message) {
  document.getElementById(elementID).innerHTML = message;
}

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
      return true; // Return true when input is valid
    }
  }
}

function showBox() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const feedbackContent = document.getElementById("feedbackContent");
  feedbackContent.style.display = "block";
  feedbackContent.style.zIndex = "1000";
}

function showTextArea(event) {
  const feedbackForm = document.getElementById("feedback");
  feedbackForm.style.display = "block";
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
  event.target.classList.add("selected");
}

function showFeedbackForm() {
  const feedbackForm = document.getElementById("feedback");
  feedbackForm.style.display =
    feedbackForm.style.display === "none" ? "block" : "none";
}

function exitFeedback() {
  const feedbackContent = document.getElementById("feedbackContent");
  feedbackContent.style.display = "none";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

function feedbackInput(form) {
  var review = form.review.value.trim();
  var reviewErr = document.getElementById("reviewErr");

  if (review === "") {
    printWarning("reviewErr", "Please enter your opinion before submitting");
    return false;
  } else {
    var regEx = /^[a-zA-Z0-9\s]+$/;
    if (!regEx.test(review)) {
      printWarning(
        "reviewErr",
        "Please enter a valid review (letters, numbers, and spaces only)"
      );
      return false;
    } else {
      printWarning("reviewErr", "");
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

//Handling the favorite button
function addToFavorites(event, itemName) {
  const target = event.target;
  if (target.classList.contains("favorited")) {
    target.classList.remove("favorited");
  } else {
    showNotification();
    target.classList.add("favorited");
  }
}
function showNotification() {
  var notification = document.getElementById("notification");
  notification.classList.add("show");
  setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}


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
