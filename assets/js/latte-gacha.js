// use Math.random for simple gacha randomness (not cryptographically secure)
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
const gachaButton = document.querySelector(".gacha__button");
const gachaResult = document.querySelector(".gacha__result");
const gachaDescription = document.querySelector(".gacha__desc");

// run only when all required elements exist
if (gachaButton && gachaResult && gachaDescription) {
  // manage spin configuration
  const initialDelay = 40;
  const delayStep = 10;
  const maxSpinCount = 20;

  // manage spin state and final result
  let gachaDelay = initialDelay;
  let gachaCount = 0;
  let finalPick = null;

  // pick a random latte from the list
  const pickRandomLatte = () => {
    const index = Math.floor(Math.random() * lattes.length);
    return lattes[index];
  };

  // reset spin state before each run
  const resetSpinState = () => {
    gachaDelay = initialDelay;
    gachaCount = 0;
  };

  // run spin animation with increasing delay
  const gachaSpin = () => {
    setTimeout(() => {
      const spinPick = pickRandomLatte();

      // update ui during spin
      gachaResult.textContent = `${spinPick.name} ...`;
      gachaDescription.textContent = "고민 중 ...";

      // slow down spin over time
      gachaDelay += delayStep;
      gachaCount += 1;

      if (gachaCount < maxSpinCount) {
        gachaSpin();
        return;
      }

      // finalize result
      gachaResult.textContent = finalPick.name;
      gachaDescription.textContent = finalPick.description;
      gachaButton.textContent = "한번 더 뽑기";
      gachaButton.disabled = false;

      resetSpinState();
    }, gachaDelay);
  };

  // handle click to start gacha flow
  gachaButton.addEventListener("click", () => {
    // prevent execution if data is invalid or empty
    if (lattes.length === 0) {
      gachaResult.textContent = "준비 중 ...";
      gachaDescription.textContent = "아직 라떼가 준비되지 않았습니다 ...";
      return;
    }

    // disable button to avoid multiple triggers
    gachaButton.disabled = true;

    resetSpinState();

    // update button text during spin
    gachaButton.textContent = "라떼 내리는 중...";

    // preselect final result before animation
    finalPick = pickRandomLatte();

    gachaSpin();
  });
}