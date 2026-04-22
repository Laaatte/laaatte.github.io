// use Math.random for simple gacha randomness (not cryptographically secure)
// load latte data from json script
const raw = document.getElementById("latte-data")?.textContent || "[]";
const lattes = JSON.parse(raw);

// cache dom elements for gacha ui
const gachaBtn = document.querySelector(".gacha__action_btn");
const gachaResult = document.querySelector(".gacha__result");
const gachaDesc = document.querySelector(".gacha__desc");

// manage spin state and final result
let gachaDelay = 40;
let gachaCount = 0;
let finalPick = null;

// run spin animation with increasing delay
function gachaSpin() {
  setTimeout(() => {
    // pick random latte for spin display
    const spinIndex = Math.floor(Math.random() * lattes.length);
    const spinPick = lattes[spinIndex];

    gachaResult.classList.add("spinning");
    gachaResult.textContent = spinPick.name + " ...";
    gachaDesc.classList.add("spinning");
    gachaDesc.textContent = "고민 중 ...";

    // slow down spin over time
    gachaDelay += 10;

    // track spin iterations
    gachaCount += 1;

    // continue or finish spin
    if (gachaCount < 20) {
      gachaSpin();
    } else {
      // initialize after completion
      gachaResult.classList.remove("spinning");
      gachaResult.textContent = finalPick.name;
      gachaDesc.classList.remove("spinning");
      gachaDesc.textContent = finalPick.description;
      gachaBtn.textContent = "한번 더 뽑기";
      gachaBtn.disabled = false;
      gachaDelay = 40;
      gachaCount = 0;
    }
  }, gachaDelay);
}

// handle click to start gacha flow
gachaBtn.addEventListener("click", () => {
  // prevent execution if data is invalid or empty
  if (!Array.isArray(lattes) || lattes.length === 0) {
    gachaResult.textContent = "준비 중 ...";
    gachaDesc.textContent = "아직 라떼가 준비되지 않았습니다 ...";
    return;
  }

  // disable button to avoid multiple triggers
  gachaBtn.disabled = true;

  // reset spin state before starting
  gachaDelay = 40;
  gachaCount = 0;

  // update button text during spin
  gachaBtn.textContent = "라떼 내리는 중...";

  // preselect final result before animation
  const finalIndex = Math.floor(Math.random() * lattes.length);
  finalPick = lattes[finalIndex];

  // start spin animation
  gachaSpin();
});