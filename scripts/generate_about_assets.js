const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFile } = require('child_process');

const outDir = path.join(__dirname, '..', 'assets', 'about');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      for (const [filename, b64Data] of Object.entries(data)) {
        const cleanB64 = b64Data.replace(/^data:image\/png;base64,/, '');
        const targetPath = path.join(outDir, filename);
        fs.writeFileSync(targetPath, Buffer.from(cleanB64, 'base64'));
        console.log(`Generated: ${filename} (${(cleanB64.length * 0.75 / 1024).toFixed(1)} KB)`);
      }
      res.end('ok');
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 500);
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<canvas id="c" width="400" height="400"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const results = {};

function clear() {
  ctx.clearRect(0, 0, 400, 400);
}

// 1. 3D Yellow Plus (Cruz 3D Amarilla)
function draw3DPlus() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(-0.15);

  const w = 46, arm = 65, depth = 38;

  // Sombra suave proyectada
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.filter = 'blur(12px)';
  ctx.beginPath();
  ctx.ellipse(15, 75, 95, 30, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Polígono 2D del frente de la cruz centrado en (0,0)
  const pts = [
    [-w/2, -arm - w/2], [w/2, -arm - w/2], [w/2, -w/2], [arm + w/2, -w/2],
    [arm + w/2, w/2], [w/2, w/2], [w/2, arm + w/2], [-w/2, arm + w/2],
    [-w/2, w/2], [-arm - w/2, w/2], [-arm - w/2, -w/2], [-w/2, -w/2]
  ];

  // Extrusión 3D (Caras laterales y superiores hacia la derecha y abajo)
  const dx = depth * 0.75, dy = depth * 0.55;

  for (let i = 0; i < pts.length; i++) {
    const next = (i + 1) % pts.length;
    const p1 = pts[i];
    const p2 = pts[next];

    // Vector normal para calcular iluminación según orientación
    const vx = p2[0] - p1[0];
    const vy = p2[1] - p1[1];
    const nx = -vy;
    const ny = vx;

    // Solo dibujamos caras visibles mirando hacia abajo/derecha
    if (nx * dx + ny * dy > 0) {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p2[0] + dx, p2[1] + dy);
      ctx.lineTo(p1[0] + dx, p1[1] + dy);
      ctx.closePath();

      // Color de sombra / profundidad según ángulo
      const angle = Math.atan2(vy, vx);
      const isTop = Math.sin(angle) < 0;
      if (isTop) {
        ctx.fillStyle = '#EAB308'; // Luz lateral
      } else {
        ctx.fillStyle = '#CA8A04'; // Sombra inferior profunda
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Cara Frontal Principal
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(-100, -100, 100, 100);
  grad.addColorStop(0, '#FEF08A'); // Amarillo brillante
  grad.addColorStop(0.5, '#FACC15'); // Amarillo oro
  grad.addColorStop(1, '#EAB308'); // Sombra sutil
  ctx.fillStyle = grad;
  ctx.fill();

  // Borde interior sutil
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 2. 3D Block / Prism (Barra rectangular 3D)
function draw3DBlock() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(-0.35);

  const L = 160, W = 65, H = 50;

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.filter = 'blur(14px)';
  ctx.beginPath();
  ctx.ellipse(10, 60, 110, 30, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Isometric Block (Cara superior, lateral izquierda y lateral derecha)
  // Cara Superior
  ctx.beginPath();
  ctx.moveTo(0, -H/2);
  ctx.lineTo(L/2, -H/2 - 25);
  ctx.lineTo(L/2 - W*0.7, -H/2 - 25 - W*0.4);
  ctx.lineTo(-W*0.7, -H/2 - W*0.4);
  ctx.closePath();
  const gradTop = ctx.createLinearGradient(-W, -H, L/2, 0);
  gradTop.addColorStop(0, '#BEF264'); // Lima brillante
  gradTop.addColorStop(1, '#A3E635');
  ctx.fillStyle = gradTop;
  ctx.fill();

  // Cara Frontal / Lateral Larga
  ctx.beginPath();
  ctx.moveTo(0, -H/2);
  ctx.lineTo(0, H/2);
  ctx.lineTo(L/2, H/2 - 25);
  ctx.lineTo(L/2, -H/2 - 25);
  ctx.closePath();
  const gradFront = ctx.createLinearGradient(0, -H/2, L/2, H/2);
  gradFront.addColorStop(0, '#84CC16');
  gradFront.addColorStop(1, '#65A30D');
  ctx.fillStyle = gradFront;
  ctx.fill();

  // Cara Lateral Izquierda Corta
  ctx.beginPath();
  ctx.moveTo(0, -H/2);
  ctx.lineTo(-W*0.7, -H/2 - W*0.4);
  ctx.lineTo(-W*0.7, H/2 - W*0.4);
  ctx.lineTo(0, H/2);
  ctx.closePath();
  const gradSide = ctx.createLinearGradient(-W, -H/2, 0, H/2);
  gradSide.addColorStop(0, '#4D7C0F');
  gradSide.addColorStop(1, '#3F6212');
  ctx.fillStyle = gradSide;
  ctx.fill();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 3. 3D Heart (Corazón 3D Gaming)
function draw3DHeart() {
  clear();
  ctx.save();
  ctx.translate(200, 195);
  ctx.rotate(0.18);

  const scale = 1.35;
  ctx.scale(scale, scale);

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.filter = 'blur(12px)';
  ctx.beginPath();
  ctx.ellipse(15, 65, 65, 22, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  function heartPath(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.bezierCurveTo(x, y, x - 55, y - 45, x - 55, y - 10);
    ctx.bezierCurveTo(x - 55, y + 25, x, y + 65, x, y + 75);
    ctx.bezierCurveTo(x, y + 65, x + 55, y + 25, x + 55, y - 10);
    ctx.bezierCurveTo(x + 55, y - 45, x, y, x, y + 25);
    ctx.closePath();
  }

  // Extrusión Lateral 3D
  const depth = 28;
  for (let d = depth; d >= 1; d -= 2) {
    ctx.save();
    ctx.translate(d * 0.7, d * 0.7);
    heartPath(0, -35);
    ctx.fillStyle = '#DB2777'; // Rosa oscuro 3D
    ctx.fill();
    ctx.restore();
  }

  // Cara Frontal
  heartPath(0, -35);
  const grad = ctx.createLinearGradient(-50, -80, 50, 40);
  grad.addColorStop(0, '#F472B6'); // Rosa suave pastel
  grad.addColorStop(0.5, '#EC4899');
  grad.addColorStop(1, '#E11D48');
  ctx.fillStyle = grad;
  ctx.fill();

  // Brillo especular superior
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(-22, -45, 14, 8, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();
  ctx.restore();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 4. 3D Zigzag / Staircase (Escalera 3D)
function draw3DZigzag() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(0.25);

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.filter = 'blur(14px)';
  ctx.beginPath();
  ctx.ellipse(0, 80, 95, 28, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const steps = 4;
  const stepW = 38, stepH = 34, depth = 38;
  const startX = -75, startY = 55;

  // Dibujar escalones 3D de atrás hacia adelante
  for (let i = 0; i < steps; i++) {
    const x = startX + i * stepW;
    const y = startY - i * stepH;

    // Cara Superior (Luz)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + stepW, y);
    ctx.lineTo(x + stepW + depth * 0.7, y - depth * 0.5);
    ctx.lineTo(x + depth * 0.7, y - depth * 0.5);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#4ADE80' : '#86EFAC';
    ctx.fill();

    // Cara Frontal (Vertical)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + stepW, y);
    ctx.lineTo(x + stepW, y + stepH);
    ctx.lineTo(x, y + stepH);
    ctx.closePath();
    ctx.fillStyle = '#22C55E';
    ctx.fill();

    // Cara Lateral Derecha (Sombra)
    ctx.beginPath();
    ctx.moveTo(x + stepW, y);
    ctx.lineTo(x + stepW + depth * 0.7, y - depth * 0.5);
    ctx.lineTo(x + stepW + depth * 0.7, y + stepH - depth * 0.5);
    ctx.lineTo(x + stepW, y + stepH);
    ctx.closePath();
    ctx.fillStyle = '#15803D';
    ctx.fill();
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 5. 3D Pillar / Column (Columna 3D)
function draw3DPillar() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(-0.25);

  const w = 55, d = 45, h = 175;

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.filter = 'blur(12px)';
  ctx.beginPath();
  ctx.ellipse(20, 95, 45, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cara Superior
  ctx.beginPath();
  ctx.moveTo(0, -h/2);
  ctx.lineTo(w, -h/2 - 20);
  ctx.lineTo(w - d * 0.7, -h/2 - 20 - d * 0.5);
  ctx.lineTo(-d * 0.7, -h/2 - d * 0.5);
  ctx.closePath();
  ctx.fillStyle = '#F472B6'; // Rosa brillante
  ctx.fill();

  // Cara Frontal
  ctx.beginPath();
  ctx.moveTo(0, -h/2);
  ctx.lineTo(0, h/2);
  ctx.lineTo(w, h/2 - 20);
  ctx.lineTo(w, -h/2 - 20);
  ctx.closePath();
  const gradF = ctx.createLinearGradient(0, -h/2, 0, h/2);
  gradF.addColorStop(0, '#E11D48');
  gradF.addColorStop(1, '#9F1239');
  ctx.fillStyle = gradF;
  ctx.fill();

  // Cara Lateral
  ctx.beginPath();
  ctx.moveTo(0, -h/2);
  ctx.lineTo(-d * 0.7, -h/2 - d * 0.5);
  ctx.lineTo(-d * 0.7, h/2 - d * 0.5);
  ctx.lineTo(0, h/2);
  ctx.closePath();
  ctx.fillStyle = '#881337';
  ctx.fill();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 6. 3D Banana (Plátano 3D EternoDev)
function draw3DBanana() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(0.12);

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.filter = 'blur(15px)';
  ctx.beginPath();
  ctx.ellipse(10, 65, 80, 24, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const BANANA_PATHS = [
    'M2 26.431c0-.73.592-1.321 1.322-1.321h.99a1.322 1.322 0 0 1 0 2.643h-.99c-.73 0-1.322-.592-1.322-1.322',
    'M19.783 18h9.435c.695 0 1.045-.876.55-1.392l-2.178-2.272a4.244 4.244 0 0 0-6.181 0l-2.179 2.272c-.492.514-.142 1.392.553 1.392M4.783 18h9.434c.695 0 1.045-.878.553-1.392l-2.18-2.272a4.243 4.243 0 0 0-6.182 0L4.23 16.608c-.492.514-.142 1.392.553 1.392',
    'M16.7 2.029c4.92-.708 7.96 11.897 5.745 16.99-2.215 5.094-6.997 6.21-12.07 8.204-.561.22-1.138.325-1.705.325-1.924 0-2.97 1.582-3.7-.375-.942-2.535.293-5.376 2.76-6.344 2.684-1.053 4.111-3.077 5.185-5.818 1.096-2.795 1.17-3.941 1.166-6.988-.005-2.437-.165-5.594 2.619-5.994',
    'm22.445 19.02-9.46-4.344c-1.086 2.498-3.053 4.411-5.54 5.39-2.881 1.132-4.807 4.23-3.23 7.386 3.151 6.304 18.23-.066 18.23-8.433',
    'M18.24 16.482a.75.75 0 0 1 .486.942c-1.98 6.201-7.756 9.065-12.918 9.33a.75.75 0 0 1-.077-1.498c4.738-.243 9.83-2.852 11.566-8.288a.75.75 0 0 1 .943-.486',
    'm23.24 26.467-10.197-11.78h9.004c2.126.107 3.794 1.91 3.794 4.097v7.552c0 1.33-1.197 1.736-2.6.131'
  ];

  const scale = 5.2;
  const depth = 22;

  // Extrusión 3D
  for (let d = depth; d >= 1; d -= 2) {
    ctx.save();
    ctx.translate(-16 * scale + d * 0.7, -16 * scale + d * 0.7);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#CA8A04'; // Dorado profundo
    for (const p of BANANA_PATHS) { ctx.fill(new Path2D(p)); }
    ctx.restore();
  }

  // Cara Frontal Principal
  ctx.save();
  ctx.translate(-16 * scale, -16 * scale);
  ctx.scale(scale, scale);
  
  const grad = ctx.createLinearGradient(0, 0, 32, 32);
  grad.addColorStop(0, '#FEF08A');
  grad.addColorStop(0.4, '#FDD31D'); // EternoDev Amarillo
  grad.addColorStop(1, '#EAB308');
  ctx.fillStyle = grad;

  for (const p of BANANA_PATHS) { ctx.fill(new Path2D(p)); }

  ctx.restore();
  ctx.restore();
  return canvas.toDataURL('image/png');
}

// 7. 3D Star / Coin (Estrella 3D)
function draw3DStar() {
  clear();
  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(-0.1);

  // Sombra
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.filter = 'blur(12px)';
  ctx.beginPath();
  ctx.ellipse(10, 65, 65, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  function starPath(rOuter, rInner, points = 5) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? rOuter : rInner;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  const depth = 22;
  // Extrusión 3D
  for (let d = depth; d >= 1; d -= 2) {
    ctx.save();
    ctx.translate(d * 0.7, d * 0.7);
    starPath(75, 36);
    ctx.fillStyle = '#D97706';
    ctx.fill();
    ctx.restore();
  }

  // Cara frontal
  starPath(75, 36);
  const grad = ctx.createLinearGradient(-50, -50, 50, 50);
  grad.addColorStop(0, '#FFFBEB');
  grad.addColorStop(0.3, '#FDE047');
  grad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

// Generar todos los PNGs
results['float_plus.png'] = draw3DPlus();
results['float_block.png'] = draw3DBlock();
results['float_heart.png'] = draw3DHeart();
results['float_zigzag.png'] = draw3DZigzag();
results['float_pillar.png'] = draw3DPillar();
results['float_banana.png'] = draw3DBanana();
results['float_star.png'] = draw3DStar();

fetch('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(results)
});
</script>
</body>
</html>`);
  }
});

server.listen(9881, '127.0.0.1', () => {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  execFile(chromePath, ['--headless=new', '--disable-gpu', '--no-sandbox', 'http://127.0.0.1:9881']);
});
