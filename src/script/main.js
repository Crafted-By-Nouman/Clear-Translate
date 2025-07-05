import { countries } from "./data/countries.js";
import {
  textToSpeech,
  copyToClipboard,
  triggerShakeAnimation,
  toggleTheme,
  autoDetectDarkMode,
  handleSpeechRecognition,
} from "./utils/utils.js";

const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const swapBtn = document.querySelector(".swap-btn");
const selectTags = document.querySelectorAll("select");
const translateBtn = document.querySelector(".translate-btn");
const micBtn = document.querySelector(".mic-btn");
const themeToggle = document.querySelector(".theme-toggle");
const loadingSpinner = document.querySelector(".loading");
const copyFromBtn = document.querySelector("#copyFrom");
const copyToBtn = document.querySelector("#copyTo");
const speakFromBtn = document.querySelector("#speakFrom");
const speakToBtn = document.querySelector("#speakTo");

// Populate Language Dropdowns
selectTags.forEach((tag, id) => {
  for (let code in countries) {
    const selected =
      (id === 0 && code === "en-GB") || (id === 1 && code === "ur-PK")
        ? "selected"
        : "";
    tag.insertAdjacentHTML(
      "beforeend",
      `<option ${selected} value="${code}">${countries[code]}</option>`
    );
  }
});

// Swap Languages and Text
swapBtn.addEventListener("click", () => {
  const tempText = fromText.value;
  const tempLang = selectTags[0].value;

  swapBtn.classList.add("pulse");
  setTimeout(() => swapBtn.classList.remove("pulse"), 1000);

  fromText.value = toText.textContent;
  toText.textContent = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Translate Text
translateBtn.addEventListener("click", () => {
  const text = fromText.value.trim();
  const fromLang = selectTags[0].value;
  const toLang = selectTags[1].value;

  if (!text) {
    triggerShakeAnimation(fromText);
    return;
  }

  loadingSpinner.style.display = "block";
  toText.textContent = "";

  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${fromLang}|${toLang}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      loadingSpinner.style.display = "none";
      if (data.responseData) {
        toText.textContent = data.responseData.translatedText;
        toText.style.animation = "glow 1.5s";
        setTimeout(() => (toText.style.animation = ""), 1500);
      } else {
        toText.textContent = "Translation failed. Please try again.";
      }
    })
    .catch((err) => {
      loadingSpinner.style.display = "none";
      toText.textContent = "Error occurred. Please check your connection.";
      console.error(err);
    });
});

// Speak Text
speakFromBtn.addEventListener("click", () =>
  textToSpeech(fromText.value, selectTags[0].value)
);
speakToBtn.addEventListener("click", () =>
  textToSpeech(toText.textContent, selectTags[1].value)
);

// Copy Buttons
copyFromBtn.addEventListener("click", (e) =>
  copyToClipboard(fromText.value, e)
);
copyToBtn.addEventListener("click", (e) =>
  copyToClipboard(toText.textContent, e)
);

// Microphone (Speech to Text)
micBtn.addEventListener("click", () => {
  handleSpeechRecognition(
    selectTags[0].value,
    (transcript) => {
      fromText.value = transcript;
      if (transcript.trim()) translateBtn.click();
    },
    null,
    micBtn
  );
});

// Theme Toggle
themeToggle.addEventListener("click", () => toggleTheme(themeToggle));
autoDetectDarkMode(themeToggle);
