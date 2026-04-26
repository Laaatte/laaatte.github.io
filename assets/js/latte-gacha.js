// use Math.random for simple gacha randomness (not cryptographically secure)
// load latte data from json script
const raw = document.getElementById("latte-data")?.textContent || "[]";

let lattes = [];
try {
  lattes = JSON.parse(raw);
} catch (err) {
  lattes = [];
}

// ensure lattes is always an array
if (!Array.isArray(lattes)) {
  lattes = [];
}

// cache dom elements for gacha ui
const gachaBtn = document.querySelector(".gacha__action_btn");
const gachaResult = document.querySelector(".gacha__result");
const gachaDesc = document.querySelector(".gacha__desc");

// manage spin configuration
const initialDelay = 40;
const delayStep = 10;
const maxSpinCount = 20;

// manage spin state and final result
let gachaDelay = initialDelay;
let gachaCount = 0;
let finalPick = null;

// run spin animation with increasing delay
function gachaSpin() {
  setTimeout(() => {
    const spinIndex = Math.floor(Math.random() * lattes.length);
    const spinPick = lattes[spinIndex];

    // update ui during spin
    gachaResult.classList.add("spinning");
    gachaResult.textContent = spinPick.name + " ...";
    gachaDesc.classList.add("spinning");
    gachaDesc.textContent = "고민 중 ...";

    // slow down spin over time
    gachaDelay += delayStep;

    // track spin iterations
    gachaCount += 1;

    // continue or finish spin
    if (gachaCount < maxSpinCount) {
      gachaSpin();
    } else {
      // finalize result
      gachaResult.classList.remove("spinning");
      gachaResult.textContent = finalPick.name;
      gachaDesc.classList.remove("spinning");
      gachaDesc.textContent = finalPick.description;
      gachaBtn.textContent = "한번 더 뽑기";
      gachaBtn.disabled = false;

      // reset state
      gachaDelay = initialDelay;
      gachaCount = 0;
    }
  }, gachaDelay);
}

// handle click to start gacha flow
gachaBtn.addEventListener("click", () => {
  // prevent execution if data is invalid or empty
  if (lattes.length === 0) {
    gachaResult.textContent = "준비 중 ...";
    gachaDesc.textContent = "아직 라떼가 준비되지 않았습니다 ...";
    return;
  }

  // disable button to avoid multiple triggers
  gachaBtn.disabled = true;

  // reset spin state before starting
  gachaDelay = initialDelay;
  gachaCount = 0;

  // update button text during spin
  gachaBtn.textContent = "라떼 내리는 중...";

  // preselect final result before animation
  const finalIndex = Math.floor(Math.random() * lattes.length);
  finalPick = lattes[finalIndex];

  // start spin animation
  gachaSpin();
});