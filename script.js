// script.js

let passagesData = [];  // store JSON globally

function splitWords(text, { removePunctuation = true, preserveApostrophes = true } = {}) {
  const t = text.trim();
  if (t === '') return [];
  let tokens = t.split(/\s+/);

  if (removePunctuation) {
    if (preserveApostrophes) {
      tokens = tokens.map(w => w.replace(/[^\p{L}\p{N}'’]+/gu, ''));
    } else {
      tokens = tokens.map(w => w.replace(/[^\p{L}\p{N}]+/gu, ''));
    }
  }

  return tokens.map(w => w.trim()).filter(w => w.length > 0);
}
    // Fetch the JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      passagesData = data.passages; // store globally
      const select = document.getElementById('passageSelect');
      data.passages.forEach((passage, index) => {
        const option = document.createElement('option');
        option.value = index; 
        option.textContent = passage.name;
        select.appendChild(option);
      });
    });

  const select = document.getElementById('passageSelect');
  const passageInput = document.getElementById('passageInput');

  select.addEventListener('change', () => {
    const index = select.value;
    if (index !== "") {
      const passage = passagesData[index].text; // get text from stored JSON
      passageInput.value = passage;              // update the input/textarea
    } else {
      passageInput.value = "";                   // clear if nothing selected
    }
  });


  function pickRandomWords(words, count, allowRepeat = false) {
    const result = [];
    const n = words.length;
    if (n === 0) return result;
  
    if (allowRepeat) {
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * n);
        result.push(words[idx]);
      }
    } else {
      const copy = words.slice();
      // If count > copy.length, we’ll just pick all
      const limit = Math.min(count, copy.length);
      for (let i = 0; i < limit; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
      }
    }
    return result;
  }
  
  document.getElementById('runButton').addEventListener('click', () => {
    const passage = document.getElementById('passageInput').value;
    const count = parseInt(document.getElementById('countInput').value, 10) || 0;
    const words = splitWords(passage);
    const selected = pickRandomWords(words, count, false);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = selected.map(w => `<div class="word">${w}</div>`).join(' ');
  });
//rewrite passage with highlighted words
function highlightWordsInPassage(words, selectedWords) {
  return words
    .map(w => {
      if (selectedWords.includes(w)) {
        return `<span class="highlight">${w}</span>`;
      }
      return w;
    })
    .join(" ");
}
//button click handler  
document.getElementById('runButton').addEventListener('click', () => {
  const passage = document.getElementById('passageInput').value;
  const count = parseInt(document.getElementById('countInput').value, 10) || 0;
  const highlight = document.getElementById('highlightToggle').checked;

  const words = splitWords(passage);
  const selected = pickRandomWords(words, count, false);

  // Display selected words as list
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = selected.map(w => `<span class="word">${w}</span>`).join(' ');

  // Display passage with or without highlight
  const passageDisplay = document.getElementById('passageDisplay');

  if (highlight) {
    passageDisplay.innerHTML = highlightWordsInPassage(words, selected);
  } else {
    passageDisplay.textContent = passage;   // plain text, no HTML
  }
});

