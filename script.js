const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// ✅ مقاسات ديناميكية حسب الشاشة
const baseSize = Math.min(window.innerWidth, window.innerHeight);
const fontSize = Math.floor(baseSize / 80);         // حجم حروف الماتريكس
const dynamicFontSize = Math.floor(baseSize / 8);   // النصوص الكبيرة (مثل BIRTHDAY)
const finalTextSize = Math.floor(baseSize / 15);    // النص الأخير فوق القلب
const heartScale = Math.floor(baseSize / 40);       // حجم القلب
const pointGap = Math.max(2, Math.floor(baseSize / 200)); // المسافة بين نقاط الكلمة

const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(1);

const messages = [
  "3",
  "2",
  "1",
  "HAPPY",
  "BIRTHDAY",
  "TO",
  "YOU",
  "ALAA"
];

let particles = [];
let currentMsgIndex = 0;
const delayBetweenTexts = 2000;
let musicStarted = false;
let showFinalText = false;
let finalText = "";

const audio = document.getElementById("bg-music");

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

  tempCtx.font = `bold ${dynamicFontSize}px Arial`;
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  let points = [];
  for (let y = 0; y < canvas.height; y += pointGap) {
    for (let x = 0; x < canvas.width; x += pointGap) {
      const i = (y * canvas.width + x) * 4;
      if (imgData[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function createParticlesFromTargets(targets) {
  particles = targets.map((t, i) => {
    const prev = particles[i] || {
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
  const scale = heartScale;
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

  particles = heartPoints.map((p, i) => {
    const prev = particles[i] || {
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

  showFinalText = true;
  finalText = text;
}

function animate() {
  drawMatrixBackground();

  for (let p of particles) {
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;

    ctx.fillStyle = p.color;
    if (p.text) {
      ctx.font = "bold 16px Arial";
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (showFinalText) {
    ctx.fillStyle = "deeppink";
    ctx.font = `bold ${finalTextSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(finalText, centerX, centerY);
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
      createHeartShapeWithText("My Beautiful Princess");
    }, 500);
  }
}

function spawnILoveYou() {
  for (let i = 0; i < 10; i++) {
    const tx = Math.random() * canvas.width;
    const ty = Math.random() * canvas.height;

    const particle = {
      x: tx,
      y: ty - 50,
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

canvas.addEventListener("click", () => {
  if (!musicStarted) {
    audio.play();
    musicStarted = true;
  }
  spawnILoveYou();
});

animate();
showNextMessage();
setInterval(drawMatrixBackground, 33);
