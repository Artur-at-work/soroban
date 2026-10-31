---
layout: default
title: Practice
nav_order: 3
---

# Practice

Choose a move family, solve the problem, then check your answer. Keep the soroban board nearby and make every move before submitting.

<section class="practice-panel" data-drills>
  <label for="drill-level">Move family</label>
  <select id="drill-level">
    <option value="direct-add">Direct addition</option>
    <option value="direct-sub">Direct subtraction</option>
    <option value="five-add">5-friends addition</option>
    <option value="five-sub">5-friends subtraction</option>
    <option value="ten-add">10-friends addition</option>
    <option value="ten-sub">10-friends subtraction</option>
  </select>
  <button class="btn btn-primary" type="button" data-new-problem>New problem</button>
  <p class="drill-problem" data-problem aria-live="polite">Choose a move family and start.</p>
  <form data-answer-form>
    <label for="drill-answer">Your answer</label>
    <input id="drill-answer" name="answer" type="number" inputmode="numeric" required>
    <button class="btn" type="submit">Check</button>
  </form>
  <p data-feedback aria-live="polite"></p>
  <p class="drill-score">Correct: <span data-score>0</span></p>
</section>

{% include soroban.html rods=3 value=0 label="Use the board to work it out" %}

<script src="{{ '/assets/js/drills.js' | relative_url }}" defer></script>