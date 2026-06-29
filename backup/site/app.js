(function () {
  const data = window.ehrData;
  const missing = "—";
  const charts = [];

  const colors = {
    green: "#2f6f5e",
    red: "#9a3c3c",
    amber: "#7a4f12",
    blue: "#3f6688",
    violet: "#6b5b95",
    gray: "#6f767a",
    grid: "#d8dddf"
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function valueOrMissing(value, decimals) {
    if (value === null || value === undefined || value === "") return missing;
    if (typeof value === "number") {
      return decimals === undefined ? String(value) : value.toFixed(decimals);
    }
    if (value === "-") return missing;
    return String(value);
  }

  function dataset(rows, key) {
    return rows.map((row) => row[key]);
  }

  function renderSnapshot() {
    byId("patient-alias").textContent = "Also documented as " + data.patient.alias;
    byId("patient-age").textContent = data.patient.ageSex;
    byId("patient-diagnosis").textContent = data.patient.diagnosis + " diagnosed " + data.patient.diagnosisDate;
    byId("patient-status").textContent = data.patient.currentStatus;

    const labRoot = byId("latest-labs");
    data.patient.latestLabs.forEach((item) => {
      const chip = el("div", "lab-chip");
      chip.dataset.tone = item.tone;
      chip.appendChild(el("b", "", item.label));
      chip.appendChild(el("span", "", item.value));
      labRoot.appendChild(chip);
    });
  }

  function renderOverview() {
    const summary = byId("summary-list");
    data.overview.summary.forEach((text) => summary.appendChild(el("p", "", text)));

    const concerns = byId("concerns-list");
    data.patient.activeConcerns.forEach((text) => concerns.appendChild(el("p", "concern", text)));

    const tbody = byId("treatment-table");
    data.overview.treatment.forEach((row) => {
      const tr = document.createElement("tr");
      tr.appendChild(el("td", "", row.period));
      tr.appendChild(el("td", "", row.regimen));
      tr.appendChild(el("td", "", row.outcome));
      tbody.appendChild(tr);
    });
  }

  function renderTimeline() {
    const root = byId("timeline-list");
    data.timeline.forEach((item) => {
      const article = el("article", "timeline-item");
      article.appendChild(el("div", "timeline-date", item.date));

      const body = el("div", "timeline-body");
      body.appendChild(el("h3", "", item.title));
      body.appendChild(el("p", "", item.summary));
      body.appendChild(el("p", "timeline-significance", item.significance));
      body.appendChild(el("p", "source", "Source: " + item.source));
      article.appendChild(body);

      root.appendChild(article);
    });
  }

  function markerTone(key, value) {
    if (value === null || value === undefined) return "";
    if (key === "ratio" && value > 1.65) return "value-high";
    if (key === "kappa" && value > 19.4) return "value-high";
    if (key === "creatinine" && value > 1.3) return "value-high";
    if (key === "egfr" && value < 45) return "value-high";
    if (key === "hemoglobin" && value < 13) return "value-watch";
    if (key === "platelets" && value < 150) return "value-watch";
    if (key === "anc" && value < 2) return "value-watch";
    if (key === "calcium" && value > 10.2) return "value-high";
    if (key === "potassium" && value > 5.1) return "value-high";
    return "";
  }

  function renderMarkerTable() {
    const tbody = byId("marker-table");
    data.markerRows.forEach((row) => {
      const tr = document.createElement("tr");
      const cells = [
        { key: "label", value: row.label, className: "sticky-col" },
        { key: "phase", value: row.phase, className: "sticky-col sticky-col--phase" },
        { key: "kappa", value: valueOrMissing(row.kappa, 2) },
        { key: "lambda", value: valueOrMissing(row.lambda, 2) },
        { key: "ratio", value: valueOrMissing(row.ratio, 3) },
        { key: "mSpike", value: row.mSpikeText ? valueOrMissing(row.mSpikeText) : valueOrMissing(row.mSpike, 2) },
        { key: "igG", value: valueOrMissing(row.igG, 0) },
        { key: "beta2m", value: valueOrMissing(row.beta2m, 0) },
        { key: "creatinine", value: valueOrMissing(row.creatinine, 2) },
        { key: "egfr", value: valueOrMissing(row.egfr, row.egfr && row.egfr % 1 ? 2 : 0) },
        { key: "hemoglobin", value: valueOrMissing(row.hemoglobin, 2) },
        { key: "platelets", value: valueOrMissing(row.platelets, 0) },
        { key: "anc", value: valueOrMissing(row.anc, 2) },
        { key: "calcium", value: valueOrMissing(row.calcium, 2) },
        { key: "potassium", value: valueOrMissing(row.potassium, 2) },
        { key: "note", value: row.note }
      ];

      cells.forEach((cell) => {
        const td = el("td", cell.className || markerTone(cell.key, row[cell.key]), cell.value);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderFindings() {
    const root = byId("findings-list");
    data.findings.forEach((finding) => {
      const card = el("article", "finding-card");
      card.appendChild(el("h3", "", finding.title));
      const list = document.createElement("ul");
      finding.items.forEach((item) => list.appendChild(el("li", "", item)));
      card.appendChild(list);
      card.appendChild(el("p", "source", "Source: " + finding.source));
      root.appendChild(card);
    });
  }

  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll(".tab"));
    tabs.forEach((tab, index) => {
      tab.id = tab.dataset.tab + "-tab";
      tab.addEventListener("click", () => activateTab(tab.dataset.tab));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const next = tabs[(index + offset + tabs.length) % tabs.length];
        next.focus();
        activateTab(next.dataset.tab);
      });
    });

    const hash = window.location.hash.replace("#", "");
    if (hash && byId(hash)) activateTab(hash);
  }

  function activateTab(id) {
    document.querySelectorAll(".tab").forEach((tab) => {
      const isActive = tab.dataset.tab === id;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      const isActive = panel.id === id;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
    if (id === "markers") {
      requestAnimationFrame(() => charts.forEach((chart) => chart.resize()));
    }
    history.replaceState(null, "", "#" + id);
  }

  function annotationOptions() {
    const result = {};
    data.chartAnnotations.forEach((annotation, index) => {
      result["event" + index] = {
        type: "line",
        xMin: annotation.x,
        xMax: annotation.x,
        borderColor: annotation.color,
        borderWidth: 1,
        borderDash: [4, 4],
        label: {
          display: true,
          content: annotation.label,
          color: annotation.color,
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          borderColor: annotation.color,
          borderWidth: 1,
          borderRadius: 4,
          padding: 4,
          position: "start",
          rotation: -90,
          font: { size: 10, weight: "700" }
        }
      };
    });
    return result;
  }

  function baseOptions(yAxes, annotationDisplay) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.raw === null || ctx.raw === undefined ? missing : ctx.formattedValue;
              return ctx.dataset.label + ": " + value;
            }
          }
        },
        annotation: {
          annotations: annotationDisplay ? annotationOptions() : {}
        }
      },
      scales: Object.assign(
        {
          x: {
            grid: { color: "rgba(216, 221, 223, 0.5)" },
            ticks: { maxRotation: 60, minRotation: 0, autoSkip: false, font: { size: 11 } }
          }
        },
        yAxes
      )
    };
  }

  function line(label, key, color, axis, rows) {
    return {
      label,
      data: dataset(rows, key),
      yAxisID: axis,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      spanGaps: false,
      tension: 0.2
    };
  }

  function lineFromValues(label, values, color, axis) {
    return {
      label,
      data: values,
      yAxisID: axis,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      spanGaps: false,
      tension: 0.2
    };
  }

  function makeChart(id, datasets, yAxes) {
    const rows = data.markerRows;
    const chart = new Chart(byId(id), {
      type: "line",
      data: {
        labels: rows.map((row) => row.label),
        datasets
      },
      options: baseOptions(yAxes, true)
    });
    charts.push(chart);
  }

  function renderCharts() {
    const rows = data.markerRows;

    makeChart(
      "chart-disease",
      [
        line("Kappa FLC mg/L", "kappa", colors.red, "y", rows),
        line("K/L ratio", "ratio", colors.blue, "y1", rows)
      ],
      {
        y: {
          position: "left",
          type: "logarithmic",
          min: 1,
          title: { display: true, text: "Kappa mg/L (log)" },
          grid: { color: colors.grid }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "Ratio" },
          grid: { drawOnChartArea: false }
        }
      }
    );

    makeChart(
      "chart-monoclonal",
      [
        line("M-spike g/dL", "mSpike", colors.amber, "y", rows),
        line("IgG mg/dL", "igG", colors.green, "y1", rows),
        lineFromValues(
          "B2M x1000 ng/mL",
          rows.map((row) => (row.beta2m === null || row.beta2m === undefined ? null : row.beta2m / 1000)),
          colors.violet,
          "y"
        )
      ],
      {
        y: {
          position: "left",
          beginAtZero: true,
          title: { display: true, text: "M-spike / B2M x1000" },
          grid: { color: colors.grid }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "IgG mg/dL" },
          grid: { drawOnChartArea: false }
        }
      }
    );

    makeChart(
      "chart-renal",
      [
        line("Creatinine mg/dL", "creatinine", colors.red, "y", rows),
        line("eGFR mL/min/1.73m2", "egfr", colors.green, "y1", rows)
      ],
      {
        y: {
          position: "left",
          beginAtZero: true,
          title: { display: true, text: "Creatinine mg/dL" },
          grid: { color: colors.grid }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "eGFR" },
          grid: { drawOnChartArea: false }
        }
      }
    );

    makeChart(
      "chart-counts",
      [
        line("Hemoglobin g/dL", "hemoglobin", colors.blue, "y", rows),
        line("Platelets x10^3/uL", "platelets", colors.violet, "y1", rows),
        line("ANC x10^3/uL", "anc", colors.red, "y", rows),
        line("Calcium mg/dL", "calcium", colors.amber, "y", rows)
      ],
      {
        y: {
          position: "left",
          beginAtZero: true,
          title: { display: true, text: "Hgb / ANC / Calcium" },
          grid: { color: colors.grid }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "Platelets" },
          grid: { drawOnChartArea: false }
        }
      }
    );
  }

  function init() {
    renderSnapshot();
    renderOverview();
    renderTimeline();
    renderMarkerTable();
    renderFindings();
    setupTabs();
    renderCharts();
  }

  if (!window.Chart) {
    document.body.prepend(el("p", "chart-error", "Chart library failed to load."));
    return;
  }

  init();
})();
