document.addEventListener("DOMContentLoaded", function () {
    // Function to update the checkout preview
    function updateCheckoutPreview() {
        const mealTypes = [
            "meat",
            "veggies",
            "family",
            "fit",
            "speedy",
            "fish",
        ];
        const mealPrices = 150;
        const planPrices = {
            2: 225,
            4: 300,
        };

        // Get the checked radio input for number of people
        const numberOfPeopleInput = document.querySelector(
            'input[name="people-radio"]:checked'
        );
        const numberOfPeople = numberOfPeopleInput
            ? numberOfPeopleInput.value
            : "2"; // Default to '2' if no radio input is checked

        // Get the checked radio input for number of meals
        const numberOfMealsInput = document.querySelector(
            'input[name="meals-radio"]:checked'
        );
        const numberOfMeals = numberOfMealsInput
            ? numberOfMealsInput.value
            : "1"; // Default to '1' if no radio input is checked

        const totalServings = numberOfPeople * numberOfMeals;

        // Get the checked checkboxes for meal types
        const selectedMealTypes = [];
        const mealTypeCheckboxes = document.querySelectorAll(
            'input[name="meal-type"]:checked'
        );
        mealTypeCheckboxes.forEach((checkbox) => {
            const mealTypeIndex = parseInt(checkbox.value);
            console.log(mealTypeIndex);
            selectedMealTypes.push(mealTypes[mealTypeIndex]);
        });
        const selectedMealType = selectedMealTypes.join(", "); // Join selected meal types with commas

        const mealTypeElement = document.querySelector(".meal-type");
        const mealCountElement = document.querySelector(".meal-count");
        const mealTotalServingsElement = document.querySelector(
            ".meal-total-servings"
        );
        const boxPriceElement = document.querySelector(
            ".box-pricing span:last-child"
        );
        const pricePerServingElement = document.querySelector(
            ".price-per-serving span:last-child"
        );
        const finalPriceElement = document.querySelector(
            ".final-price span:last-child"
        );
        const preferenceNoteElement = document.querySelector(".note p");

        if (selectedMealTypes.length === 0) {
            preferenceNoteElement.style.display = "block";
            mealTypeElement.textContent = "Choose Meal Type";
            mealCountElement.textContent = "";
            mealTotalServingsElement.textContent = "";
            boxPriceElement.textContent = "0 EGP";
            pricePerServingElement.textContent = "0 EGP";
            finalPriceElement.textContent = "0 EGP";
        } else {
            preferenceNoteElement.style.display = "none";
            mealTypeElement.textContent = selectedMealType;
            mealCountElement.textContent =
                numberOfMeals + " meals for " + numberOfPeople + " people";
            mealTotalServingsElement.textContent =
                totalServings + " total servings";

            boxPriceElement.textContent = planPrices[numberOfPeople] + "EGP";
            pricePerServingElement.textContent = mealPrices + "EGP";
            finalPriceElement.textContent =
                (
                    planPrices[numberOfPeople] +
                    totalServings * mealPrices
                ).toFixed(2) + "EGP";
        }
    }

    // Add event listeners to the radio inputs and checkboxes to trigger the update function
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((input) => {
        input.addEventListener("change", updateCheckoutPreview);
    });

    const mealTypeCheckboxes = document.querySelectorAll(
        'input[name="meal-type"]'
    );
    mealTypeCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateCheckoutPreview);
    });

    // Initial call to update the Checkout Preview section with default values
    updateCheckoutPreview();

    // Handle plans form submission
    function handlePlansFormSubmit(event) {
        event.preventDefault();

        const checkboxes = document.querySelectorAll(
            "input[type='checkbox']:checked"
        );

        const note = document.querySelector(".note");
        if (checkboxes.length === 0) {
            note.style.display = "block";
            note.style.marginBottom = "-15px";
            return;
        }

        const selectedMealTypes = [];
        const mealTypes = [
            "meat",
            "veggies",
            "family",
            "fit",
            "speedy",
            "fish",
        ];
        const finalPriceElement = document.querySelector(".final-price-span");

        checkboxes.forEach((checkbox) => {
            const mealTypeIndex = parseInt(checkbox.value);
            selectedMealTypes.push(mealTypes[mealTypeIndex]);
        });

        const finalPrice = parseInt(finalPriceElement.textContent);

        const numberOfPeopleInput = document.querySelector(
            'input[name="people-radio"]:checked'
        );
        const numberOfPeople = numberOfPeopleInput
            ? numberOfPeopleInput.value
            : "2"; // Default to '2' if no radio input is checked

        // Get the checked radio input for number of meals
        const numberOfMealsInput = document.querySelector(
            'input[name="meals-radio"]:checked'
        );
        const numberOfMeals = numberOfMealsInput
            ? numberOfMealsInput.value
            : "1"; // Default to '1' if no radio input is checked

        savePreferencesInSession(
            selectedMealTypes,
            finalPrice,
            numberOfPeople,
            numberOfMeals
        );
    }

    function savePreferencesInSession(
        selectedMealTypes,
        finalPrice,
        numberOfPeople,
        numberOfMeals
    ) {
        const formNumber = "1";

        $.ajax({
            url: "/our-plans",
            type: "POST",
            data: {
                formNumber_inp: formNumber,
                selectedMealTypes_inp: selectedMealTypes,
                finalPrice_inp: finalPrice,
                numberOfMeals_inp: numberOfMeals,
                numberOfPeople_inp: numberOfPeople,
            },
            success: function (response) {
                if (response.success) {
                    console.log("Data was stored in session");
                    movePage(1);
                } else {
                    console.log("Failed to store data in session");
                }
            },
            error: function (xhr, status, error) {
                console.log(error.body);
            },
        });
    }

    // Handle credentials form submission
    function handleCredentialsFormSubmit(event) {
        event.preventDefault();

        const inputs = document.querySelectorAll(
            ".credentials-form-container input"
        );
        let isFormComplete = true;
        inputs.forEach((input) => {
            if (input.value.trim() === "") {
                isFormComplete = false;
                return;
            }
        });

        const formData = {
            // firstName: document.querySelector(".credentials-first-name-inp")
            //     .value,
            // lastName: document.querySelector(".credentials-last-name-inp")
            //     .value,
            // email: document.querySelector(".credentials-email-inp").value,
            contactNumber: document.querySelector(".credentials-number-inp")
                .value,
            address: document.querySelector(".credentials-address-inp").value,
        };
        saveCredentialsInSessions(formData);
    }

    function saveCredentialsInSessions(formData) {
        const formNumber = "2";
        // const { firstName, lastName, email, contactNumber, address } = formData;
        const { contactNumber, address } = formData;
        $.ajax({
            url: "/our-plans",
            type: "POST",
            data: {
                formNumber_inp: formNumber,
                // firstName_inp: firstName,
                // lastName_inp: lastName,
                // email_inp: email,
                contactNumber_inp: contactNumber,
                address_inp: address,
            },
            success: function (response) {
                if (response.success) {
                    console.log("Data was stored in session");
                    movePage(2);
                } else {
                    console.log("Failed to store data in session");
                }
            },
            error: function (xhr, status, error) {
                console.log(error.body);
            },
        });
    }

    // Handle payment form submission
    function handlePaymentFormSubmit(event) {
        event.preventDefault();

        const inputs = document.querySelectorAll(
            ".payment-form-container input"
        );
        let isFormComplete = true;

        inputs.forEach((input) => {
            if (input.value.trim() === "") {
                isFormComplete = false;
                return;
            }
        });

        const cardNumber = document
            .getElementById("serialCardNumber")
            .value.trim();

        const cvvInput = document.getElementById("cvv");
        const cvvValue = cvvInput.value.trim();
        const cvvNote = cvvInput.parentElement.querySelector(".note");

        if (cvvValue.length !== 3 || isNaN(cvvValue)) {
            cvvNote.style.display = "block";
        } else {
            cvvNote.style.display = "none";
        }

        const expDateInput = document.getElementById("ExDate");
        const expDateValue = expDateInput.value.trim();
        const expDateNote = expDateInput.parentElement.querySelector(".note");

        const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expDateRegex.test(expDateValue)) {
            expDateNote.style.display = "block";
        } else {
            expDateNote.style.display = "none";
        }

        const currentYear = new Date().getFullYear();
        const expirationYear = parseInt("20" + expDateValue.substr(3)); // Extract year from MM/YY format

        if (expirationYear <= currentYear) {
            expDateNote.style.display = "block";
        } else {
            expDateNote.style.display = "none";
        }

        if (
            isFormComplete &&
            cvvNote.style.display !== "block" &&
            expDateNote.style.display !== "block"
        ) {
            savePaymentsInSessions(cardNumber, expDateValue, cvvValue);
        }
    }

    function savePaymentsInSessions(cardNumber, cardExpDate, cardCVV) {
        const formNumber = "3";

        const parsedCardNumber = parseInt(cardNumber.replace(/\s+/g, ""), 10); // Removes spaces and parses to integer
        const parsedCVV = parseInt(cardCVV, 10);

        const expDateParts = cardExpDate.split("/");
        let expDate = new Date();
        if (expDateParts.length === 2) {
            let month = parseInt(expDateParts[0], 10) - 1; // JavaScript months are 0-indexed
            let year = parseInt(expDateParts[1], 10) + 2000; // Assuming YY format for year
            expDate.setFullYear(year, month, 1); // Sets the date to the first of the given month/year
        }

        console.log(parsedCardNumber, parsedCVV, expDate);

        $.ajax({
            url: "/our-plans",
            type: "POST",
            data: {
                formNumber_inp: formNumber,
                cardNumber_inp: cardNumber,
                cardExpDate_inp: cardExpDate,
                cardCVV_inp: cardCVV,
            },
            success: function (response) {
                if (response.success) {
                    console.log("Data was stored in session");
                    movePage(3);
                } else {
                    console.log("Failed to store data in session");
                }
            },
            error: function (xhr, status, error) {
                console.log(error.body);
            },
        });
    }

    // Function to move to the next page
    function movePage(currentStep) {
        currentPage = currentStep;

        const totalSteps =
            document.querySelectorAll(".form .steps .step").length;

        const stepNode = document.querySelector(".form .steps .step");
        const width = currentPage * stepNode.offsetWidth * -1 + "px";
        stepNode.parentNode.style.marginLeft = width;

        document
            .querySelector(".form .pagination .active")
            .classList.remove("active");
        document
            .querySelectorAll(".form .pagination .number")
            [currentPage].classList.add("active");

        if (currentPage + 1 === totalSteps) {
            startConfetti();
        }
    }

    // Add event listeners for form submissions
    const plansForm = document.querySelector(".choose-plans-container");
    plansForm.addEventListener("submit", handlePlansFormSubmit);

    const credentialsForm = document.querySelector(
        ".credentials-form-container"
    );
    credentialsForm.addEventListener("submit", handleCredentialsFormSubmit);

    const paymentForm = document.querySelector(".payment-form-container");
    paymentForm.addEventListener("submit", handlePaymentFormSubmit);
});
