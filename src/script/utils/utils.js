// utils.js

export function textToSpeech(text, lang) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}

export function copyToClipboard(text, event) {
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const tooltip = document.createElement("div");
    tooltip.textContent = "Copied!";
    tooltip.style.position = "absolute";
    tooltip.style.bottom = "60px";
    tooltip.style.right = "0";
    tooltip.style.background = "var(--dark)";
    tooltip.style.color = "var(--light)";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "0.8rem";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.3s";

    event.target.parentElement.appendChild(tooltip);

    setTimeout(() => (tooltip.style.opacity = "1"), 10);
    setTimeout(() => {
      tooltip.style.opacity = "0";
      setTimeout(() => tooltip.remove(), 300);
    }, 2000);
  });
}

export function triggerShakeAnimation(element) {
  element.style.animation = "shake 0.5s";
  setTimeout(() => {
    element.style.animation = "";
  }, 500);
}

export function toggleTheme(toggleBtn) {
  document.body.classList.toggle("dark-mode");
  toggleBtn.innerHTML = document.body.classList.contains("dark-mode")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

export function autoDetectDarkMode(toggleBtn) {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-mode");
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

export function handleSpeechRecognition(lang, onResult, onError, btn) {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in your browser");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = lang;
  recognition.interimResults = false;

  btn.classList.add("listening");

  recognition.onresult = (event) => {
    btn.classList.remove("listening");
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    btn.classList.remove("listening");
    if (onError) onError(event.error);
  };

  recognition.start();
}
