import math
from PIL import Image, ImageDraw

def generate_assets():
    cx, cy = 250, 250
    w = 86   # arm thickness
    l = 120  # arm length from center to cap
    
    half_w = w / 2
    pts_local = [
        (-half_w, l),       # 0: Top arm top-left
        (half_w, l),        # 1: Top arm top-right
        (half_w, half_w),   # 2: Inner corner top-right
        (l, half_w),        # 3: Right arm top-right
        (l, -half_w),       # 4: Right arm bottom-right
        (half_w, -half_w),  # 5: Inner corner bottom-right
        (half_w, -l),       # 6: Bottom arm bottom-right
        (-half_w, -l),      # 7: Bottom arm bottom-left
        (-half_w, -half_w), # 8: Inner corner bottom-left
        (-l, -half_w),      # 9: Left arm bottom-left
        (-l, half_w),       # 10: Left arm top-left
        (-half_w, half_w)   # 11: Inner corner top-left
    ]
    
    tilt_deg = -13
    rad = math.radians(tilt_deg)
    cos_t = math.cos(rad)
    sin_t = math.sin(rad)
    
    front_pts = []
    for x, y in pts_local:
        rx = x * cos_t - y * sin_t
        ry = -(x * sin_t + y * cos_t)
        front_pts.append((round(cx + rx, 2), round(cy + ry, 2)))
        
    depth = 30
    depth_angle_deg = 50
    ext_rad = math.radians(depth_angle_deg)
    dx = round(depth * math.cos(ext_rad), 2)
    dy = round(depth * math.sin(ext_rad), 2)
    
    back_pts = [(round(x + dx, 2), round(y + dy, 2)) for x, y in front_pts]
    
    # 12 edges
    # Facing right: Edge 1, Edge 3, Edge 5
    # Facing bottom: Edge 4, Edge 6, Edge 8
    # Visible sides:
    side_defs = [
        # (index, p1_idx, p2_idx, fill_color)
        (1, 1, 2, '#0369A1'), # Top arm right side
        (3, 3, 4, '#0369A1'), # Right arm cap
        (4, 4, 5, '#075985'), # Right arm bottom side
        (5, 5, 6, '#0369A1'), # Bottom arm right side
        (6, 6, 7, '#075985'), # Bottom arm cap
        (8, 8, 9, '#075985'), # Left arm bottom side
    ]
    
    # Generate SVG
    svg_lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" fill="none">',
        '  <!-- 3D D-Pad / Console Cross con volumen solido y colores azules planos mate -->',
        '  <g id="cross3D">'
    ]
    
    # Add side polygons
    for s_idx, p1_idx, p2_idx, col in side_defs:
        p1 = front_pts[p1_idx]
        p2 = front_pts[p2_idx]
        b2 = back_pts[p2_idx]
        b1 = back_pts[p1_idx]
        pts_str = f"{p1[0]},{p1[1]} {p2[0]},{p2[1]} {b2[0]},{b2[1]} {b1[0]},{b1[1]}"
        svg_lines.append(f'    <polygon points="{pts_str}" fill="{col}" stroke="{col}" stroke-width="1" stroke-linejoin="round"/>')
        
    # Add front face polygon
    front_str = " ".join(f"{p[0]},{p[1]}" for p in front_pts)
    front_col = "#0284C7"
    svg_lines.append(f'    <polygon points="{front_str}" fill="{front_col}" stroke="{front_col}" stroke-width="1" stroke-linejoin="round"/>')
    svg_lines.append('  </g>')
    svg_lines.append('</svg>\n')
    
    svg_content = "\n".join(svg_lines)
    with open('src/img/about/float_plus.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print('Generated src/img/about/float_plus.svg')
    
    # Generate PNG
    im = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    for s_idx, p1_idx, p2_idx, col in side_defs:
        p1 = front_pts[p1_idx]
        p2 = front_pts[p2_idx]
        b2 = back_pts[p2_idx]
        b1 = back_pts[p1_idx]
        draw.polygon([p1, p2, b2, b1], fill=col)
    draw.polygon(front_pts, fill=front_col)
    im.save('src/img/about/float_plus.png')
    print('Generated src/img/about/float_plus.png')

generate_assets()
