document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const translationSelect = document.getElementById("translation");
  const versesContainer = document.getElementById("verses");

  let bibleData = [];

  // Fetch Bible JSON data from your API
  async function fetchBibleData(translation) {
    if (!versesContainer) return; // safety check
    versesContainer.innerHTML = `<p class="text-green-900/70">Loading ${translation.toUpperCase()}...</p>`;
    try {
      const response = await fetch(`https://logia-api.onrender.com/bible?translation=${translation}`);
      if (!response.ok) throw new Error("Failed to fetch Bible data from API");
      bibleData = await response.json();
      displayVerses(bibleData);
    } catch (error) {
      versesContainer.innerHTML = `<p class="text-red-600">Error loading Bible data: ${error.message}</p>`;
      console.error(error);
    }
  }

  // Highlight search terms
  function highlightText(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
    return text.replace(regex, '<span class="bg-gold/30">$1</span>');
  }

  // Display verses in container
  function displayVerses(data, highlight = "") {
    if (!versesContainer) return;
    if (!data || data.length === 0) {
      versesContainer.innerHTML = `<p class="text-green-900/70">No verses found.</p>`;
      return;
    }

    versesContainer.innerHTML = data.map((verse, index) => `
      <div class="verse-card p-4 mb-4 rounded shadow-sm bg-cream border border-gold cursor-pointer transition hover:shadow-lg" data-index="${index}">
        <p class="font-semibold text-gold">${verse.book} ${verse.chapter}:${verse.verse}</p>
        <p class="text-green-900 mt-1">${highlightText(verse.text, highlight)}</p>
      </div>
    `).join("");

    document.querySelectorAll(".verse-card").forEach(card => {
      card.addEventListener("click", () => {
        const idx = card.getAttribute("data-index");
        openVerseModal(data[idx]);
      });
    });
  }

  // Search filtering
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (!query) {
        displayVerses(bibleData);
        return;
      }

      // Check if user typed a specific verse reference like "Romans 3:23"
      const referenceMatch = query.match(/^([a-z\s]+)\s+(\d+):(\d+)$/i);
      if (referenceMatch) {
        const bookQuery = referenceMatch[1].trim();
        const chapterQuery = parseInt(referenceMatch[2], 10);
        const verseQuery = parseInt(referenceMatch[3], 10);

        const filtered = bibleData.filter(verse =>
          verse.book.toLowerCase() === bookQuery &&
          verse.chapter === chapterQuery &&
          verse.verse === verseQuery
        );

        displayVerses(filtered, query);
        return;
      }

      // Otherwise filter by book name or text content
      const filtered = bibleData.filter(verse =>
        verse.book.toLowerCase().startsWith(query) ||
        verse.text.toLowerCase().includes(query)
      );

      displayVerses(filtered, query);
    });
  }

  // Change translation
  if (translationSelect) {
    translationSelect.addEventListener("change", (e) => {
      fetchBibleData(e.target.value);
    });
  }

  // Initialize with default translation
  if (translationSelect) fetchBibleData(translationSelect.value);

  // === Modal for individual verse view ===
  const modal = document.createElement("div");
  modal.id = "verse-modal";
  modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden";
  modal.innerHTML = `
    <div class="bg-cream rounded-lg shadow-lg max-w-xl w-full p-6 relative">
      <button id="close-modal" class="absolute top-4 right-4 text-green-900 font-bold text-xl">&times;</button>
      <p id="modal-reference" class="font-semibold text-gold text-lg mb-2"></p>
      <p id="modal-text" class="text-green-900"></p>
      <button id="copy-verse" class="mt-4 bg-gold text-green-900 px-4 py-2 rounded hover:bg-gold/90 transition">Copy Verse</button>
    </div>
  `;
  document.body.appendChild(modal);

  const modalReference = document.getElementById("modal-reference");
  const modalText = document.getElementById("modal-text");
  const closeModalBtn = document.getElementById("close-modal");
  const copyVerseBtn = document.getElementById("copy-verse");

  function openVerseModal(verse) {
    modalReference.textContent = `${verse.book} ${verse.chapter}:${verse.verse}`;
    modalText.textContent = verse.text;
    modal.classList.remove("hidden");
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.classList.add("hidden"); });

  if (copyVerseBtn) copyVerseBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(`${modalReference.textContent} - ${modalText.textContent}`);
    copyVerseBtn.textContent = "Copied!";
    setTimeout(() => copyVerseBtn.textContent = "Copy Verse", 1500);
  });
});
