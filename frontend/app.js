const form = document.getElementById("prediction-form");
const result = document.getElementById("result");
const emptyResult = document.getElementById("empty-result");
const button = document.querySelector(".predict-button");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Loading state
    button.disabled = true;
    button.textContent = "Calculating risk...";

    const formData = new FormData(form);
    const customer = Object.fromEntries(formData.entries());

    if (customer.InternetService === "No") {
        internetDependentFields.forEach(function (fieldName) {
            customer[fieldName] = "No internet service";
        });
    }



    // Convert numerical fields
    customer.SeniorCitizen = Number(customer.SeniorCitizen);
    customer.tenure = Number(customer.tenure);
    customer.MonthlyCharges = Number(customer.MonthlyCharges);
    customer.TotalCharges = Number(customer.TotalCharges);

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });

        if (!response.ok) {
            throw new Error("Prediction request failed");
        }

        const data = await response.json();

        const probability = data.churn_probability * 100;
        const threshold = data.threshold * 100;

        let riskLevel;

        if (probability < threshold) {
            riskLevel = "Low Risk";
        } else if (probability < 60) {
            riskLevel = "Moderate Risk";
        } else {
            riskLevel = "High Risk";
        }

        emptyResult.style.display = "none";
        result.style.display = "block";

        result.innerHTML = `
            <div class="prediction-result">

                <div class="risk-status">
                    ${riskLevel}
                </div>

                <div class="probability">
                    ${probability.toFixed(1)}%
                </div>

                <p class="probability-label">
                    Estimated churn probability
                </p>

                <div class="risk-bar">
                    <div
                        class="risk-fill"
                        style="width: ${probability}%"
                    ></div>

                    <div
                        class="threshold-marker"
                        style="left: ${threshold}%"
                    ></div>
                </div>

                <div class="bar-labels">
                    <span>0%</span>
                    <span>Threshold: ${threshold.toFixed(0)}%</span>
                    <span>100%</span>
                </div>

                <div class="prediction-summary">
                    Prediction:
                    <strong>${data.prediction_label}</strong>
                </div>

            </div>
        `;

    } catch (error) {

        emptyResult.style.display = "none";
        result.style.display = "block";

        result.innerHTML = `
            <div class="error-message">
                Unable to generate a prediction.
                Please check the customer information and try again.
            </div>
        `;

    } finally {

        button.disabled = false;
        button.textContent = "Predict Churn Risk";

    }
});

const internetService = document.querySelector(
    '[name="InternetService"]'
);

const internetDependentFields = [
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies"
];

function updateInternetFields() {

    const noInternet = internetService.value === "No";

    internetDependentFields.forEach(function (fieldName) {

        const field = document.querySelector(
            `[name="${fieldName}"]`
        );

        if (noInternet) {
            field.value = "No internet service";
            field.disabled = true;
        } else {
            field.disabled = false;

            if (field.value === "No internet service") {
                field.value = "No";
            }
        }
    });
}

internetService.addEventListener(
    "change",
    updateInternetFields
);

updateInternetFields();