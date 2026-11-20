import type { SceneKey } from "@/lib/data/types";

/**
 * Illustrated stand-in "photos" for the demo, ported from
 * `docs/reference/prototype/scenes.js`.
 *
 * No real photographs are used anywhere in the mock data, so nothing here can
 * be mistaken for documentary imagery (GRAPHICS_PROMPTS §0). Once the CMS
 * supplies `media.url`, `StoryImage` renders `next/image` instead and these
 * are only used as the no-photo fallback.
 *
 * Rendered as plain SVG elements (no `dangerouslySetInnerHTML`) and always
 * `aria-hidden` — the alt text lives on the wrapper in `StoryImage`.
 */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function City({ id }: { id: string }) {
  const towers = [
    [10, 120, 40, 130],
    [55, 90, 35, 160],
    [95, 140, 50, 110],
    [150, 70, 30, 180],
    [185, 110, 55, 140],
    [245, 135, 35, 115],
    [285, 95, 45, 155],
    [335, 125, 60, 125],
  ];
  const windows = [
    [62, 105],
    [76, 125],
    [157, 90],
    [167, 120],
    [295, 110],
    [312, 140],
    [200, 130],
  ];
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6b26b" />
          <stop offset="1" stopColor="#e06666" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#sky-${id})`} />
      <circle cx="300" cy="90" r="34" fill="#ffe599" opacity=".9" />
      <g fill="#5b3a52">
        {towers.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      <rect y="200" width="400" height="50" fill="#3d2436" />
      <g fill="#ffd966" opacity=".8">
        {windows.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="8" />
        ))}
      </g>
    </>
  );
}

function Rain() {
  return (
    <>
      <rect width="400" height="250" fill="#5f7c8a" />
      <g fill="#8ea6b1">
        <ellipse cx="110" cy="60" rx="90" ry="35" />
        <ellipse cx="200" cy="45" rx="80" ry="38" />
        <ellipse cx="300" cy="65" rx="95" ry="36" />
      </g>
      <g stroke="#cfe2f3" strokeWidth="2" opacity=".8">
        {range(40).map((i) => (
          <line
            key={i}
            x1={(i * 37) % 400}
            y1={90 + ((i * 13) % 60)}
            x2={((i * 37) % 400) - 8}
            y2={110 + ((i * 13) % 60)}
          />
        ))}
      </g>
      <rect y="200" width="400" height="50" fill="#36505c" />
      <path d="M150 200 q30-40 60 0z" fill="#c0392b" />
      <rect x="179" y="200" width="2" height="30" fill="#222" />
    </>
  );
}

function Cricket() {
  return (
    <>
      <rect width="400" height="250" fill="#1e3a5f" />
      <g fill="#fff" opacity=".9">
        <circle cx="40" cy="30" r="10" />
        <circle cx="360" cy="30" r="10" />
      </g>
      <path d="M0 120 Q200 60 400 120 L400 250 L0 250Z" fill="#2e7d32" />
      <ellipse cx="200" cy="190" rx="150" ry="45" fill="#43a047" />
      <rect
        x="180"
        y="150"
        width="40"
        height="80"
        fill="#c5b358"
        transform="skewX(-8)"
      />
      <g stroke="#fff" strokeWidth="3">
        <line x1="192" y1="150" x2="192" y2="170" />
        <line x1="198" y1="150" x2="198" y2="170" />
        <line x1="204" y1="150" x2="204" y2="170" />
      </g>
      <circle cx="260" cy="120" r="7" fill="#c62828" />
    </>
  );
}

function Market() {
  return (
    <>
      <rect width="400" height="250" fill="#0d1b2a" />
      <g stroke="#1b2a3a">
        {range(8).map((i) => (
          <line key={i} x1="0" y1={i * 32} x2="400" y2={i * 32} />
        ))}
      </g>
      <polyline
        points="0,200 50,180 90,190 130,150 170,160 210,120 250,130 290,90 330,100 400,50"
        fill="none"
        stroke="#2ecc71"
        strokeWidth="5"
      />
      <g>
        {range(12).map((i) => {
          const h = 30 + ((i * 47) % 70);
          const up = i % 3 !== 1;
          return (
            <rect
              key={i}
              x={12 + i * 32}
              y={230 - h}
              width="14"
              height={h}
              fill={up ? "#27ae60" : "#e74c3c"}
              opacity=".5"
            />
          );
        })}
      </g>
    </>
  );
}

function Tech() {
  return (
    <>
      <rect width="400" height="250" fill="#1a1037" />
      <circle cx="200" cy="125" r="110" fill="#2b1b5c" />
      <rect x="140" y="65" width="120" height="120" rx="10" fill="#4527a0" />
      <rect x="165" y="90" width="70" height="70" rx="6" fill="#7e57c2" />
      <g stroke="#b39ddb" strokeWidth="4">
        {[80, 105, 130, 155, 180].map((y) => (
          <g key={y}>
            <line x1="110" y1={y} x2="140" y2={y} />
            <line x1="260" y1={y} x2="290" y2={y} />
          </g>
        ))}
        {[160, 185, 210, 235].map((x) => (
          <g key={x}>
            <line x1={x} y1="35" x2={x} y2="65" />
            <line x1={x} y1="185" x2={x} y2="215" />
          </g>
        ))}
      </g>
    </>
  );
}

function Hills() {
  return (
    <>
      <rect width="400" height="250" fill="#a7d3e8" />
      <circle cx="80" cy="60" r="26" fill="#fff6c2" />
      <path
        d="M0 170 L90 70 L170 160 L250 60 L400 190 L400 250 L0 250Z"
        fill="#5d7f8f"
      />
      <path d="M90 70 L110 92 L75 88Z M250 60 L275 88 L232 82Z" fill="#fff" />
      <path d="M0 210 Q100 170 200 205 T400 200 L400 250 L0 250Z" fill="#3f6b4f" />
    </>
  );
}

function Cinema() {
  return (
    <>
      <rect width="400" height="250" fill="#2a0e1f" />
      <path d="M60 0 L160 250 L-40 250Z" fill="#ffd54f" opacity=".18" />
      <path d="M340 0 L440 250 L240 250Z" fill="#ffd54f" opacity=".18" />
      <rect
        x="120"
        y="60"
        width="160"
        height="110"
        fill="#4a1c34"
        stroke="#d4a017"
        strokeWidth="4"
      />
      <circle cx="200" cy="115" r="30" fill="#d4a017" opacity=".8" />
      <polygon points="190,100 190,130 215,115" fill="#2a0e1f" />
      <rect y="200" width="400" height="50" fill="#7b1e3a" />
      <g fill="#2a0e1f">
        {range(14).map((i) => (
          <circle key={i} cx={15 + i * 29} cy="205" r="11" />
        ))}
      </g>
    </>
  );
}

function Road() {
  return (
    <>
      <rect width="400" height="250" fill="#cfd8dc" />
      <path d="M150 0 L250 0 L400 250 L0 250Z" fill="#455a64" />
      <g fill="#fff">
        {[20, 70, 130, 200].map((y, i) => (
          <rect
            key={y}
            x={196 - i * 2}
            y={y}
            width={8 + i * 3}
            height={20 + i * 8}
          />
        ))}
      </g>
      <g transform="translate(120 150)">
        <rect x="0" y="20" width="160" height="40" rx="12" fill="#c62828" />
        <path d="M30 20 Q50 -10 110 0 L135 20Z" fill="#e53935" />
        <circle cx="35" cy="62" r="16" fill="#212121" />
        <circle cx="125" cy="62" r="16" fill="#212121" />
      </g>
    </>
  );
}

function School() {
  return (
    <>
      <rect width="400" height="250" fill="#fdf2e3" />
      <rect x="60" y="40" width="280" height="150" fill="#2e4d3a" />
      <g stroke="#fff" strokeWidth="3" opacity=".8">
        <path d="M90 80 h80 M90 110 h120 M90 140 h60" />
        <circle cx="270" cy="110" r="30" fill="none" />
      </g>
      <rect x="40" y="190" width="320" height="10" fill="#8d6e63" />
      <g fill="#f4a261">
        {[80, 170, 260].map((x) => (
          <rect key={x} x={x} y="210" width="60" height="40" />
        ))}
      </g>
    </>
  );
}

function Farm() {
  return (
    <>
      <rect width="400" height="250" fill="#ffe0b2" />
      <circle cx="320" cy="70" r="30" fill="#ff9800" />
      <path d="M0 140 L400 120 L400 250 L0 250Z" fill="#c5a14a" />
      <g stroke="#8d6e1f" strokeWidth="3">
        {range(14).map((i) => (
          <line
            key={i}
            x1={i * 30}
            y1="250"
            x2={200 + (i - 7) * 8}
            y2="135"
          />
        ))}
      </g>
      <path
        d="M40 140 v-30 M40 110 q-12-8 0-24 q12 16 0 24"
        stroke="#4e7d2b"
        strokeWidth="5"
        fill="#6aa84f"
      />
    </>
  );
}

function Temple() {
  return (
    <>
      <rect width="400" height="250" fill="#ffcc80" />
      <circle cx="200" cy="80" r="60" fill="#ffe0b2" />
      <g fill="#e65100">
        <path d="M200 30 L235 110 L165 110Z" />
        <rect x="150" y="110" width="100" height="90" />
        <path d="M110 110 L135 160 L85 160Z M290 110 L315 160 L265 160Z" />
        <rect x="90" y="160" width="40" height="40" />
        <rect x="270" y="160" width="40" height="40" />
      </g>
      <rect x="185" y="150" width="30" height="50" fill="#bf360c" />
      <rect y="200" width="400" height="50" fill="#8d4e1f" />
      <path d="M200 18 v12" stroke="#c62828" strokeWidth="3" />
      <path d="M200 18 l14 5 l-14 5z" fill="#c62828" />
    </>
  );
}

function Space() {
  return (
    <>
      <rect width="400" height="250" fill="#0b1026" />
      <g fill="#fff">
        {range(50).map((i) => (
          <circle
            key={i}
            cx={(i * 73) % 400}
            cy={(i * 41) % 250}
            r={i % 5 === 0 ? 1.6 : 0.8}
          />
        ))}
      </g>
      <circle cx="90" cy="210" r="120" fill="#1e3a8a" />
      <path d="M230 170 l40-100 l40 100 z" fill="#e5e7eb" />
      <path d="M255 170 l15 40 l15 -40z" fill="#f97316" />
      <circle cx="270" cy="115" r="8" fill="#3b82f6" />
    </>
  );
}

function Crowd() {
  const heads = ["#5d4037", "#455a64", "#6d4c41", "#37474f"];
  const shirts = ["#1976d2", "#c62828", "#388e3c", "#f9a825"];
  return (
    <>
      <rect width="400" height="250" fill="#ffecb3" />
      <rect y="40" width="400" height="30" fill="#ff7043" />
      <g>
        {range(16).map((i) => (
          <g key={i}>
            <circle
              cx={12 + i * 25}
              cy={150 + (i % 3) * 8}
              r="12"
              fill={heads[i % 4]}
            />
            <rect
              x={i * 25}
              y={165 + (i % 3) * 8}
              width="24"
              height="90"
              rx="10"
              fill={shirts[i % 4]}
            />
          </g>
        ))}
      </g>
    </>
  );
}

function Hospital() {
  return (
    <>
      <rect width="400" height="250" fill="#e0f2f1" />
      <rect
        x="110"
        y="60"
        width="180"
        height="190"
        fill="#fff"
        stroke="#80cbc4"
        strokeWidth="3"
      />
      <rect x="180" y="80" width="40" height="40" fill="#e53935" />
      <rect x="192" y="86" width="16" height="28" fill="#fff" />
      <rect x="186" y="92" width="28" height="16" fill="#fff" />
      <g fill="#b2dfdb">
        {[140, 190, 240].map((x) =>
          [140, 180].map((y) => (
            <rect key={`${x}-${y}`} x={x - 10} y={y} width="30" height="24" />
          )),
        )}
      </g>
    </>
  );
}

const SCENES: Record<SceneKey, (props: { id: string }) => React.ReactElement> = {
  city: City,
  rain: Rain,
  cricket: Cricket,
  market: Market,
  tech: Tech,
  hills: Hills,
  cinema: Cinema,
  road: Road,
  school: School,
  farm: Farm,
  temple: Temple,
  space: Space,
  crowd: Crowd,
  hospital: Hospital,
};

export function SceneArt({
  scene,
  /** Keeps gradient ids unique when several scenes share a page. */
  seed,
  className,
}: {
  scene: SceneKey;
  seed: string;
  className?: string;
}) {
  const Scene = SCENES[scene] ?? City;
  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Scene id={seed} />
    </svg>
  );
}
