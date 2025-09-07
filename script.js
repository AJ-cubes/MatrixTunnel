document.addEventListener("DOMContentLoaded", () => {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden";
});

const canvas = document.getElementById('matrixTunnel');
const ctx = canvas.getContext('2d');

let chars = '01';
let fontBase, particleCount;

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const diagLine = Math.sqrt(width ** 2 + height ** 2);
    fontBase = Math.round(diagLine / 35);
    particleCount = Math.round(diagLine / 2);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const greenShades = [
    "#00FF46",
    "#39FF14",
    "#00FF99",
    "#00FFB2",
    "#00E676",
    "#1AFF66",
    "#00C853"
];

const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;
const maxRadius = () => Math.sqrt(centerX() ** 2 + centerY() ** 2);

const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push({
        radius: Math.random() * maxRadius() + 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.3,
        rotationSpeed: Math.random() * 0.01 - 0.005,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: greenShades[Math.floor(Math.random() * greenShades.length)]
    });
}

let batteryInfo = { level: 1, charging: true, supported: false };

if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        batteryInfo.supported = true;
        batteryInfo.level = battery.level;
        batteryInfo.charging = battery.charging;

        battery.addEventListener('levelchange', () => {
            batteryInfo.level = battery.level;
        });
        battery.addEventListener('chargingchange', () => {
            batteryInfo.charging = battery.charging;
        });
    });
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function drawTimeBox() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB');
    const batteryStr = `${batteryInfo.charging ? '🔋' : ''}${Math.round(batteryInfo.level * 100)}%`;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const padding = 12;
    const timeFontSize = fontBase;
    const batteryFontSize = Math.round(fontBase * 0.75);
    const spacing = 6;

    ctx.font = `bold ${timeFontSize}px monospace`;
    const timeWidth = ctx.measureText(timeStr).width;

    let boxWidth = timeWidth + padding * 2;
    let boxHeight = timeFontSize + padding * 2;

    if (batteryInfo.supported) {
        ctx.font = `bold ${batteryFontSize}px monospace`;
        const batteryWidth = ctx.measureText(batteryStr).width;
        boxWidth = Math.max(boxWidth, batteryWidth + padding * 2);
        boxHeight += batteryFontSize + spacing;
    }

    const x = (canvas.width - boxWidth) / 2;
    const y = (canvas.height - boxHeight) / 2;
    const centerX = x + boxWidth / 2;

    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.globalAlpha = 1;

    ctx.beginPath();
    const r = 16;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + boxWidth - r, y);
    ctx.arcTo(x + boxWidth, y, x + boxWidth, y + r, r);
    ctx.lineTo(x + boxWidth, y + boxHeight - r);
    ctx.arcTo(x + boxWidth, y + boxHeight, x + boxWidth - r, y + boxHeight, r);
    ctx.lineTo(x + r, y + boxHeight);
    ctx.arcTo(x, y + boxHeight, x, y + boxHeight - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();

    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = performance.now() / -25;
    ctx.strokeStyle = "#00FF46";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#00FF46";
    ctx.font = `bold ${timeFontSize}px monospace`;
    ctx.fillText(timeStr, centerX, y + padding);

    if (batteryInfo.supported) {
        ctx.font = `bold ${batteryFontSize}px monospace`;
        ctx.fillText(batteryStr, centerX, y + padding + timeFontSize + spacing);
    }

    ctx.restore();
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTimeBox();

    particles.forEach(p => {
        p.radius -= p.speed;
        p.angle += p.rotationSpeed;

        if (p.radius < 10) {
            p.radius = maxRadius() + 50;
            p.angle = Math.random() * Math.PI * 2;
            p.char = chars[Math.floor(Math.random() * chars.length)];
            p.color = greenShades[Math.floor(Math.random() * greenShades.length)];
        }

        const x = centerX() + p.radius * Math.cos(p.angle);
        const y = centerY() + p.radius * Math.sin(p.angle);
        const alpha = Math.max(0.2, p.radius / maxRadius());
        const size = Math.max(14, fontBase * alpha);

        ctx.font = `${size}px monospace`;
        ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${alpha})`;
        ctx.fillText(p.char, x, y);
    });

    requestAnimationFrame(draw);
}

draw();
