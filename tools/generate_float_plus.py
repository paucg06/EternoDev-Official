import math
from PIL import Image, ImageDraw, ImageFilter

width, height = 500, 500
cx, cy = 250, 240

w = 82
arm = 92
d = 60

a = w / 2
b = arm + w / 2

pts2d = [
    (-a, b),   # 0
    (a, b),    # 1
    (a, a),    # 2
    (b, a),    # 3
    (b, -a),   # 4
    (a, -a),   # 5
    (a, -b),   # 6
    (-a, -b),  # 7
    (-a, -a),  # 8
    (-b, -a),  # 9
    (-b, a),   # 10
    (-a, a)    # 11
]

rot_x = math.radians(-22)
rot_y = math.radians(28)
rot_z = math.radians(-14)

def rotate(v):
    x, y, z = v
    x1 = x * math.cos(rot_y) + z * math.sin(rot_y)
    y1 = y
    z1 = -x * math.sin(rot_y) + z * math.cos(rot_y)
    x2 = x1
    y2 = y1 * math.cos(rot_x) - z1 * math.sin(rot_x)
    z2 = y1 * math.sin(rot_x) + z1 * math.cos(rot_x)
    x3 = x2 * math.cos(rot_z) - y2 * math.sin(rot_z)
    y3 = x2 * math.sin(rot_z) + y2 * math.cos(rot_z)
    z3 = z2
    return [round(cx + x3, 2), round(cy - y3, 2), round(z3, 2)]

verts = []
for x, y in pts2d:
    verts.append(rotate([x, y, d/2]))
for x, y in pts2d:
    verts.append(rotate([x, y, -d/2]))

faces = []
faces.append({'name': 'front', 'indices': list(range(12)), 'type': 'front'})
for i in range(12):
    nxt = (i + 1) % 12
    faces.append({'name': f'side_{i}', 'indices': [i, nxt, nxt+12, i+12], 'type': 'side', 'idx': i})

visible = []
for f in faces:
    pts = [verts[k] for k in f['indices']]
    area = 0.0
    for j in range(len(pts)):
        k = (j + 1) % len(pts)
        area += pts[j][0] * pts[k][1] - pts[k][0] * pts[j][1]
    if area > 0:
        avg_z = sum(p[2] for p in pts) / len(pts)
        visible.append((f['name'], pts, avg_z, f['type'], f.get('idx', None)))

visible.sort(key=lambda x: x[2])

color_map = {
    'side_0': '#38BDF8',
    'side_2': '#38BDF8',
    'side_3': '#38BDF8',
    'side_10': '#38BDF8',
    'side_1': '#0369A1',
    'side_5': '#0369A1',
    'front': '#0284C7'
}

# 1. Generate SVG
svg_lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" fill="none">',
    '  <defs>',
    '    <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">',
    '      <feDropShadow dx="8" dy="22" stdDeviation="16" flood-color="rgba(2, 132, 199, 0.45)"/>',
    '    </filter>',
    '  </defs>',
    '  <g filter="url(#dropShadow)">'
]

for name, pts, avg_z, f_type, idx in visible:
    pts_str = ' '.join(f'{p[0]},{p[1]}' for p in pts)
    fill = color_map.get(name, '#0284C7')
    stroke = '#BAE6FD' if name in ['side_0', 'side_2', 'side_3', 'side_10'] else ('#7DD3FC' if name == 'front' else '#0284C7')
    stroke_w = '1.8' if name == 'front' else '1.2'
    svg_lines.append(f'    <polygon points="{pts_str}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_w}" stroke-linejoin="round"/>')

svg_lines.append('  </g>')
svg_lines.append('</svg>')

svg_content = '\n'.join(svg_lines)
with open('src/img/about/float_plus.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('Generated src/img/about/float_plus.svg')

# 2. Generate PNG with Pillow at 2x Supersampling
scale = 2
img = Image.new('RGBA', (width * scale, height * scale), (0, 0, 0, 0))

# Create shadow layer
shadow = Image.new('RGBA', (width * scale, height * scale), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
for name, pts, avg_z, f_type, idx in visible:
    s_pts = [(p[0] * scale + 16, p[1] * scale + 44) for p in pts]
    sdraw.polygon(s_pts, fill=(2, 132, 199, 110))
shadow = shadow.filter(ImageFilter.GaussianBlur(radius=32))
img.alpha_composite(shadow)

draw = ImageDraw.Draw(img)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

for name, pts, avg_z, f_type, idx in visible:
    p_pts = [(p[0] * scale, p[1] * scale) for p in pts]
    fill_hex = color_map.get(name, '#0284C7')
    stroke_hex = '#BAE6FD' if name in ['side_0', 'side_2', 'side_3', 'side_10'] else ('#7DD3FC' if name == 'front' else '#0284C7')
    
    fill_rgb = hex_to_rgb(fill_hex) + (255,)
    stroke_rgb = hex_to_rgb(stroke_hex) + (255,)
    
    draw.polygon(p_pts, fill=fill_rgb, outline=stroke_rgb, width=max(2, int(scale * 1.5)))

# Resample to crisp 500x500
out = img.resize((width, height), Image.Resampling.LANCZOS)
out.save('src/img/about/float_plus.png', 'PNG')
print('Generated src/img/about/float_plus.png')
