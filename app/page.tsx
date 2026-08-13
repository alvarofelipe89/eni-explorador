"use client";

import { useEffect, useMemo, useState } from "react";

type DataPoint = {
  label: string;
  value: number;
  detail: string;
};

type Module = {
  id: string;
  number: string;
  short: string;
  title: string;
  question: string;
  accent: string;
  status: "reference" | "demo";
  unit: string;
  denominator: string;
  insightPrompt: string;
  caveat: string;
  data: DataPoint[];
};

type Answer = {
  finding: string;
  evidence: string;
  interpretation: string;
  limitation: string;
};

const EMPTY_ANSWER: Answer = {
  finding: "",
  evidence: "",
  interpretation: "",
  limitation: "",
};

const modules: Module[] = [
  {
    id: "tipos",
    number: "01",
    short: "Tipos",
    title: "Tipos de innovación",
    question: "¿Qué tipo de innovación aparece con mayor frecuencia?",
    accent: "#7653d7",
    status: "reference",
    unit: "% de empresas",
    denominator: "Empresas representadas por la ENI 2021–2022.",
    insightPrompt:
      "Compara producto y procesos. Expresa la diferencia en puntos porcentuales.",
    caveat:
      "Las categorías pueden superponerse: una empresa puede innovar en producto y también en procesos.",
    data: [
      {
        label: "Procesos de negocio",
        value: 9.2,
        detail: "Implementó procesos internos nuevos o significativamente mejorados.",
      },
      {
        label: "Producto",
        value: 4.2,
        detail: "Introdujo al mercado bienes o servicios nuevos o significativamente mejorados.",
      },
      {
        label: "Producto y procesos",
        value: 2.8,
        detail: "Realizó ambos tipos de innovación durante el período.",
      },
    ],
  },
  {
    id: "obstaculos",
    number: "02",
    short: "Obstáculos",
    title: "Obstáculos a la innovación",
    question: "¿Qué barreras parecen frenar con mayor fuerza la innovación?",
    accent: "#c33b86",
    status: "demo",
    unit: "% que declara influencia alta o media",
    denominator: "Valores simulados para probar la interfaz.",
    insightPrompt:
      "Ordena las barreras y explica si predominan factores de costos, conocimiento o mercado.",
    caveat:
      "Estos valores son demostrativos y serán sustituidos por los cuadros oficiales antes de usar el ejercicio en clase.",
    data: [
      {
        label: "Costos y financiamiento",
        value: 58,
        detail: "Fondos propios insuficientes, financiamiento externo o costos elevados.",
      },
      {
        label: "Conocimiento",
        value: 44,
        detail: "Personal calificado, información tecnológica o socios de cooperación.",
      },
      {
        label: "Mercado",
        value: 39,
        detail: "Incertidumbre de demanda o mercados dominados por empresas establecidas.",
      },
      {
        label: "Otros factores",
        value: 31,
        detail: "La empresa no percibe necesidad o enfrenta otros desincentivos.",
      },
    ],
  },
  {
    id: "tamano",
    number: "03",
    short: "Tamaño",
    title: "Tasa según tamaño de empresa",
    question: "¿Cómo cambia la innovación según el tamaño de la empresa?",
    accent: "#087f9e",
    status: "reference",
    unit: "% de empresas que innovó",
    denominator: "Empresas representadas por la ENI 2021–2022.",
    insightPrompt:
      "Calcula la brecha entre empresas grandes y pequeñas o medianas. No confundas porcentaje con puntos porcentuales.",
    caveat:
      "La comparación muestra una asociación; por sí sola no demuestra que el tamaño cause la innovación.",
    data: [
      {
        label: "Empresas grandes",
        value: 25,
        detail: "Aproximadamente una de cada cuatro empresas grandes innovó.",
      },
      {
        label: "Pequeñas y medianas",
        value: 9.4,
        detail: "Menos de una de cada diez pequeñas o medianas empresas innovó.",
      },
      {
        label: "Total nacional",
        value: 10.7,
        detail: "Referencia general publicada por el INE para 2021–2022.",
      },
    ],
  },
  {
    id: "fuentes",
    number: "04",
    short: "Fuentes",
    title: "Fuentes de información",
    question: "¿De dónde obtienen información las empresas para innovar?",
    accent: "#118a82",
    status: "demo",
    unit: "% que considera la fuente relevante",
    denominator: "Valores simulados para probar la interfaz.",
    insightPrompt:
      "Distingue fuentes internas, de mercado e institucionales. Compara la primera con la última.",
    caveat:
      "“Fuente de información” no equivale a financiamiento ni necesariamente a cooperación formal.",
    data: [
      {
        label: "Dentro de la empresa",
        value: 64,
        detail: "Equipos, áreas o personas pertenecientes a la propia empresa.",
      },
      {
        label: "Clientes",
        value: 51,
        detail: "Información entregada por clientes o usuarios de los productos.",
      },
      {
        label: "Proveedores",
        value: 43,
        detail: "Empresas proveedoras de equipos, materiales, componentes o software.",
      },
      {
        label: "Universidades e institutos",
        value: 18,
        detail: "Instituciones de educación superior o investigación.",
      },
    ],
  },
];

const initialAnswers = Object.fromEntries(
  modules.map((item) => [item.id, { ...EMPTY_ANSWER }]),
) as Record<string, Answer>;

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export default function Home() {
  const [activeId, setActiveId] = useState(modules[0].id);
  const [selectedLabel, setSelectedLabel] = useState(modules[0].data[0].label);
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers);
  const [copyState, setCopyState] = useState("Copiar respuesta");

  const active = useMemo(
    () => modules.find((item) => item.id === activeId) ?? modules[0],
    [activeId],
  );

  const selected =
    active.data.find((item) => item.label === selectedLabel) ?? active.data[0];
  const maxValue = Math.max(...active.data.map((item) => item.value));

  useEffect(() => {
    const saved = window.localStorage.getItem("eni-respuestas");
    if (saved) {
      try {
        setAnswers({ ...initialAnswers, ...JSON.parse(saved) });
      } catch {
        window.localStorage.removeItem("eni-respuestas");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("eni-respuestas", JSON.stringify(answers));
  }, [answers]);

  function chooseModule(id: string) {
    const next = modules.find((item) => item.id === id) ?? modules[0];
    setActiveId(next.id);
    setSelectedLabel(next.data[0].label);
    setCopyState("Copiar respuesta");
  }

  function updateAnswer(field: keyof Answer, value: string) {
    setAnswers((current) => ({
      ...current,
      [active.id]: { ...current[active.id], [field]: value },
    }));
  }

  async function copyAnswer() {
    const answer = answers[active.id];
    const text = [
      `Grupo ${Number(active.number)} · ${active.title}`,
      `Hallazgo: ${answer.finding || "—"}`,
      `Evidencia: ${answer.evidence || "—"}`,
      `Interpretación: ${answer.interpretation || "—"}`,
      `Limitación: ${answer.limitation || "—"}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopyState("¡Respuesta copiada!");
    window.setTimeout(() => setCopyState("Copiar respuesta"), 1800);
  }

  return (
    <main className="site-shell" style={{ "--accent": active.accent } as React.CSSProperties}>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brand-mark">ENI</span>
          <span>
            <strong>Laboratorio de datos</strong>
            <small>Innovación en empresas · Chile</small>
          </span>
        </a>
        <div className="period-pill">
          <span className="live-dot" /> Período 2021–2022
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Explorador educativo · prototipo</p>
          <h1>
            Investiga cómo innovan
            <span> las empresas en Chile.</span>
          </h1>
          <p className="hero-intro">
            Elige tu grupo, encuentra evidencia en el gráfico y construye una
            respuesta que distinga datos, interpretación y límites.
          </p>
          <a className="primary-cta" href="#explorador">
            Comenzar exploración <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="hero-stat" aria-label="Indicador nacional destacado">
          <p>Tasa nacional de innovación</p>
          <strong>10,7<span>%</span></strong>
          <div className="stat-rule" />
          <small>
            Empresas que realizaron innovación durante 2021–2022.
            <br />Fuente: INE Chile.
          </small>
        </aside>
      </section>

      <section className="explorer" id="explorador">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cuatro rutas de investigación</p>
            <h2>¿Qué te corresponde analizar?</h2>
          </div>
          <p className="section-note">
            Selecciona un grupo. Tus respuestas quedan guardadas únicamente en
            este navegador.
          </p>
        </div>

        <div className="module-tabs" role="tablist" aria-label="Grupos de análisis">
          {modules.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active.id === item.id}
              className={active.id === item.id ? "module-tab active" : "module-tab"}
              style={{ "--tab-accent": item.accent } as React.CSSProperties}
              onClick={() => chooseModule(item.id)}
            >
              <span>{item.number}</span>
              <strong>{item.short}</strong>
            </button>
          ))}
        </div>

        <article className="analysis-card" role="tabpanel">
          <div className="analysis-header">
            <div>
              <p className="group-label">Grupo {Number(active.number)}</p>
              <h2>{active.title}</h2>
              <p className="research-question">{active.question}</p>
            </div>
            <div className={`data-badge ${active.status}`}>
              <span />
              {active.status === "reference" ? "Referencia ENI" : "Datos de demostración"}
            </div>
          </div>

          {active.status === "demo" && (
            <div className="demo-alert" role="note">
              <strong>Modo de prueba:</strong> estos porcentajes son simulados para
              evaluar la experiencia. No deben citarse como resultados de la ENI.
            </div>
          )}

          <div className="analysis-grid">
            <section className="chart-panel" aria-labelledby="chart-title">
              <div className="chart-heading">
                <div>
                  <p id="chart-title">Comparación nacional</p>
                  <small>{active.unit}</small>
                </div>
                <span>Haz clic en una barra</span>
              </div>

              <div className="bar-chart">
                {active.data.map((item, index) => (
                  <button
                    type="button"
                    key={item.label}
                    className={selected.label === item.label ? "bar-row selected" : "bar-row"}
                    onClick={() => setSelectedLabel(item.label)}
                    aria-label={`${item.label}: ${formatNumber(item.value)} por ciento`}
                  >
                    <span className="bar-label">
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      {item.label}
                    </span>
                    <span className="bar-track">
                      <span
                        className="bar-fill"
                        style={{ width: `${Math.max(8, (item.value / maxValue) * 100)}%` }}
                      />
                    </span>
                    <strong>{formatNumber(item.value)}%</strong>
                  </button>
                ))}
              </div>

              <div className="selected-evidence" aria-live="polite">
                <div className="evidence-number">{formatNumber(selected.value)}%</div>
                <div>
                  <strong>{selected.label}</strong>
                  <p>{selected.detail}</p>
                </div>
              </div>
            </section>

            <aside className="reading-panel">
              <p className="reading-kicker">Antes de responder</p>
              <div className="reading-block">
                <span>01</span>
                <div>
                  <strong>Lee la unidad</strong>
                  <p>{active.unit}. {active.denominator}</p>
                </div>
              </div>
              <div className="reading-block">
                <span>02</span>
                <div>
                  <strong>Compara</strong>
                  <p>{active.insightPrompt}</p>
                </div>
              </div>
              <div className="reading-block">
                <span>03</span>
                <div>
                  <strong>Reconoce un límite</strong>
                  <p>{active.caveat}</p>
                </div>
              </div>
            </aside>
          </div>
        </article>

        <section className="response-lab">
          <div className="response-heading">
            <div>
              <p className="eyebrow">Mesa de trabajo</p>
              <h2>Construye una respuesta con evidencia</h2>
            </div>
            <span className="autosave"><i /> Guardado automático</span>
          </div>

          <div className="response-grid">
            {([
              ["finding", "1. Hallazgo principal", "¿Qué patrón encontraste?"],
              ["evidence", "2. Evidencia", "Incluye cifras, unidad y comparación."],
              ["interpretation", "3. Interpretación", "¿Qué podría significar el resultado?"],
              ["limitation", "4. Limitación", "¿Qué no permite concluir este dato?"],
            ] as [keyof Answer, string, string][]).map(([field, label, placeholder]) => (
              <label className="answer-field" key={field}>
                <span>{label}</span>
                <textarea
                  value={answers[active.id][field]}
                  onChange={(event) => updateAnswer(field, event.target.value)}
                  placeholder={placeholder}
                  rows={3}
                />
              </label>
            ))}
          </div>

          <div className="response-actions">
            <button type="button" className="copy-button" onClick={copyAnswer}>
              {copyState}
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={() =>
                setAnswers((current) => ({
                  ...current,
                  [active.id]: { ...EMPTY_ANSWER },
                }))
              }
            >
              Limpiar este grupo
            </button>
          </div>
        </section>
      </section>

      <section className="method-strip">
        <div>
          <p className="eyebrow">Una precaución importante</p>
          <h2>Una fila de la encuesta no equivale a una empresa del país.</h2>
        </div>
        <p>
          La ENI utiliza una muestra y factores de expansión. Por eso el explorador
          presenta indicadores agregados y no simples conteos de registros.
        </p>
      </section>

      <footer>
        <div>
          <strong>Explorador educativo ENI</strong>
          <p>Prototipo para discusión y validación docente.</p>
        </div>
        <div className="footer-links">
          <a href="https://www.ine.gob.cl/estadisticas-por-tema/ciencia-y-tecnologia/encuesta-nacional-de-innovacion-en-empresas" target="_blank" rel="noreferrer">
            Página oficial INE ↗
          </a>
          <a href="https://www.dipres.gob.cl/597/articles-383532_doc_pdf1.pdf" target="_blank" rel="noreferrer">
            Referencia pública 2021–2022 ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
