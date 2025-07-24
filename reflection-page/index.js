function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  updateContent(lang);
}

function updateContent(lang) {
  const t = translations[lang] || translations['en'];
  document.getElementById('title').textContent = t.title;
  document.getElementById('greeting').textContent = t.greeting;
  document.getElementById('q1').textContent = t.q1;
  document.getElementById('q2').textContent = t.q2;
  document.getElementById('q3').textContent = t.q3;
}

// Detect language
const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
const lang = savedLang || browserLang;
updateContent(lang); 