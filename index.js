import { initModel, trainModel } from "./model.js";

const trainButton = document.querySelector("#train-btn");
const trainLoading = document.querySelector("#train-btn i");
const predictionContainer = document.querySelector(".prediction-container");
const predictionInput = document.querySelector(".prediction-container input");
const predictButton = document.querySelector(".prediction-container button");

const output = document.querySelector("#output");

let model;

console.log(trainButton);

trainButton.addEventListener("click", async () => {
  trainLoading.classList.remove("visually-hidden");
  trainButton.setAttribute("disabled", "");
  setTimeout(async () => {
    model = await initModel({});
    await trainModel(model);
    Swal.fire({
      icon: "success",
      title: "Entrenamiento terminado",
      text: "El modelo está listo para ser utilizado.",
    });
    trainLoading.classList.add("visually-hidden");
    predictionContainer.classList.remove("visually-hidden");
  }, 100);
});

predictButton.addEventListener("click", async () => {
  if (!model) return;
  const input = predictionInput.value;
  const loader = predictButton.querySelector("i");
  loader.classList.remove("visually-hidden");
  predictButton.setAttribute("disabled", "");
  setTimeout(async () => {
    const prediction = await model.predict([input]);
    renderOutput(prediction);
    loader.classList.add("visually-hidden");
    predictButton.removeAttribute("disabled");
  }, 100);
});

renderOutput([
  {
    label: "Toxicity",
    results: [
      {
        match: true,
        probabilities: [0.9, 0.1],
      },
    ],
  },
]);

function renderOutput(predictionData) {
  output.innerHTML = "";
  for (const result of predictionData) {
    const toxicProbabilities = result.results[0].probabilities[1];
    const nonToxicProbabilities = result.results[0].probabilities[0];
    output.innerHTML += `
            <div class="prediction">
                <h3>${result.label}</h3>
                <p>Match: ${result.results[0].match}</p>
                <p>Probabilidad de tóxico: <span>${toxicProbabilities}</span></p>
                <p>Probabilidad de no tóxico: <span>${nonToxicProbabilities}</span></p>
                <div class="progress">
                    <div
                        class="progress-bar progress-bar-striped bg-danger"
                        role="progressbar"
                        style="width: ${Math.floor(toxicProbabilities * 100)}%;"
                        aria-valuenow="${Math.floor(toxicProbabilities * 100)}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        ${Math.floor(toxicProbabilities * 100)}% Tóxico
                    </div>
                </div>
                
            </div>
        `;
  }
}
