const confetti = require("canvas-confetti");

let participants = [];
let colors = [];
let spinning = false;
let rotationSpeed = Math.PI / 20; // Vitesse de rotation constante

window.onload = function () {
  const storedParticipants = localStorage.getItem("participants");
  const storedColors = localStorage.getItem("colors");
  if (storedParticipants && storedColors) {
    participants = JSON.parse(storedParticipants);
    colors = JSON.parse(storedColors);
    drawWheel();
  }

  // Ajoutez l'écouteur d'événements ici
  document
    .getElementById("participantInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addParticipant();
      }
    });
};

window.addParticipant = function () {
  let input = document.getElementById("participantInput").value;
  if (input.trim() === "") {
    alert("Veuillez entrer un nom.");
    return;
  }
  participants.push(input.trim());
  colors.push(getRandomColor());
  document.getElementById("participantInput").value = "";

  saveParticipants();
  drawWheel();
};

function saveParticipants() {
  localStorage.setItem("participants", JSON.stringify(participants));
  localStorage.setItem("colors", JSON.stringify(colors));
}

function drawWheel() {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const arc = Math.PI / (participants.length / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < participants.length; i++) {
    const angle = i * arc;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + arc, false);
    ctx.lineTo(radius, radius);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000"; //! Changez la couleur des noms ici
    ctx.font = "20px Arial";
    ctx.fillText(participants[i], radius - 10, 10);
    ctx.restore();
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.spinWheel = function () {
  if (spinning || participants.length === 0) {
    return;
  }
  spinning = true;
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const arc = Math.PI / (participants.length / 2);
  let angle = 0;
  let spinTime = 0;
  const spinTimeTotal = 3000; // 3 seconds

  function rotateWheel() {
    spinTime += 20;
    if (spinTime >= spinTimeTotal) {
      clearInterval(spinInterval);
      const randomIndex = Math.floor(Math.random() * participants.length);
      const winnerAngle = randomIndex * arc;
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(winnerAngle + arc / 2);
      ctx.restore();
      showResultModal(participants[randomIndex]);
      spinning = false;
      return;
    }
    angle += rotationSpeed;
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle);
    ctx.translate(-radius, -radius);
    drawWheel();
    ctx.restore();
  }

  const spinInterval = setInterval(rotateWheel, 20);
};

function showResultModal(winner) {
  const modal = document.getElementById("resultModal");
  const resultText = document.getElementById("result");
  resultText.innerHTML = `Félicitations : ${winner}`;
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Add confetti when modal appears
  confetti({
    particleCount: 1000,
    spread: 360,
    origin: { x: 0, y: 0.5 },
  });
  confetti({
    particleCount: 1000,
    spread: 360,
    origin: { x: 1, y: 0.5 },
  });
}

window.closeModal = function () {
  const modal = document.getElementById("resultModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

window.reset = function () {
  participants = [];
  colors = [];
  localStorage.removeItem("participants");
  localStorage.removeItem("colors");
  drawWheel();
};
