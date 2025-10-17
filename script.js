// Mapping translation keys to raw GitHub JSON URLs
const TRANSLATION_URLS = {
  kjv: "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/kjv.json",
  web: "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/web.json",
  esv: "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/esv.json"
};

const searchInput = document.getElementById("search");
const translationSelect = document.getElementById("translation");
const versesContainer = document.getElementById("verses");

let bibleData = [];

// Fetch Bible JSON data from GitHub
async function fetchBibleData(translation) {
  versesContainer.innerHTML = `<p class="text-green-900/70">Loading ${translation.toUpperCase()}...</p>`;
  try {
    const url = TRANSLATION_URLS[translation];
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Bible data");
    bibleData = await response.json();
    displayVerses(bibleData);
  } catch (error) {
    versesContainer.innerHTML = `<p class="text-red-600">Error loading Bible data: ${error.message}</p>`;
    console.error(error);
  }
}

// Display verses in container
function displayVerses(data) {
  if (data.length === 0) {
    versesContainer.innerHTML = `<p class="text-green-900/70">No verses found.</p>`;
    return;
  }
  versesContainer.innerHTML = data.map((verse, index) => `
    <div class="verse-card p-4 mb-4 rounded shadow-sm bg-cream border border-gold">
      <p class="font-semibold text-gold">${verse.book} ${verse.chapter}:${verse.verse}</p>
      <p class="text-green-900 mt-1">${verse.text}</p>
    </div>
  `).join("");
}

// Search filtering
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = bibleData.filter(
    verse => verse.text.toLowerCase().includes(query) ||
             verse.book.toLowerCase().includes(query)
  );
  displayVerses(filtered);
});

// Change translation
translationSelect.addEventListener("change", (e) => {
  fetchBibleData(e.target.value);
});

// Initialize with default translation
fetchBibleData(translationSelect.value);
