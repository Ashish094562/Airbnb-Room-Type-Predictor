const API_URL = "https://airbnb-room-type-predictor-bvjh.onrender.com";

const form = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");
const buttonText = document.getElementById("buttonText");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("errorMessage");
const errorText = errorMessage.querySelector("p");

const resultPlaceholder =
    document.getElementById("resultPlaceholder");

const predictionResult =
    document.getElementById("predictionResult");

const predictionValue =
    document.getElementById("predictionValue");

const confidenceValue =
    document.getElementById("confidenceValue");

const confidenceBar =
    document.getElementById("confidenceBar");

const probabilityBars =
    document.getElementById("probabilityBars");

const availability =
    document.getElementById("availability_365");

const availabilityValue =
    document.getElementById("availabilityValue");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const locationText =
    document.getElementById("locationText");

const apiStatus =
    document.getElementById("apiStatus");

const statusDot =
    document.querySelector(".status-dot");

const neighborhoodGroup =
    document.getElementById("neighbourhood_group");

const neighborhood =
    document.getElementById("neighbourhood");


availability.addEventListener("input", () => {
    availabilityValue.textContent = availability.value;
});


function updateLocation() {
    locationText.textContent =
        `${latitude.value}, ${longitude.value}`;
}


latitude.addEventListener("input", updateLocation);
longitude.addEventListener("input", updateLocation);


function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = "flex";
}


function hideError() {
    errorMessage.style.display = "none";
}


function setLoading(loading) {
    predictButton.disabled = loading;

    if (loading) {
        buttonText.textContent = "Analyzing...";
        spinner.style.display = "inline-block";
    } else {
        buttonText.textContent = "Predict Room Type";
        spinner.style.display = "none";
    }
}


function getFormData() {
    return {
        latitude: parseFloat(latitude.value),

        longitude: parseFloat(longitude.value),

        price: parseFloat(
            document.getElementById("price").value
        ),

        minimum_nights: parseInt(
            document.getElementById("minimum_nights").value
        ),

        number_of_reviews: parseInt(
            document.getElementById("number_of_reviews").value
        ),

        reviews_per_month: parseFloat(
            document.getElementById("reviews_per_month").value
        ),

        calculated_host_listings_count: parseInt(
            document.getElementById(
                "calculated_host_listings_count"
            ).value
        ),

        availability_365: parseInt(
            availability.value
        ),

        neighbourhood_group:
            neighborhoodGroup.value,

        neighbourhood:
            neighborhood.value
    };
}


function getClassNames() {
    return [
        "Entire home/apt",
        "Private room",
        "Shared room",
        "Hotel room"
    ];
}


function displayProbabilities(probabilities) {

    probabilityBars.innerHTML = "";

    const classNames = getClassNames();

    let highestProbability = -1;
    let highestIndex = 0;

    probabilities.forEach((value, index) => {

        if (value > highestProbability) {
            highestProbability = value;
            highestIndex = index;
        }

        const percentage =
            Math.max(0, Math.min(100, value * 100));

        const name =
            classNames[index] ||
            `Class ${index + 1}`;

        const item =
            document.createElement("div");

        item.className =
            "probability-item";

        item.innerHTML = `
            <div class="probability-label">
                <span>${name}</span>
                <span>${percentage.toFixed(1)}%</span>
            </div>

            <div class="probability-track">
                <div
                    class="probability-fill"
                    style="width: 0%"
                ></div>
            </div>
        `;

        probabilityBars.appendChild(item);

        setTimeout(() => {
            const bar =
                item.querySelector(".probability-fill");

            bar.style.width =
                `${percentage}%`;
        }, 100 + index * 120);
    });

    const confidence =
        Math.max(
            0,
            Math.min(
                100,
                highestProbability * 100
            )
        );

    confidenceValue.textContent =
        `${confidence.toFixed(1)}%`;

    setTimeout(() => {
        confidenceBar.style.width =
            `${confidence}%`;
    }, 100);
}


function displayPrediction(data) {

    resultPlaceholder.style.display = "none";

    predictionResult.style.display = "block";

    predictionValue.textContent =
        data.Predicted_room_type;

    confidenceBar.style.width = "0%";

    const probabilities =
        data.probability;

    if (
        Array.isArray(probabilities) &&
        probabilities.length > 0
    ) {
        displayProbabilities(probabilities);
    } else {
        confidenceValue.textContent = "N/A";
        confidenceBar.style.width = "0%";
        probabilityBars.innerHTML =
            "<p>No probability data available.</p>";
    }

    predictionResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


async function checkAPI() {

    try {

        const response =
            await fetch(`${API_URL}/`);

        if (!response.ok) {
            throw new Error();
        }

        apiStatus.textContent =
            "API Connected";

        statusDot.style.background =
            "#16a34a";

    } catch (error) {

        apiStatus.textContent =
            "API Offline";

        statusDot.style.background =
            "#dc2626";
    }
}


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideError();

    const data = getFormData();

    if (
        !Number.isFinite(data.latitude) ||
        data.latitude < -90 ||
        data.latitude > 90
    ) {
        showError(
            "Latitude must be between -90 and 90."
        );
        return;
    }

    if (
        !Number.isFinite(data.longitude) ||
        data.longitude < -180 ||
        data.longitude > 180
    ) {
        showError(
            "Longitude must be between -180 and 180."
        );
        return;
    }

    if (
        !data.neighbourhood_group ||
        !data.neighbourhood
    ) {
        showError(
            "Please select both borough and neighborhood."
        );
        return;
    }

    setLoading(true);

    try {

        const response =
            await fetch(`${API_URL}/predict`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

        const result =
            await response.json();

        if (!response.ok) {

            let message =
                "Prediction failed.";

            if (result.detail) {

                if (Array.isArray(result.detail)) {

                    message =
                        result.detail
                            .map(item => item.msg)
                            .join(", ");

                } else {

                    message =
                        result.detail;
                }
            }

            throw new Error(message);
        }

        displayPrediction(result);

    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Unable to connect to the prediction API."
        );

    } finally {

        setLoading(false);
    }
});


neighborhoodGroup.addEventListener(
    "change",
    () => {

        const borough =
            neighborhoodGroup.value;

        if (!borough) {
            neighborhood.value = "";
            return;
        }

        const options =
            Array.from(
                neighborhood.options
            );

        const allowed = {
            Manhattan: [
                "Upper West Side",
                "Upper East Side",
                "Harlem",
                "Chelsea",
                "SoHo",
                "Midtown"
            ],

            Brooklyn: [
                "Greenpoint",
                "Williamsburg",
                "Bedford-Stuyvesant",
                "Bushwick"
            ],

            Queens: [
                "Astoria",
                "Long Island City"
            ],

            Bronx: [],

            "Staten Island": []
        };

        options.forEach(option => {

            if (!option.value) {
                option.hidden = false;
                return;
            }

            if (!allowed[borough]) {
                option.hidden = false;
                return;
            }

            option.hidden =
                !allowed[borough]
                    .includes(option.value);
        });

        neighborhood.value = "";
    }
);


checkAPI();