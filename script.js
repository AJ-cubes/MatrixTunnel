document.addEventListener("DOMContentLoaded", () => {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden";
});

const canvas = document.getElementById('matrixTunnel');
const ctx = canvas.getContext('2d');

let fontBase, particleCount;

function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    const diagLine = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
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

console.log(centerX(), centerY(), maxRadius(), Math.sqrt(centerX()**2 + centerY()**2));

const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push({
        radius: Math.random() * maxRadius() + 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.3,
        rotationSpeed: Math.random() * 0.01 - 0.005,
        char: Math.random() < 0.5 ? '0' : '1',
        color: greenShades[Math.floor(Math.random() * greenShades.length)]
    });
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.radius -= p.speed;
        p.angle += p.rotationSpeed;

        if (p.radius < 10) {
            p.radius = maxRadius() + 50;
            p.angle = Math.random() * Math.PI * 2;
            p.char = Math.random() < 0.5 ? '0' : '1';
            p.color = greenShades[Math.floor(Math.random() * greenShades.length)];
        }

        const x = centerX() + p.radius * Math.cos(p.angle);
        const y = centerY() + p.radius * Math.sin(p.angle);
        const alpha = Math.max(0.2, p.radius / maxRadius());
        console.log(fontBase);
        const size = Math.max(14, fontBase * alpha);

        ctx.font = `${size}px monospace`;
        ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${alpha})`;
        ctx.fillText(p.char, x, y);
    });

    requestAnimationFrame(draw);
}

draw();
