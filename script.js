const versesContainer = document.getElementById('verses');
const searchInput = document.getElementById('search');
const translationSelect = document.getElementById('translation');

let bibleData = [];

// Function to fetch JSON translation from GitHub
function loadTranslation(translation) {
  const url = `https://raw.githubusercontent.com/scrollmapper/bible_databases/master/bibles/${translation}.json`;
  versesContainer.innerHTML = '<p class="text-green-900/70">Loading Bible...</p>';

  fetch(url)
    .then(res => res.json())
    .then(data => {
      bibleData = data;
      renderVerses(bibleData);
    })
    .catch(err => {
      versesContainer.innerHTML = '<p class="text-red-600">Failed to load Bible data.</p>';
      console.error(err);
    });
}

// Render verses on page
function renderVerses(data) {
  versesContainer.innerHTML = '';
  if (!data || data.length === 0) {
    versesContainer.innerHTML = '<p class="text-green-900/70">No verses found.</p>';
    return;
  }

  data.forEach(verse => {
    const verseEl = document.createElement('div');
    verseEl.className = 'p-4 border border-gold rounded shadow-sm bg-cream';
    verseEl.innerHTML = `
      <p class="font-semibold text-gold">${verse.book} ${verse.chapter}:${verse.verse}</p>
      <p class="text-green-900 mt-1">${verse.text}</p>
    `;
    versesContainer.appendChild(verseEl);
  });
}

// Filter verses on search input
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = bibleData.filter(v =>
    v.text.toLowerCase().includes(query) ||
    v.book.toLowerCase().includes(query)
  );
  renderVerses(filtered);
});

// Change translation dynamically
translationSelect.addEventListener('change', () => {
  const selected = translationSelect.value;
  loadTranslation(selected);
});

// Load default translation (KJV)
loadTranslation('kjv');
