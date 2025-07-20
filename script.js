const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audio = document.getElementById("bg-music");
let musicStarted = false;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(1);

const messages = [
  "Happy Birthday",
  "alaa",
  "1999.27.8",
  "Happy26",
  "My Beautiful Moon",
  "My Little Princess❤",
  "My Only Love"
];

let particles = [];
let textParticles = [];
let currentMsgIndex = 0;
const delayBetweenTexts = 3000;

function drawMatrixBackground() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#b76eff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const letter = "HAPPY BIRTHDAY"[Math.floor(Math.random() * 14)];
    ctx.fillText(letter, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

function generateTargets(text) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.font = "bold 80px Arial";
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  let points = [];
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (imgData[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function createParticlesFromTargets(targets) {
  textParticles = targets.map((t, i) => {
    const prev = textParticles[i] || {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
    return {
      x: prev.x,
      y: prev.y,
      targetX: t.x,
      targetY: t.y,
      color: "hotpink",
      text: null
    };
  });
}

function createHeartShapeWithText(text) {
  const heartPoints = [];
  const scale = 20;
  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    for (let i = 0; i < 2; i++) {
      heartPoints.push({
        x: centerX + (x + i * 0.5) * scale,
        y: centerY - y * scale
      });
    }
  }

  const textTargets = generateTargets(text);
  const final = heartPoints.concat(textTargets.map(p => ({ x: p.x, y: p.y })));

  textParticles = final.map((p, i) => {
    const prev = textParticles[i] || {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
    return {
      x: prev.x,
      y: prev.y,
      targetX: p.x,
      targetY: p.y,
      color: "hotpink",
      text: null
    };
  });
}

function animate() {
  drawMatrixBackground();

  for (let p of [...textParticles, ...particles]) {
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;

    ctx.fillStyle = p.color;
    if (p.text) {
      ctx.font = "20px Arial";
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  requestAnimationFrame(animate);
}

function showNextMessage() {
  if (currentMsgIndex < messages.length) {
    const targets = generateTargets(messages[currentMsgIndex]);
    createParticlesFromTargets(targets);
    currentMsgIndex++;
    setTimeout(showNextMessage, delayBetweenTexts);
  } else {
    setTimeout(() => {
      createHeartShapeWithText("My Beautiful Princess❤");
    }, delayBetweenTexts);
  }
}

function spawnILoveYou(x, y) {
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 100;
    const tx = x + Math.cos(angle) * radius;
    const ty = y + Math.sin(angle) * radius;
    const particle = {
      x: x,
      y: y,
      targetX: tx,
      targetY: ty,
      color: "deeppink",
      text: "I love you"
    };
    particles.push(particle);
    setTimeout(() => {
      particles = particles.filter(p => p !== particle);
    }, 4000);
  }
}

canvas.addEventListener("click", (e) => {
  if (!musicStarted) {
    audio.play();
    musicStarted = true;
  }
  spawnILoveYou(e.clientX, e.clientY);
});

animate();
showNextMessage();
setInterval(drawMatrixBackground, 33);
