const books = [
  {
    id: "B001",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    status: "Available",
    category: "Programming",
    location: "Level 2, Shelf A3",
    notes: "Latest edition in reference section."
  },
  {
    id: "B002",
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "On Loan",
    category: "Programming",
    location: "Level 1, Shelf B1",
    notes: "Expected return in 5 days."
  },
  {
    id: "B003",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    status: "Available",
    category: "Programming",
    location: "Level 1, Shelf B4",
    notes: "Popular title, multiple copies."
  },
  {
    id: "B004",
    title: "Design Patterns",
    author: "Erich Gamma",
    status: "Available",
    category: "Software Engineering",
    location: "Level 3, Shelf C2",
    notes: "Classic GoF edition."
  }
];

let filteredBooks = [...books];
let selectedBook = null;

const screenTitle = document.getElementById("screenTitle");
const views = {
  homeView: document.getElementById("homeView"),
  resultsView: document.getElementById("resultsView"),
  detailsView: document.getElementById("detailsView"),
  staffView: document.getElementById("staffView")
};

function setView(viewId) {
  Object.entries(views).forEach(([id, node]) => {
    node.classList.toggle("active", id === viewId);
  });
  const titles = {
    homeView: "Home / Search Screen",
    resultsView: "Search Results Screen",
    detailsView: "Book Details Screen",
    staffView: "Staff Dashboard"
  };
  screenTitle.textContent = titles[viewId] || "Mini Library";
}

function renderResults(list) {
  const resultsList = document.getElementById("resultsList");
  if (!list.length) {
    resultsList.innerHTML = "<li>No books found.</li>";
    return;
  }

  resultsList.innerHTML = list
    .map(
      (book) => `
      <li>
        <div class="result-item">
          <div>
            <strong>${book.title}</strong>
            <div class="meta">${book.author} • ${book.status} • ${book.id}</div>
          </div>
          <button data-book-id="${book.id}" class="details-btn">View details</button>
        </div>
      </li>
    `
    )
    .join("");

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const book = books.find((b) => b.id === btn.dataset.bookId);
      if (book) {
        selectedBook = book;
        fillDetails(book);
        fillStaffBook(book);
        setView("detailsView");
      }
    });
  });
}

function fillDetails(book) {
  document.getElementById("detailTitle").textContent = book.title;
  document.getElementById("detailAuthor").textContent = book.author;
  document.getElementById("detailStatus").textContent = book.status;
  document.getElementById("detailLocation").textContent = book.location;
  document.getElementById("detailNotes").textContent = book.notes;
}

function fillStaffBook(book) {
  document.getElementById("staffBookInfo").textContent = `${book.id} — ${book.title} by ${book.author}`;
  document.getElementById("staffStatus").textContent = book.status;
}

function searchAndShow() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const availableOnly = document.getElementById("availableOnly").checked;

  filteredBooks = books.filter((book) => {
    const matchesText =
      !searchInput ||
      book.title.toLowerCase().includes(searchInput) ||
      book.author.toLowerCase().includes(searchInput);
    const matchesAvailability = !availableOnly || book.status === "Available";
    return matchesText && matchesAvailability;
  });

  document.getElementById("resultsLabel").textContent = `Results for: "${searchInput || "All Books"}"`;
  renderResults(filteredBooks);
  setView("resultsView");
}

function sortResults(method) {
  const sorted = [...filteredBooks].sort((a, b) => {
    if (method === "availability") {
      return a.status.localeCompare(b.status) || a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  });
  renderResults(sorted);
}

document.getElementById("searchBtn").addEventListener("click", searchAndShow);
document.getElementById("allBooksBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("availableOnly").checked = true;
  searchAndShow();
});
document.getElementById("browseCategoryBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("availableOnly").checked = false;
  filteredBooks = books.filter((b) => b.category === "Programming");
  document.getElementById("resultsLabel").textContent = 'Results for: "Programming"';
  renderResults(filteredBooks);
  setView("resultsView");
});

document.getElementById("staffBtn").addEventListener("click", () => {
  const text = document.getElementById("staffSearchInput").value.trim().toLowerCase();
  const matched = books.find(
    (b) => b.id.toLowerCase() === text || b.title.toLowerCase().includes(text)
  );
  if (matched) {
    selectedBook = matched;
    fillStaffBook(matched);
  }
  setView("staffView");
});

document.querySelectorAll("[name='sort']").forEach((radio) => {
  radio.addEventListener("change", () => sortResults(radio.value));
});

document.querySelectorAll(".back").forEach((backBtn) => {
  backBtn.addEventListener("click", () => setView(backBtn.dataset.back));
});

document.getElementById("setAvailableBtn").addEventListener("click", () => {
  if (!selectedBook) return;
  selectedBook.status = "Available";
  fillStaffBook(selectedBook);
  renderResults(filteredBooks);
});

document.getElementById("setLoanBtn").addEventListener("click", () => {
  if (!selectedBook) return;
  selectedBook.status = "On Loan";
  fillStaffBook(selectedBook);
  renderResults(filteredBooks);
});

setView("homeView");
