// URL of the raw JSON file in the GitHub repository
// Example: English KJV translation
const BIBLE_JSON_URL = "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/kjv.json";

const searchInput = document.getElementById("search");
const versesContainer = document.getElementById("verses");

let bibleData = [];

// Fetch Bible JSON data from GitHub
async function fetchBibleData() {
  try {
    const response = await fetch(BIBLE_JSON_URL);
    if (!response.ok) throw new Error("Failed to fetch Bible data");
    bibleData = await response.json();
    displayVerses(bibleData);
  } catch (error) {
    versesContainer.innerHTML = `<p class="text-red-600">Error loading Bible data: ${error.message}</p>`;
    console.error(error);
  }
}

// Display verses
function displayVerses(data) {
  versesContainer.innerHTML = data.length
    ? data.map((verse) => `
        <div class="verse-card p-4 mb-4 rounded shadow-sm bg-cream border border-gold">
          <p class="font-semibold text-gold">${verse.book} ${verse.chapter}:${verse.verse}</p>
          <p class="text-green mt-1">${verse.text}</p>
        </div>
      `).join("")
    : `<p class="text-green/70">No verses found.</p>`;
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = bibleData.filter(
    (verse) =>
      verse.text.toLowerCase().includes(query) ||
      verse.book.toLowerCase().includes(query)
  );
  displayVerses(filtered);
});

// Initialize
fetchBibleData();
