// Interactive demos. Each case study page includes only its own demo; each block runs only if its section is on the page.
(function () {
  function group(name, onPick, start) {
    var buttons = document.querySelectorAll('[data-group="' + name + '"] button');
    if (!buttons.length) return;
    function pick(btn) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      onPick(btn.getAttribute("data-v"));
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { pick(b); }); });
    pick(buttons[start || 0]);
  }

  // Summary tiles act as a second set of buttons for the same choice
  var trend = document.querySelectorAll(".trend button");
  trend.forEach(function (t) { t.addEventListener("click", function () {
    var target = document.querySelector('[data-group="' + t.getAttribute("data-group-link") + '"] button[data-v="' + t.getAttribute("data-v") + '"]');
    if (target) target.click();
  }); });
  function markTiles(groupName, v) {
    trend.forEach(function (t) {
      if (t.getAttribute("data-group-link") === groupName) t.setAttribute("aria-pressed", t.getAttribute("data-v") === v ? "true" : "false");
    });
  }

  // 1. Speed zones (share of pedestrian crashes that were fatal or serious)
  if (document.getElementById("speed")) {
    var people = document.getElementById("people");
    for (var i = 0; i < 100; i++) people.appendChild(document.createElement("span"));
    var dots = people.children;
    var speed = { 40: 41, 60: 54, 80: 65 };
    group("speed", function (v) {
      var n = speed[v];
      markTiles("speed", v);
      for (var i = 0; i < 100; i++) dots[i].classList.toggle("on", i < n);
      document.getElementById("speed-n").textContent = n;
      document.getElementById("speed-text").innerHTML =
        "In <strong>" + (v === "80" ? "80+" : v) + " km/h</strong> zones, about <strong>" + n + " of every 100</strong> pedestrian crashes killed or seriously injured someone.";
      document.getElementById("speed-delta").textContent =
        v === "40" ? "Lowest of the three zones" : "+" + (n - 41) + " more than in 40 km/h zones";
    });
  }

  // 2. Pharmacy coverage (villages within 5 km, of 511)
  if (document.getElementById("pharmacies")) {
    var ph = {
      0: [199, "The 27 participating pharmacies reach fewer than 4 in 10 villages. Mueang Nonthaburi is best served (72 villages); Sai Noi worst (8)."],
      5: [325, "Five new pharmacies in Bang Yai, Bang Bua Thong and Bang Kruai add 126 villages. Placement matters more than count."],
      22: [417, "Twenty-two additions spread across all six districts reach 417 villages, more than double today's coverage."]
    };
    group("ph", function (v) {
      var d = ph[v];
      markTiles("ph", v);
      document.getElementById("ph-n").textContent = d[0];
      document.getElementById("ph-fill").style.width = (d[0] / 511 * 100) + "%";
      document.getElementById("ph-bar").setAttribute("aria-label", d[0] + " of 511 villages within reach");
      document.getElementById("ph-text").textContent = d[1];
    });
  }

  // 3. Housing models
  if (document.getElementById("housing")) {
    var models = [
      { adds: "Trend, quarter and state", r2: 0.0823, adj: 0.0491, rmse: 2.633, mae: 2.031, text: "The baseline: time and place alone explain about 5% of the variation." },
      { adds: "+ Interest rate, inflation", r2: 0.1412, adj: 0.1019, rmse: 2.547, mae: 1.986, text: "Interest rates and inflation roughly double the explained share, and both error measures fall." },
      { adds: "+ Migration, household income", r2: 0.2387, adj: 0.1967, rmse: 2.398, mae: 1.862, text: "The biggest single jump in adjusted R²." },
      { adds: "+ COVID-19 period", r2: 0.2811, adj: 0.2378, rmse: 2.331, mae: 1.787, text: "The preferred model. The 2020–21 period adds 2.63 points of quarterly growth (p < 0.001), the largest single effect." },
      { adds: "+ Election period", r2: 0.2822, adj: 0.2354, rmse: 2.329, mae: 1.791, text: "Plain R² still rises, but adjusted R² falls and MAE gets worse. The election term is not significant (p = 0.568), so this model is rejected." }
    ];
    var wrap = document.getElementById("models");
    models.forEach(function (m, i) {
      var col = document.createElement("div");
      col.innerHTML = "<em>" + m.adj.toFixed(3) + "</em><b style=\"height:" + (m.adj / 0.26 * 100) + "%\"></b><span>M" + (i + 1) + "</span>";
      wrap.appendChild(col);
    });
    group("model", function (v) {
      var m = models[+v];
      Array.prototype.forEach.call(wrap.children, function (c, i) { c.classList.toggle("sel", i === +v); });
      document.getElementById("h-adds").textContent = m.adds;
      document.getElementById("h-adj").textContent = m.adj.toFixed(3);
      document.getElementById("h-r2").textContent = m.r2.toFixed(3);
      document.getElementById("h-rmse").textContent = m.rmse.toFixed(3);
      document.getElementById("h-mae").textContent = m.mae.toFixed(3);
      document.getElementById("h-text").textContent = m.text;
    }, 3);
  }

  // 4. Credit risk: accuracy against defaults caught (22,395 repaid, 6,183 defaulted)
  if (document.getElementById("credit")) {
    var GOOD = 22395, BAD = 6183;
    var caught = document.getElementById("c-caught");
    var flagged = document.getElementById("c-false");
    var pct = function (x) { return (x * 100).toFixed(1) + "%"; };
    var fmt = function (n) { return n.toLocaleString("en-AU"); };
    var credit = function () {
      var c = +caught.value, f = +flagged.value;
      var acc = (c + GOOD - f) / (GOOD + BAD);
      document.getElementById("c-caught-v").textContent = fmt(c);
      document.getElementById("c-false-v").textContent = fmt(f);
      document.getElementById("c-acc").textContent = pct(acc);
      document.getElementById("c-sens").textContent = pct(c / BAD);
      document.getElementById("c-spec").textContent = pct((GOOD - f) / GOOD);
      document.getElementById("c-miss").textContent = fmt(BAD - c);
      document.getElementById("c-text").textContent =
        c === 0 ? "High accuracy, yet every single default slips through. This is the trap."
        : f === GOOD ? "Every default is caught, but every good customer is turned away too."
        : acc < (GOOD / (GOOD + BAD)) ? "Lower accuracy than saying “repaid” to everyone, yet this model actually finds defaults."
        : "Better than the do-nothing model on both counts.";
    };
    var clearPick = function () {
      document.querySelectorAll('[data-group="credit"] button').forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    };
    caught.addEventListener("input", function () { clearPick(); credit(); });
    flagged.addEventListener("input", function () { clearPick(); credit(); });
    var presets = { none: [0, 0], all: [BAD, GOOD], half: [Math.round(BAD / 2), Math.round(GOOD / 10)] };
    group("credit", function (v) {
      caught.value = presets[v][0];
      flagged.value = presets[v][1];
      credit();
    });
  }
})();
