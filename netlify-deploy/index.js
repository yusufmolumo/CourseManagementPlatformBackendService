// Global variables
let currentLanguage = 'en';
let answers = {
  answer1: '',
  answer2: '',
  answer3: ''
};

// Language switching function
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  updateContent(lang);
  updateLanguageButtons(lang);
  
  // Save current answers before switching
  saveAnswers();
  
  // Restore answers in new language
  setTimeout(() => {
    restoreAnswers();
  }, 100);
}

// Update language button states
function updateLanguageButtons(lang) {
  // Remove active class from all buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to current language button
  document.getElementById(`${lang}-btn`).classList.add('active');
}

// Update page content based on language
function updateContent(lang) {
  const t = translations[lang] || translations['en'];
  
  // Update text content
  document.getElementById('title').textContent = t.title;
  document.getElementById('greeting').textContent = t.greeting;
  document.getElementById('q1').textContent = t.q1;
  document.getElementById('q2').textContent = t.q2;
  document.getElementById('q3').textContent = t.q3;
  document.getElementById('submitBtn').textContent = t.submit;
  document.getElementById('clearBtn').textContent = t.clear;
  document.getElementById('languageLabel').textContent = t.languageLabel;
  
  // Update placeholders
  document.getElementById('answer1').placeholder = t.placeholder1;
  document.getElementById('answer2').placeholder = t.placeholder2;
  document.getElementById('answer3').placeholder = t.placeholder3;
}

// Save answers to localStorage
function saveAnswers() {
  answers = {
    answer1: document.getElementById('answer1').value,
    answer2: document.getElementById('answer2').value,
    answer3: document.getElementById('answer3').value
  };
  localStorage.setItem('reflectionAnswers', JSON.stringify(answers));
}

// Restore answers from localStorage
function restoreAnswers() {
  const savedAnswers = localStorage.getItem('reflectionAnswers');
  if (savedAnswers) {
    answers = JSON.parse(savedAnswers);
    document.getElementById('answer1').value = answers.answer1 || '';
    document.getElementById('answer2').value = answers.answer2 || '';
    document.getElementById('answer3').value = answers.answer3 || '';
  }
}

// Show message function
function showMessage(message, type = 'success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  
  const answer1 = document.getElementById('answer1').value.trim();
  const answer2 = document.getElementById('answer2').value.trim();
  const answer3 = document.getElementById('answer3').value.trim();
  
  // Check if at least one answer is provided
  if (!answer1 && !answer2 && !answer3) {
    showMessage('Please provide at least one answer before submitting.', 'error');
    return;
  }
  
  // Here you would typically send the data to a server
  // For now, we'll just show a success message
  const t = translations[currentLanguage];
  showMessage(t.submitted, 'success');
  
  // Clear form after successful submission
  clearForm();
}

// Handle clear button
function handleClear() {
  const t = translations[currentLanguage];
  if (confirm(t.clearConfirm)) {
    clearForm();
    showMessage('Answers cleared successfully.', 'success');
  }
}

// Clear form function
function clearForm() {
  document.getElementById('answer1').value = '';
  document.getElementById('answer2').value = '';
  document.getElementById('answer3').value = '';
  
  // Clear localStorage
  localStorage.removeItem('reflectionAnswers');
  answers = { answer1: '', answer2: '', answer3: '' };
}

// Initialize the page
function init() {
  // Detect language
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.language;
  
  // Determine initial language
  let lang = 'en'; // default
  if (savedLang) {
    lang = savedLang;
  } else if (browserLang.startsWith('fr')) {
    lang = 'fr';
  } else if (browserLang.startsWith('es')) {
    lang = 'es';
  }
  
  // Set initial language
  setLanguage(lang);
  
  // Restore saved answers
  restoreAnswers();
  
  // Add event listeners
  document.getElementById('reflectionForm').addEventListener('submit', handleSubmit);
  document.getElementById('clearBtn').addEventListener('click', handleClear);
  
  // Auto-save answers when user types
  document.getElementById('answer1').addEventListener('input', saveAnswers);
  document.getElementById('answer2').addEventListener('input', saveAnswers);
  document.getElementById('answer3').addEventListener('input', saveAnswers);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 