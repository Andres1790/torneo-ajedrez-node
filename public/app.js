// Lógica del lado del navegador: recibe datos, valida y realiza los cálculos.

const form = document.getElementById("tournament-form");
const resetButton = document.getElementById("reset-button");
const message = document.getElementById("form-message");

const fields = {
  participants: document.getElementById("participants"),
  fee: document.getElementById("fee"),
  areaPerTable: document.getElementById("area-per-table"),
  extraArea: document.getElementById("extra-area"),
  rent: document.getElementById("rent"),
  arbiter: document.getElementById("arbiter"),
  setup: document.getElementById("setup"),
  snack: document.getElementById("snack"),
  materials: document.getElementById("materials"),
  medals: document.getElementById("medals"),
  digitalCertificates: document.getElementById("digital-certificates")
};

const initialValues = {
  participants: 32,
  fee: 40000,
  areaPerTable: 4,
  extraArea: 24,
  rent: 150000,
  arbiter: 120000,
  setup: 50000,
  snack: 8000,
  materials: 2000,
  medals: 90000,
  digitalCertificates: 8000
};

function readValues() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, input]) => [key, Number(input.value)])
  );
}

function validate(data) {
  if (!Number.isInteger(data.participants) || data.participants < 1 || data.participants > 500) {
    return "Ingresa entre 1 y 500 participantes (un número entero).";
  }

  const numericValues = Object.entries(data).filter(([key]) => key !== "participants");
  if (numericValues.some(([, value]) => !Number.isFinite(value) || value < 0)) {
    return "Revisa los valores: no pueden estar vacíos ni ser negativos.";
  }

  if (data.areaPerTable <= 0) {
    return "El área por mesa debe ser mayor que cero.";
  }

  return "";
}

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function show(id, value) {
  document.getElementById(id).textContent = value;
}

function calculate(data) {
  // A: una mesa para dos jugadores. Math.ceil redondea hacia arriba.
  const tables = Math.ceil(data.participants / 2);
  const area = (tables * data.areaPerTable) + data.extraArea;

  // B: costos fijos de organización.
  const fixedCost = data.rent + data.arbiter + data.setup;
  const variablePerParticipant = data.snack + data.materials;
  const variableCost = variablePerParticipant * data.participants;

  // C: comparación de reconocimientos.
  // En A y B se estima $1.000 por certificado impreso y participante.
  const printedCertificates = 1000 * data.participants;
  const optionA = data.medals + printedCertificates;
  const optionB = 120000 + printedCertificates;
  const optionC = data.medals + data.digitalCertificates;

  const recognitionCost = Math.min(optionA, optionB, optionC);
  const totalCost = fixedCost + variableCost + recognitionCost;

  // Ingresos por inscripciones y resultado económico.
  const income = data.fee * data.participants;
  const surplus = income - totalCost;

  // Punto de equilibrio: cantidad mínima entera de jugadores para cubrir costos.
  const fixedForBreakEven = fixedCost + recognitionCost;
  const contributionPerPlayer = data.fee - variablePerParticipant;
  let breakEven;

  if (contributionPerPlayer <= 0) {
    breakEven = null;
  } else {
    breakEven = Math.max(0, Math.ceil(fixedForBreakEven / contributionPerPlayer));
  }

  return {
    tables, area, fixedCost, variableCost, optionA, optionB, optionC,
    recognitionCost, totalCost, income, surplus, breakEven
  };
}

function render(result, data) {
  show("result-participants", data.participants);
  show("result-tables", `${result.tables} ${result.tables === 1 ? "mesa de juego" : "mesas de juego"}`);
  show("result-area", `${result.area.toLocaleString("es-CO")} m²`);
  show("result-cost", formatCOP(result.totalCost));
  show("result-income", formatCOP(result.income));
  show("selected-recognition", `Alternativa ${[
    { name: "A", cost: result.optionA },
    { name: "B", cost: result.optionB },
    { name: "C", cost: result.optionC }
  ].reduce((best, current) => current.cost < best.cost ? current : best).name} seleccionada`);

  show("fixed-cost", formatCOP(result.fixedCost));
  show("recognition-cost", formatCOP(result.recognitionCost));
  show("variable-cost", formatCOP(result.variableCost));
  show("total-cost", formatCOP(result.totalCost));
  show("result-surplus", formatCOP(result.surplus));

  const explanation = result.surplus >= 0
    ? "Excedente estimado. No incluye gastos adicionales no contemplados."
    : "Déficit estimado: los ingresos no alcanzan para cubrir los costos.";
  show("surplus-explanation", explanation);

  show("break-even", result.breakEven === null
    ? "No se alcanza con esta inscripción"
    : `${result.breakEven} ${result.breakEven === 1 ? "participante" : "participantes"}`);

  show("option-a", formatCOP(result.optionA));
  show("option-b", formatCOP(result.optionB));
  show("option-c", formatCOP(result.optionC));

  const options = [
    { name: "A", cost: result.optionA },
    { name: "B", cost: result.optionB },
    { name: "C", cost: result.optionC }
  ];
  const cheapest = options.reduce((best, current) => current.cost < best.cost ? current : best);
  show("recommendation", `Recomendación: alternativa ${cheapest.name}, con un costo de ${formatCOP(cheapest.cost)} para ${data.participants} participantes.`);

  // Gráfica comparativa: las barras usan la misma escala para facilitar la lectura.
  const chartMaximum = Math.max(result.income, result.totalCost, 1);
  document.getElementById("income-bar").style.width = `${(result.income / chartMaximum) * 100}%`;
  document.getElementById("cost-bar").style.width = `${(result.totalCost / chartMaximum) * 100}%`;
  show("chart-income", formatCOP(result.income));
  show("chart-cost", formatCOP(result.totalCost));
  show("chart-result", `${result.surplus >= 0 ? "Excedente" : "Déficit"} estimado: ${formatCOP(Math.abs(result.surplus))}`);
  document.getElementById("chart-result").classList.toggle("negative-result", result.surplus < 0);
}

function runCalculation(event) {
  if (event) event.preventDefault();

  const data = readValues();
  const error = validate(data);

  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "";
  const result = calculate(data);
  render(result, data);
}

form.addEventListener("submit", runCalculation);

// Actualiza resultados y gráfica mientras se editan los datos.
Object.values(fields).forEach((input) => {
  input.addEventListener("input", runCalculation);
});

resetButton.addEventListener("click", () => {
  Object.entries(initialValues).forEach(([key, value]) => {
    fields[key].value = value;
  });
  message.textContent = "";
  runCalculation();
});

// Muestra los resultados iniciales al abrir la página.
runCalculation();
