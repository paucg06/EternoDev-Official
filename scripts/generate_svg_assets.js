const fs = require('fs');

// 1. curve_we.svg (Solid dark amber background)
const curveWe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1507.28 233.55" width="100%" height="auto" preserveAspectRatio="none">
  <path d="M1507.28,0q-210.12,139.76-422.77,139.76c-212.66,0-295.76-96.5-579.82-81.29Q221.1,73.65,0,197.46v36.09H1507.28Z" fill="#14130c"/>
</svg>`;
fs.writeFileSync('assets/about/curve_we.svg', curveWe);

// 2. curve_reasons.svg (Solid dark warm background)
const curveReasons = `<svg viewBox="0 0 1366 1865" width="100%" height="auto" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <path d="m0 0c116.11946 290.396453 281.272956 427.561316 495.460489 411.49459 321.2813-24.100089 435.353371-112.669322 650.033631-112.669322 143.12017 0 268.2888 68.131638 375.50588 204.394915v1519.779817h-1521z" fill="#15130a"/>
</svg>`;
fs.writeFileSync('assets/about/curve_reasons.svg', curveReasons);

// 3. card_bg_1.svg (Solid Yellow #FDD31D with clean shadow, no gradients)
const cardBg1 = `<svg width="931px" height="453px" viewBox="0 0 931 453" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="25" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M8.42958813,39.1367359 L922.619492,0.3975035 C927.033808,0.2104448 930.76396,3.6373142 930.951018,8.0516306 C930.969025,8.4765678 930.953116,8.9022642 930.903442,9.324672 L879.596949,445.613671 C879.107322,449.777251 875.486546,452.856681 871.298366,452.671523 L42.9993963,416.052657 C39.015437,415.876527 35.7695781,412.793198 35.389204,408.823529 L0.80476298,47.8926287 C0.38333332,43.4944953 3.60708867,39.5874674 8.00522208,39.1660378 C8.14639271,39.1525108 8.28789807,39.14274 8.42958813,39.1367359 L8.42958813,39.1367359 Z" fill="#FDD31D" filter="url(#cardShadow)"/>
</svg>`;
fs.writeFileSync('assets/about/card_bg_1.svg', cardBg1);

// 4. card_bg_2.svg (Solid Dark Gold #B45309, no gradients)
const cardBg2 = `<svg width="931px" height="453px" viewBox="0 0 931 453" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.70366783,39.0670906 L921.893572,0.327858207 C926.307888,0.140799447 930.03804,3.56766887 930.225098,7.9819853 C930.243105,8.40692245 930.227196,8.83261893 930.177522,9.25502669 L878.871029,445.544026 C878.381402,449.707606 874.760626,452.787036 870.572446,452.601878 L42.273476,415.983012 C38.2895167,415.806882 35.0436578,412.723553 34.6632837,408.753884 L0.0788426758,47.8229834 C-0.342586984,43.42485 2.88116837,39.5178221 7.27930178,39.0963925 C7.42047241,39.0828655 7.56197777,39.0730947 7.70366783,39.0670906 Z" fill="#92400E" opacity="0.6" transform="translate(465.137040, 226.465177) rotate(-180.000000) translate(-465.137040, -226.465177)"/>
</svg>`;
fs.writeFileSync('assets/about/card_bg_2.svg', cardBg2);

// 5. Arrow SVGs
const prevArrow = `<svg viewBox="0 0 103 116" xmlns="http://www.w3.org/2000/svg">
  <path d="M68 28 L38 58 L68 88" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"/>
</svg>`;
const nextArrow = `<svg viewBox="0 0 103 116" xmlns="http://www.w3.org/2000/svg">
  <path d="M35 28 L65 58 L35 88" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"/>
</svg>`;
fs.writeFileSync('assets/about/arrow_prev.svg', prevArrow);
fs.writeFileSync('assets/about/arrow_next.svg', nextArrow);

console.log('SVGs generated with pure solid flat colors, ZERO gradients!');
