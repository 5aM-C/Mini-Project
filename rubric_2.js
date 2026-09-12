document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Authentication elements
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const authView = document.getElementById("auth-view");
  const dashboardView = document.getElementById("dashboard-view");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Profile fields
  const profileNameDisplay = document.getElementById("profileNameDisplay");
  const profileDeptDisplay = document.getElementById("profileDeptDisplay");
  const profileAvatar = document.getElementById("profileAvatar");

  // Feed & Search elements
  const themeToggle = document.getElementById("themeToggle");
  const postInput = document.getElementById("postInput");
  const submitPostBtn = document.getElementById("submitPostBtn");
  const postsList = document.getElementById("postsList");
  const globalSearchInput = document.getElementById("globalSearchInput");
  const searchRadios = document.querySelectorAll('input[name="searchFilter"]');
  const profileResults = document.getElementById("profileResults");
  const communityResults = document.getElementById("communityResults");

  let currentUser = { name: "Student", initials: "ST", dept: "" };

  // 1. AUTHENTICATION
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const dept = document.getElementById("department").value;

    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    currentUser = { name, initials, dept };

    profileNameDisplay.textContent = name;
    profileDeptDisplay.textContent = dept;
    profileAvatar.textContent = initials;

    authView.style.display = "none";
    dashboardView.style.display = "block";
  });

  logoutBtn.addEventListener("click", () => {
    dashboardView.style.display = "none";
    authView.style.display = "flex";
    loginForm.reset();
  });

  // 2. TAB SWITCHING
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // 3. DARK / LIGHT MODE
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);
  });

  // 4. INSTAGRAM FEED POST CREATION & LIKES
  submitPostBtn.addEventListener("click", () => {
    const content = postInput.value.trim();
    if (!content) return;

    const newPost = document.createElement("article");
    newPost.className = "card post-card";
    newPost.innerHTML = `
      <div class="post-header">
        <div class="avatar">${currentUser.initials}</div>
        <div>
          <div class="post-author">${currentUser.name} <span class="badge">Verified</span></div>
          <div class="post-time">Just now • ${currentUser.dept}</div>
        </div>
      </div>
      <div class="post-body">${content}</div>
      <div class="post-actions">
        <button class="action-btn like-btn">❤️ <span>0</span></button>
        <button class="action-btn">💬 Comment</button>
        <button class="action-btn">🔄 Swap Skill</button>
      </div>
    `;

    postsList.prepend(newPost);
    postInput.value = "";
    bindLikeEvents();
  });

  function bindLikeEvents() {
    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.onclick = () => {
        const countSpan = btn.querySelector("span");
        let count = parseInt(countSpan.textContent, 10);
        if (btn.classList.contains("liked")) {
          btn.classList.remove("liked");
          countSpan.textContent = count - 1;
        } else {
          btn.classList.add("liked");
          countSpan.textContent = count + 1;
        }
      };
    });
  }
  bindLikeEvents();

  // 5. SEARCH & FILTER (Profiles vs Communities)
  function handleFilterSwitch() {
    const selectedFilter = document.querySelector('input[name="searchFilter"]:checked').value;
    if (selectedFilter === "profiles") {
      profileResults.style.display = "grid";
      communityResults.style.display = "none";
    } else {
      profileResults.style.display = "none";
      communityResults.style.display = "grid";
    }
    executeSearch();
  }

  searchRadios.forEach((radio) => {
    radio.addEventListener("change", handleFilterSwitch);
  });

  function executeSearch() {
    const query = globalSearchInput.value.toLowerCase().trim();
    const activeSection = document.querySelector('input[name="searchFilter"]:checked').value;
    const cards = activeSection === "profiles"
      ? profileResults.querySelectorAll(".entity-card")
      : communityResults.querySelectorAll(".entity-card");

    cards.forEach((card) => {
      const dataStr = `${card.getAttribute("data-name") || ""} ${card.getAttribute("data-dept") || ""} ${card.getAttribute("data-skill") || ""} ${card.getAttribute("data-desc") || ""}`.toLowerCase();
      card.style.display = dataStr.includes(query) ? "flex" : "none";
    });
  }

  globalSearchInput.addEventListener("keyup", executeSearch);
});