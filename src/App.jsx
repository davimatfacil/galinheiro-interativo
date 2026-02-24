import { useState, useRef, useEffect } from "react";

const L = 40; // metros de tela

function calcArea(y) {
  return (L - 2 * y) * y;
}

function GalinheiroDiagram({ y }) {
  const x = L - 2 * y;
  const area = calcArea(y);

  // Normalizar para canvas
  const maxDim = Math.max(x, y * 2 + 2);
  const scale = 220 / maxDim;
  const W = x * scale;
  const H = y * scale;

  const cx = 260; // centro x do canvas
  const top = 60;
  const left = cx - W / 2;

  return (
    <svg width="520" height="280" style={{ display: "block", margin: "0 auto" }}>
      {/* Parede */}
      <line
        x1={left - 20} y1={top}
        x2={left + W + 20} y2={top}
        stroke="#a8e6a3" strokeWidth="5" strokeLinecap="round"
      />
      <text x={cx} y={top - 10} fill="#a8e6a3" textAnchor="middle" fontSize="12" fontFamily="'Courier New', monospace">
        ← parede (grátis) →
      </text>

      {/* Galinheiro */}
      <rect
        x={left} y={top}
        width={W} height={H}
        fill="rgba(144,238,144,0.08)"
        stroke="#90ee90"
        strokeWidth="2.5"
        strokeDasharray="6,3"
      />

      {/* Label x */}
      <line x1={left} y1={top + H + 20} x2={left + W} y2={top + H + 20} stroke="#ffd700" strokeWidth="1.5" />
      <line x1={left} y1={top + H + 14} x2={left} y2={top + H + 26} stroke="#ffd700" strokeWidth="1.5" />
      <line x1={left + W} y1={top + H + 14} x2={left + W} y2={top + H + 26} stroke="#ffd700" strokeWidth="1.5" />
      <text x={cx} y={top + H + 36} fill="#ffd700" textAnchor="middle" fontSize="13" fontFamily="'Courier New', monospace">
        x = {x.toFixed(1)} m
      </text>

      {/* Label y direita */}
      <line x1={left + W + 20} y1={top} x2={left + W + 20} y2={top + H} stroke="#ffd700" strokeWidth="1.5" />
      <line x1={left + W + 14} y1={top} x2={left + W + 26} y2={top} stroke="#ffd700" strokeWidth="1.5" />
      <line x1={left + W + 14} y1={top + H} x2={left + W + 26} y2={top + H} stroke="#ffd700" strokeWidth="1.5" />
      <text x={left + W + 36} y={top + H / 2 + 5} fill="#ffd700" textAnchor="start" fontSize="13" fontFamily="'Courier New', monospace">
        y = {y.toFixed(1)} m
      </text>

      {/* Área no centro */}
      {W > 60 && H > 30 && (
        <text x={cx} y={top + H / 2 + 6} fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="13" fontFamily="'Courier New', monospace">
          A = {area.toFixed(1)} m²
        </text>
      )}

      {/* Galinha emoji */}
      {W > 40 && H > 25 && (
        <text x={cx} y={top + H / 2 - 10} textAnchor="middle" fontSize="22">🐔</text>
      )}
    </svg>
  );
}

function ParabolaGraph({ y }) {
  const width = 500;
  const height = 220;
  const padL = 55, padR = 20, padT = 20, padB = 40;
  const gW = width - padL - padR;
  const gH = height - padT - padB;

  const yMax = L / 2; // limite real de y (x não pode ser negativo)
  const aMax = calcArea(L / 4);

  const toSvgX = (yVal) => padL + (yVal / yMax) * gW;
  const toSvgY = (a) => padT + gH - (a / (aMax * 1.1)) * gH;

  // Pontos da parábola
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const yv = (i / 100) * yMax;
    const a = calcArea(yv);
    points.push(`${toSvgX(yv)},${toSvgY(a)}`);
  }

  const currentA = calcArea(y);
  const cx = toSvgX(y);
  const cy = toSvgY(currentA);

  // Ponto ótimo
  const optY = L / 4;
  const optA = calcArea(optY);
  const optX = toSvgX(optY);
  const optSvgY = toSvgY(optA);

  // Eixo Y labels
  const yLabels = [0, 5, 10];

  return (
    <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
      {/* Grid */}
      {yLabels.map(v => (
        <line key={v}
          x1={padL} y1={toSvgY((v / 10) * aMax)}
          x2={width - padR} y2={toSvgY((v / 10) * aMax)}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        />
      ))}

      {/* Eixos */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + gH} stroke="#a8e6a3" strokeWidth="1.5" />
      <line x1={padL} y1={padT + gH} x2={width - padR} y2={padT + gH} stroke="#a8e6a3" strokeWidth="1.5" />

      {/* Label eixo Y */}
      <text x={14} y={padT + gH / 2} fill="#a8e6a3" fontSize="11" fontFamily="'Courier New', monospace" textAnchor="middle" transform={`rotate(-90, 14, ${padT + gH / 2})`}>
        Área (m²)
      </text>

      {/* Label eixo X */}
      <text x={padL + gW / 2} y={height - 5} fill="#a8e6a3" fontSize="11" fontFamily="'Courier New', monospace" textAnchor="middle">
        y (m)
      </text>

      {/* Tick marks eixo X */}
      {[0, 5, 10, 15, 20].map(v => (
        <g key={v}>
          <line x1={toSvgX(v)} y1={padT + gH} x2={toSvgX(v)} y2={padT + gH + 5} stroke="#a8e6a3" strokeWidth="1" />
          <text x={toSvgX(v)} y={padT + gH + 16} fill="#a8e6a3" fontSize="10" fontFamily="'Courier New', monospace" textAnchor="middle">{v}</text>
        </g>
      ))}

      {/* Tick eixo Y - máximo */}
      <text x={padL - 5} y={toSvgY(aMax) + 4} fill="#a8e6a3" fontSize="10" fontFamily="'Courier New', monospace" textAnchor="end">{aMax.toFixed(0)}</text>

      {/* Linha vertical do ótimo */}
      <line x1={optX} y1={padT} x2={optX} y2={padT + gH}
        stroke="rgba(255,215,0,0.25)" strokeWidth="1" strokeDasharray="4,3" />
      <text x={optX} y={padT - 6} fill="#ffd700" fontSize="10" fontFamily="'Courier New', monospace" textAnchor="middle">
        y* = {optY}
      </text>

      {/* Parábola */}
      <polyline points={points.join(" ")} fill="none" stroke="#4fc3f7" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Ponto ótimo */}
      <circle cx={optX} cy={optSvgY} r={5} fill="#ffd700" stroke="#fff" strokeWidth="1.5" />

      {/* Ponto atual */}
      <circle cx={cx} cy={cy} r={7} fill="#ff6b6b" stroke="#fff" strokeWidth="2" />
      <text x={cx + 10} y={cy - 8} fill="#ff6b6b" fontSize="11" fontFamily="'Courier New', monospace">
        {currentA.toFixed(1)} m²
      </text>
    </svg>
  );
}

export default function App() {
  const [y, setY] = useState(7);
  const yMax = L / 2 - 0.1;
  const x = L - 2 * y;
  const area = calcArea(y);
  const aOpt = calcArea(L / 4);
  const isOptimal = Math.abs(y - L / 4) < 0.3;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a2a1a",
      backgroundImage: "radial-gradient(ellipse at top, #1e3a1e 0%, #0f1a0f 100%)",
      fontFamily: "'Courier New', monospace",
      color: "#e8f5e9",
      padding: "20px 16px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(144,238,144,0.3)",
          borderRadius: "8px",
          padding: "6px 16px",
          fontSize: "11px",
          color: "#a8e6a3",
          letterSpacing: "2px",
          marginBottom: "12px",
        }}>
          OTIMIZAÇÃO — CÁLCULO DIFERENCIAL
        </div>
        <h1 style={{
          fontSize: "clamp(20px, 4vw, 30px)",
          color: "#90ee90",
          margin: "0 0 6px",
          fontWeight: "bold",
          textShadow: "0 0 20px rgba(144,238,144,0.3)",
        }}>
          🐔 O Galinheiro de Descartes
        </h1>
        <p style={{ color: "#a8e6a3", fontSize: "13px", margin: 0 }}>
          Arraste o slider e descubra o formato que maximiza a área
        </p>
      </div>

      {/* Card principal */}
      <div style={{
        maxWidth: "560px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(144,238,144,0.2)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>

        {/* Problema */}
        <div style={{
          background: "rgba(144,238,144,0.06)",
          border: "1px solid rgba(144,238,144,0.15)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          lineHeight: "1.6",
          color: "#c8e6c9",
        }}>
          Você tem <strong style={{ color: "#ffd700" }}>L = {L} metros</strong> de tela. Um lado encosta na parede (grátis).
          Qual o formato que <strong style={{ color: "#ff6b6b" }}>maximiza a área</strong>?
        </div>

        {/* Slider */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "12px", color: "#a8e6a3", marginBottom: "8px",
          }}>
            <span>y = comprimento lateral</span>
            <span style={{
              color: isOptimal ? "#ffd700" : "#ff6b6b",
              fontWeight: "bold",
              transition: "color 0.3s",
            }}>
              y = <strong>{y.toFixed(1)}</strong> m
              {isOptimal ? " ✨ ótimo!" : ""}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={yMax}
            step="0.1"
            value={y}
            onChange={e => setY(parseFloat(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#90ee90",
              cursor: "pointer",
              height: "6px",
            }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "11px", color: "rgba(168,230,163,0.5)", marginTop: "4px",
          }}>
            <span>1 m</span>
            <span style={{ color: "#ffd700" }}>ótimo: y* = {L / 4} m</span>
            <span>{yMax.toFixed(0)} m</span>
          </div>
        </div>

        {/* Diagrama do galinheiro */}
        <div style={{ marginBottom: "16px", overflowX: "auto" }}>
          <GalinheiroDiagram y={y} />
        </div>

        {/* Métricas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          marginBottom: "20px",
        }}>
          {[
            { label: "x (frontal)", val: `${x.toFixed(1)} m`, color: "#4fc3f7" },
            { label: "y (lateral)", val: `${y.toFixed(1)} m`, color: "#4fc3f7" },
            {
              label: "Área atual",
              val: `${area.toFixed(1)} m²`,
              color: isOptimal ? "#ffd700" : "#ff6b6b",
            },
          ].map(m => (
            <div key={m.label} style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(144,238,144,0.15)",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "10px", color: "#a8e6a3", marginBottom: "4px" }}>{m.label}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* Gráfico parábola */}
        <div style={{
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(144,238,144,0.15)",
          borderRadius: "8px",
          padding: "14px 8px 8px",
          marginBottom: "20px",
          overflowX: "auto",
        }}>
          <div style={{ fontSize: "11px", color: "#a8e6a3", textAlign: "center", marginBottom: "8px" }}>
            A(y) = (L − 2y)·y — a parábola da área
          </div>
          <ParabolaGraph y={y} />
          <div style={{ fontSize: "10px", color: "rgba(168,230,163,0.6)", textAlign: "center", marginTop: "6px" }}>
            🔴 posição atual &nbsp;|&nbsp; 🟡 ponto ótimo (máximo)
          </div>
        </div>

        {/* Solução matemática */}
        <div style={{
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(144,238,144,0.15)",
          borderRadius: "8px",
          padding: "14px 16px",
          fontSize: "12px",
          lineHeight: "1.8",
        }}>
          <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "8px", fontSize: "13px" }}>
            📐 A solução pela derivada
          </div>
          <div style={{ color: "#c8e6c9" }}>
            Restrição: <span style={{ color: "#4fc3f7" }}>x + 2y = {L}</span>
            <br />
            Área: <span style={{ color: "#4fc3f7" }}>A(y) = ({L} − 2y)·y = {L}y − 2y²</span>
            <br />
            Derivada: <span style={{ color: "#4fc3f7" }}>A'(y) = {L} − 4y = 0</span>
            <br />
            <span style={{ color: "#ffd700", fontWeight: "bold" }}>
              y* = {L / 4} m &nbsp;→&nbsp; x* = {L / 2} m &nbsp;→&nbsp; A* = {aOpt} m²
            </span>
          </div>
          {isOptimal ? (
            <div style={{
              marginTop: "10px",
              padding: "8px 12px",
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.3)",
              borderRadius: "6px",
              color: "#ffd700",
              fontSize: "12px",
            }}>
              ✨ Você encontrou o ponto ótimo! A área máxima é <strong>{aOpt} m²</strong>.
            </div>
          ) : (
            <div style={{
              marginTop: "10px",
              color: "rgba(168,230,163,0.5)",
              fontSize: "11px",
            }}>
              Arraste até y = {L / 4} para encontrar o máximo...
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "11px",
          color: "rgba(168,230,163,0.4)",
          borderTop: "1px solid rgba(144,238,144,0.1)",
          paddingTop: "12px",
        }}>
          prof. Davi Rocha •{" "}
          <a href="https://davimatfacil.github.io/meu-site/ensino/galinheiro-de-descartes.html"
            style={{ color: "#a8e6a3" }} target="_blank" rel="noreferrer">
            Ler o artigo completo →
          </a>
        </div>
      </div>
    </div>
  );
}
