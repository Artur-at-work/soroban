(function () {
  "use strict";

  const generators = {
    "direct-add": () => {
      const start = Math.floor(Math.random() * 4);
      const amount = 1 + Math.floor(Math.random() * (4 - start));
      return [start, amount, "+"];
    },
    "direct-sub": () => {
      const availableStarts = [1, 2, 3, 4, 6, 7, 8, 9];
      const start = availableStarts[Math.floor(Math.random() * availableStarts.length)];
      const amount = 1 + Math.floor(Math.random() * (start % 5));
      return [start, amount, "−"];
    },
    "five-add": () => {
      const start = 1 + Math.floor(Math.random() * 4);
      const amount = 5 - (start % 5) + Math.floor(Math.random() * (start || 1));
      return [start, amount, "+"];
    },
    "five-sub": () => {
      const start = 5 + Math.floor(Math.random() * 4);
      const amount = start % 5 + 1 + Math.floor(Math.random() * (4 - (start % 5)));
      return [start, amount, "−"];
    },
    "ten-add": () => {
      const start = 1 + Math.floor(Math.random() * 9);
      const amount = 10 - start + Math.floor(Math.random() * start);
      return [start, amount, "+"];
    },
    "ten-sub": () => {
      const tens = 1 + Math.floor(Math.random() * 8);
      const ones = Math.floor(Math.random() * 9);
      const amount = ones + 1 + Math.floor(Math.random() * (9 - ones));
      return [tens * 10 + ones, amount, "−"];
    }
  };

  function initialize(panel) {
    const level = panel.querySelector("#drill-level");
    const problem = panel.querySelector("[data-problem]");
    const feedback = panel.querySelector("[data-feedback]");
    const form = panel.querySelector("[data-answer-form]");
    const answer = panel.querySelector("[name=answer]");
    const scoreOutput = panel.querySelector("[data-score]");
    let expected = null;
    let score = 0;

    function nextProblem() {
      const [start, amount, operator] = generators[level.value]();
      expected = operator === "+" ? start + amount : start - amount;
      problem.textContent = `${start} ${operator} ${amount} = ?`;
      answer.value = "";
      feedback.textContent = "";
      answer.focus();
    }

    panel.querySelector("[data-new-problem]").addEventListener("click", nextProblem);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (expected === null) {
        feedback.textContent = "Start a problem first.";
        return;
      }
      if (Number(answer.value) === expected) {
        score += 1;
        scoreOutput.textContent = String(score);
        feedback.textContent = "Correct. Try another.";
        expected = null;
      } else {
        feedback.textContent = "Not quite. Move the beads and try again.";
      }
    });
    level.addEventListener("change", () => {
      expected = null;
      problem.textContent = "Choose a move family and start.";
      feedback.textContent = "";
    });
  }

  document.querySelectorAll("[data-drills]").forEach(initialize);
})();