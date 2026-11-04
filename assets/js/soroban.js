(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  function svgElement(name, attributes) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function makeBead(rod, kind, index, x, y, active, label) {
    const bead = svgElement("circle", {
      cx: x,
      cy: y,
      r: kind === "heaven" ? 9 : 8,
      class: "soroban-bead",
      tabindex: "0",
      role: "button",
      "aria-label": label,
      "aria-pressed": String(active),
      "data-rod": rod,
      "data-kind": kind,
      "data-index": index
    });
    bead.addEventListener("click", () => toggleBead(bead));
    bead.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleBead(bead);
      }
    });
    return bead;
  }

  function toggleBead(bead) {
    const widget = bead.closest(".soroban-widget");
    const rod = Number(bead.dataset.rod);
    const state = widget._sorobanState;
    if (bead.dataset.kind === "heaven") {
      state[rod].heaven = !state[rod].heaven;
    } else {
      const index = Number(bead.dataset.index);
      state[rod].earth = bead.getAttribute("aria-pressed") === "true" ? index : index + 1;
    }
    render(widget);
  }

  function valueOf(state) {
    return state.reduce((value, digit) => value * 10 + digit.earth + (digit.heaven ? 5 : 0), 0);
  }

  function setValue(widget, value) {
    const state = widget._sorobanState;
    const limit = 10 ** state.length;
    let remaining = Math.max(0, Math.min(Number(value) || 0, limit - 1));
    for (let rod = state.length - 1; rod >= 0; rod -= 1) {
      const digit = remaining % 10;
      remaining = Math.floor(remaining / 10);
      state[rod] = { heaven: digit >= 5, earth: digit % 5 };
    }
    render(widget);
  }

  function render(widget) {
    const state = widget._sorobanState;
    const rods = state.length;
    const width = Math.max(300, rods * 62 + 36);
    const height = 280;
    const beamY = 112;
    const startX = (width - (rods - 1) * 62) / 2;
    const svg = svgElement("svg", {
      viewBox: `0 0 ${width} ${height}`,
      class: "soroban-svg",
      role: "group",
      "aria-label": widget.getAttribute("aria-label") || "Interactive soroban"
    });
    svg.appendChild(svgElement("rect", { x: 8, y: 8, width: width - 16, height: 250, rx: 5, class: "soroban-frame" }));
    svg.appendChild(svgElement("line", { x1: 12, y1: beamY, x2: width - 12, y2: beamY, class: "soroban-beam" }));

    for (let rod = 0; rod < rods; rod += 1) {
      const x = startX + rod * 62;
      const digit = state[rod];
      svg.appendChild(svgElement("line", { x1: x, y1: 20, x2: x, y2: 220, class: "soroban-rod" }));
      svg.appendChild(makeBead(rod, "heaven", 0, x, digit.heaven ? beamY - 15 : 39, digit.heaven, `Rod ${rods - rod}, upper bead, ${digit.heaven ? "active" : "inactive"}`));

      for (let index = 0; index < 4; index += 1) {
        const active = index < digit.earth;
        const y = active ? beamY + 18 + index * 14 : 166 + index * 14;
        svg.appendChild(makeBead(rod, "earth", index, x, y, active, `Rod ${rods - rod}, lower bead ${index + 1}, ${active ? "active" : "inactive"}`));
      }

      if (rod === rods - 1) {
        svg.appendChild(svgElement("circle", { cx: x, cy: 238, r: 3, class: "soroban-unit-dot" }));
      }
      const place = rods - rod - 1;
      svg.appendChild(svgElement("text", { x, y: 270, class: "soroban-column-label" })).textContent = place === 0 ? "ones" : `1${"0".repeat(place)}`;
    }

    svg.setAttribute("viewBox", `0 0 ${width} 280`);
    const canvas = widget.querySelector(".soroban-canvas");
    canvas.replaceChildren(svg);
    widget.querySelector(".soroban-readout").textContent = String(valueOf(state));
  }

  function initialize(widget) {
    const rods = Math.max(1, Math.min(12, Number(widget.dataset.rods) || 5));
    widget._sorobanState = Array.from({ length: rods }, () => ({ heaven: false, earth: 0 }));
    widget.querySelector(".soroban-clear").addEventListener("click", () => setValue(widget, 0));
    setValue(widget, widget.dataset.value);
  }

  document.querySelectorAll(".soroban-widget").forEach(initialize);
})();