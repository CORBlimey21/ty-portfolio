const html = document.documentElement;
const portfolio = document.querySelector('#portfolio');
const opening = document.querySelector('#opening');
const skip = document.querySelector('#skip-intro');
const wordmark = opening.querySelector('.intro-wordmark');
const underline = opening.querySelectorAll('.intro-line-left, .intro-line-right');
const title = opening.querySelector('.intro-title');
const links = [...document.querySelectorAll('.object-link')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const transition = document.querySelector('#chapter-transition');

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const animate = (element, frames, duration, options = {}) =>
  element.animate(frames, { duration, fill: 'forwards', ...options });

let introActive = false;
let introAnimations = [];
let selection = null;

function introAnimate(...args) {
  const animation = animate(...args);
  introAnimations.push(animation);
  return animation.finished;
}

function endIntro({ focus = false } = {}) {
  introActive = false;
  delete html.dataset.intro;
  portfolio.inert = false;
  for (const animation of introAnimations) animation.cancel();
  introAnimations = [];
  opening.querySelectorAll('.flying-object').forEach(sprite => sprite.remove());
  try { sessionStorage.setItem('ty-paper-intro-seen', '1'); } catch {}
  if (focus) document.querySelector('#content').focus({ preventScroll: true });
}

async function runIntro() {
  introActive = true;
  html.dataset.intro = 'title';
  portfolio.inert = true;
  // Decode while the title is on screen, so the first burst frame can draw every object.
  links.forEach(link => link.querySelector('img').decode().catch(() => {}));
  try {
    await sleep(320);
    if (!introActive) return;
    await Promise.all([
      ...[...underline].map((stroke, index) =>
        introAnimate(stroke, drawStroke, 535 + index * 110, { delay: index * 85, easing: 'cubic-bezier(.3,.53,.62,1)' })),
      introAnimate(title, [
        { opacity: 1, clipPath: 'inset(-10% 100% -10% 0)' },
        { opacity: 1, clipPath: 'inset(-10% 0 -10% 0)' },
      ], 620, { delay: 170, easing: 'cubic-bezier(.38,.1,.38,1)' }),
    ]);
    await sleep(1375);
    if (!introActive) return;
    await introAnimate(wordmark, [
      { transform: 'scale(1)' },
      { transform: 'scale(1.015,.97)', offset: .18 },
      { transform: 'scale(.12,.16)', offset: .85 },
      { transform: 'scale(.003,.025)' },
    ], 155, { easing: 'cubic-bezier(.7,.01,.74,.7)' });
    await sleep(35);
    if (!introActive) return;
    await burst();
    if (introActive) endIntro({ focus: document.activeElement === skip });
  } catch {
    if (introActive) endIntro({ focus: document.activeElement === skip });
  }
}

const flights = [
  { spin: -38, duration: 835, delay: 0, arc: -49, phone: [-.18, -.2] },
  { spin: 26, duration: 970, delay: 27, arc: -84, phone: [.21, -.14] },
  { spin: 42, duration: 885, delay: 18, arc: -68, phone: [-.24, -.025] },
  { spin: -52, duration: 1000, delay: 35, arc: 48, phone: [.23, .035] },
  { spin: 51, duration: 1050, delay: 65, arc: 63, phone: [-.18, .155] },
  { spin: 60, duration: 935, delay: 42, arc: 21, phone: [.16, .22] },
];

const drawStroke = [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }];

// Sketch over each illustration's main shapes in a 100 × 100 mask.
// The last pass fills in cross-hatching and fine detail between these strokes.
const sketchStrokes = {
  breadboard: [
    [22, 'M5 39 L63 3 L97 47 L36 94 Z M5 48 L35 94 L96 57'],
    [14, 'M25 65 Q22 22 38 31 Q45 30 48 51 M43 57 Q40 12 61 26 L65 43 M54 38 Q59 4 74 14 Q79 17 78 32'],
    [35, 'M26 49 L66 23 L82 49 L48 73 L35 66'],
  ],
  erg: [
    [20, 'M4 91 L9 74 L63 63 L77 45 L84 34'],
    [25, 'M96 40 C99 12 76 14 77 38 S99 66 96 40 M83 51 L92 79 L99 82'],
    [17, 'M34 61 L64 56 L74 47 L76 34 L68 11'],
  ],
  cork: [
    [17, 'M2 99 L3 7 L22 1 L40 9 L60 1 L74 9 L97 2 L100 93 L75 99 L60 93 L40 99 L21 91 Z'],
    [28, 'M0 67 L17 50 L36 65 L52 53 L71 36 L98 29 M31 46 L44 82 L63 75 L85 53'],
    [30, 'M22 21 L54 30 L76 18 M73 79 L94 68 M12 80 L32 80'],
  ],
  keys: [
    [27, 'M4 13 L94 13 M3 86 L98 86'],
    [18, 'M12 21 L9 85 M27 21 L24 86 M43 21 L43 85 M57 21 L59 85 M73 21 L77 85 M88 21 L94 85'],
  ],
  shield: [
    [20, 'M12 5 C-22 14 12 65 44 86 S103 107 97 75 S55 -4 12 5'],
    [33, 'M12 18 L46 22 L78 58 L81 83 L51 65 L24 35'],
  ],
  europe: [
    [18, 'M3 7 L24 2 L40 9 L60 2 L75 10 L96 2 L99 93 L74 98 L59 92 L39 98 L19 91 L1 98 Z'],
    [27, 'M24 9 L22 37 L27 88 M40 15 L39 92 M58 12 L58 90 M75 15 L77 90 M94 19 L96 86'],
    [17, 'M56 28 C47 10 61 10 59 26 L55 40'],
  ],
};

function flyingSketch(image, object) {
  const strokes = sketchStrokes[object];
  if (!strokes) return { sprite: image.cloneNode(), drawing: [] };
  const id = `draw-${object}`;
  const sprite = svgElement('svg', {
    viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true',
  });
  const mask = svgElement('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 100, height: 100 });
  const ink = strokes.map(([width, d]) => svgElement('path', {
    d, pathLength: 1, stroke: 'white', fill: 'none', 'stroke-width': width,
    'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': 1, 'stroke-dashoffset': 1,
  }));
  const detail = svgElement('rect', { width: 100, height: 100, fill: 'white', opacity: 0 });
  mask.append(...ink, detail);
  const defs = svgElement('defs', {});
  defs.append(mask);
  sprite.append(defs, svgElement('image', {
    href: image.currentSrc || image.src, width: 100, height: 100,
    preserveAspectRatio: 'xMidYMid meet', mask: `url(#${id})`,
  }));
  return { sprite, drawing: [...ink, detail] };
}

function burst() {
  html.dataset.intro = 'burst';
  const viewport = opening.getBoundingClientRect();
  const originX = viewport.left + viewport.width / 2;
  const originY = viewport.top + viewport.height / 2;
  const reveal = [
    introAnimate(wordmark, [{ opacity: 1 }, { opacity: 0 }], 65),
    introAnimate(opening.querySelector('.intro-paper'), [{ opacity: 1 }, { opacity: 0 }], 430, { delay: 275 }),
  ];
  const compact = viewport.width <= 620;
  const sprites = links.map((link, index) => {
    const image = link.querySelector('img');
    const art = link.querySelector('.object-art').getBoundingClientRect();
    const { spin, duration, delay, arc, phone } = flights[index % flights.length];
    const rest = parseFloat(getComputedStyle(link).getPropertyValue('--rest'));
    const width = image.offsetWidth;
    const height = image.offsetHeight;
    const endX = art.left + art.width / 2 - originX;
    const endY = art.top + art.height / 2 - originY;
    const { sprite, drawing } = flyingSketch(image, link.dataset.object);
    sprite.classList.add('flying-object');
    Object.assign(sprite.style, {
      width: `${width}px`,
      height: `${height}px`,
      left: `${originX - width / 2}px`,
      top: `${originY - height / 2}px`,
    });
    opening.append(sprite);
    const detail = drawing.at(-1);
    if (detail) {
      const strokes = drawing.slice(0, -1).map((stroke, index) => introAnimate(stroke, drawStroke, 245, {
        delay: delay + 32 + 68 * index, fill: 'both', easing: 'ease-out',
      }));
      reveal.push(...strokes, introAnimate(detail, [{ opacity: 0 }, { opacity: 1 }], 175, {
        delay: delay + 290, fill: 'both',
      }));
    }

    // On a phone, spread the whole burst within view before the lower objects fly to their rows.
    const burstX = compact ? viewport.width * phone[0] : endX * .34;
    const burstY = compact ? viewport.height * phone[1] : endY * .22 + arc;
    const pose = (x, y, degrees, scale) => `translate3d(${x}px, ${y}px, 0) rotate(${degrees}deg) scale(${scale})`;
    return introAnimate(sprite, [
      { opacity: 0, transform: pose(0, 0, spin, .015), easing: 'cubic-bezier(.14,.72,.35,1)' },
      { opacity: 1, transform: pose(burstX, burstY, spin * .65, compact ? .49 : .57),
        offset: compact ? .26 : .20, easing: compact ? 'cubic-bezier(.55,.03,.31,1)' : 'cubic-bezier(.12,.72,.35,1)' },
      { opacity: 1, transform: pose(endX * 1.065, endY * 1.05, rest - spin * .15, 1.045),
        offset: .66, easing: 'cubic-bezier(.35,0,.25,1)' },
      { opacity: 1, transform: pose(endX * .987, endY * .993, rest + spin * .04, .985),
        offset: .86, easing: 'ease-out' },
      { opacity: 1, transform: pose(endX, endY, rest, 1) },
    ], duration, { delay, fill: 'both' });
  });
  return Promise.all([...reveal, ...sprites]);
}

function svgElement(name, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [attribute, value] of Object.entries(attributes)) element.setAttribute(attribute, value);
  return element;
}

function detail(art, name) {
  const node = document.createElement('div');
  node.className = `transition-detail ${name}`;
  art.append(node);
  return node;
}

const fade = (element, from, to, duration, delay = 0) =>
  animate(element, [{ opacity: from }, { opacity: to }], duration, { delay, fill: 'both' });

function circuitMotion(art, sprite) {
  const circuit = document.querySelector('#circuit-transition').content.firstElementChild.cloneNode(true);
  art.append(circuit);
  const wires = [
    {
      color: '#9a54b6',
      from: 'M143 191 C140 134 153 99 176 98 C188 97 200 113 202 137 C202 137 202 137 202 137',
      to: 'M102 145 C102 123 102 99 102 84 C134 84 165 84 198 84 C198 84 198 84 198 84',
    },
    {
      color: '#d97a26',
      from: 'M203 163 C200 128 206 79 238 73 C256 69 267 88 268 115 C268 115 268 115 268 115',
      to: 'M278 84 C309 84 345 84 376 84 C376 99 376 119 376 135 C376 135 376 135 376 135',
    },
    {
      color: '#267b88',
      from: 'M248 98 C250 61 273 39 295 39 C312 37 325 54 326 80 C326 80 326 80 326 80',
      to: 'M376 180 C376 201 376 218 376 232 C292 232 185 232 102 232 C102 213 102 186 102 165',
    },
  ];
  circuit.querySelectorAll('[data-wire]').forEach((wire, index) => {
    const { color, from, to } = wires[index];
    animate(wire, [
      { d: `path("${from}")`, stroke: color, opacity: 0, strokeWidth: '6px' },
      { d: `path("${from}")`, stroke: color, opacity: 1, strokeWidth: '5px', offset: .17 },
      { d: `path("${to}")`, stroke: '#2635a2', opacity: 1, strokeWidth: '3px' },
    ], 570, { delay: 175 + index * 22, fill: 'both', easing: 'cubic-bezier(.2,.65,.27,1)' });
  });
  circuit.querySelectorAll('.circuit-symbols path').forEach((stroke, index) => {
    stroke.setAttribute('pathLength', '1');
    stroke.setAttribute('stroke-dasharray', '1');
    animate(stroke, drawStroke, 280, { delay: 480 + index * 36, fill: 'both' });
  });
  circuit.querySelectorAll('.circuit-symbols circle, .circuit-annotations text')
    .forEach(symbol => fade(symbol, 0, 1, 160, 690));
  fade(sprite, 1, 0, 400, 230);
  return 965;
}

const chapterMotions = {
  breadboard: circuitMotion,
  erg(art, sprite) {
    const wheel = detail(art, 'flywheel');
    animate(wheel, [
      { opacity: 0, transform: 'translate(-50%,-50%) rotate(0) scale(.65)' },
      { opacity: .8, transform: 'translate(-50%,-50%) rotate(180deg) scale(1)', offset: .4 },
      { opacity: .22, transform: 'translate(-50%,-50%) rotate(460deg) scale(12)' },
    ], 490, { delay: 170, fill: 'both', easing: 'cubic-bezier(.45,.05,.42,1)' });
    fade(sprite, 1, 0, 280, 370);
    return 680;
  },
  cork(art) {
    const route = svgElement('svg', { viewBox: '0 0 497 377', fill: 'none' });
    const path = svgElement('path', {
      d: 'M174 122 L246 103 L263 128 L300 153 L302 188 L370 229 L352 264 L287 278 L237 304 L221 301 L214 262',
      pathLength: '1', stroke: '#235e54', 'stroke-width': '5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    });
    route.append(path);
    art.append(route);
    animate(path, [{ strokeDasharray: '1', strokeDashoffset: '1' }, { strokeDasharray: '1', strokeDashoffset: '0' }], 500, {
      delay: 155, fill: 'both', easing: 'ease-in-out',
    });
    return 710;
  },
  keys(art, sprite) {
    const key = detail(art, 'key-press');
    key.append(sprite.cloneNode());
    animate(key, [
      { opacity: 0, transform: 'translateY(0)' },
      { opacity: 1, transform: 'translateY(5%)', offset: .28 },
      { opacity: 1, transform: 'translateY(12%)', offset: .57 },
      { opacity: 0, transform: 'translateY(0)' },
    ], 375, { delay: 145, fill: 'both', easing: 'ease-in-out' });
    animate(art, [
      { transform: 'translateY(0) rotate(0)' },
      { transform: 'translateY(7px) rotate(-1.5deg)', offset: .36 },
      { transform: 'translateY(-30px) rotate(-3deg)', opacity: 0 },
    ], 440, { delay: 230, easing: 'ease-in-out' });
    return 660;
  },
  shield(art, sprite) {
    const rim = detail(art, 'heat-rim');
    animate(rim, [
      { opacity: 0 },
      { opacity: .85, offset: .44 },
      { opacity: 0 },
    ], 440, { delay: 130, fill: 'both', easing: 'ease-in-out' });
    animate(sprite, [
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.27) drop-shadow(0 0 15px #ff884b)', offset: .5 },
      { filter: 'brightness(1)' },
    ], 470, { delay: 130 });
    return 635;
  },
  europe(art, sprite) {
    for (const [side, angle] of [['left', -74], ['right', 74]]) {
      const fold = detail(art, `map-fold map-fold-${side}`);
      fold.style.backgroundImage = `url("${sprite.src}")`;
      animate(fold, [
        { transform: `perspective(420px) rotateY(${angle}deg)` },
        { transform: 'perspective(420px) rotateY(0deg)' },
      ], 475, { delay: 145, fill: 'both', easing: 'cubic-bezier(.17,.68,.16,1)' });
    }
    sprite.style.clipPath = 'inset(0 33% 0 33%)';
    return 680;
  },
};

async function openChapter(link) {
  const image = link.querySelector('img');
  const from = image.getBoundingClientRect();
  const object = link.dataset.object;
  selection = link.href;
  transition.dataset.object = object;
  transition.hidden = false;
  portfolio.inert = true;
  const art = document.createElement('div');
  art.className = 'transition-art';
  const sprite = image.cloneNode();
  art.append(sprite);
  transition.replaceChildren(art);
  const to = sprite.getBoundingClientRect();
  const x = from.left + from.width / 2 - (to.left + to.width / 2);
  const y = from.top + from.height / 2 - (to.top + to.height / 2);
  const scale = Math.min(from.width / to.width, from.height / to.height);
  fade(transition, 0, 1, 175);
  animate(art, [
    { transform: `translate(${x}px, ${y}px) scale(${scale})` },
    { transform: 'translate(0, 0) scale(1)' },
  ], 245, { easing: 'cubic-bezier(.16,.77,.21,1)' });
  const duration = chapterMotions[object](art, sprite);
  await sleep(duration);
  if (selection === link.href) location.assign(link.href);
}

for (const link of links) {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || motion.matches) return;
    event.preventDefault();
    if (selection) return;
    openChapter(link).catch(() => location.assign(link.href));
  });
}

skip.addEventListener('click', () => endIntro({ focus: true }));
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && html.dataset.intro) endIntro({ focus: true });
});
motion.addEventListener('change', event => {
  if (event.matches && introActive) endIntro();
  if (event.matches && selection) location.assign(selection);
});
window.addEventListener('resize', () => {
  if (html.dataset.intro === 'burst') endIntro();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  endIntro();
  transition.hidden = true;
  transition.replaceChildren();
  selection = null;
});
if (html.dataset.intro === 'pending') runIntro();
