const form = document.getElementById("prediction-form");
const result = document.getElementById("result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const customer = Object.fromEntries(formData.entries());

    // Convert numerical fields from strings to numbers
    customer.SeniorCitizen = Number(customer.SeniorCitizen);
    customer.tenure = Number(customer.tenure);
    customer.MonthlyCharges = Number(customer.MonthlyCharges);
    customer.TotalCharges = Number(customer.TotalCharges);

    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    });

    const data = await response.json();

    result.style.display = "block";

    result.innerHTML = `
        <h2>${data.prediction_label}</h2>
        <p>Churn probability: ${(data.churn_probability * 100).toFixed(1)}%</p>
    `;
});