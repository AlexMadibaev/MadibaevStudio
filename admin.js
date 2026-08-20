const page = document.body.dataset.adminPage;
const logoutButton = document.querySelector("#logout-button");

const enquiryStatusLabels = {
  new: "New",
  contacted: "Contacted",
  in_discussion: "In discussion",
  accepted: "Accepted",
  declined: "Declined"
};

async function api(url, options) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    location = "/login.html";
    throw new Error("Authentication required.");
  }

  if (response.status === 204) {
    return null;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || "Request failed.");
  }

  return payload;
}

function setMessage(element, message, tone) {
  if (!element) {
    return;
  }

  element.textContent = message || "";
  element.className = "admin-message";

  if (tone) {
    element.classList.add(`is-${tone}`);
  }
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getProjectStatusClass(status) {
  return status === "published" ? "is-published" : "is-draft";
}

function renderEmptyState(title, text, eyebrow) {
  return `
    <article class="admin-empty">
      <small>${eyebrow}</small>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `;
}

function projectServices(project) {
  return Array.isArray(project.services) && project.services.length
    ? project.services.join(" / ")
    : "Services not set";
}

function projectCard(project, actions) {
  return `
    <article class="admin-list-card">
      <div class="admin-list-row">
        <div>
          <div class="admin-list-meta">
            <span class="admin-pill ${getProjectStatusClass(project.status)}">${project.status}</span>
            <span class="admin-pill">${project.category}</span>
            <span class="admin-pill">${project.year || "Year n/a"}</span>
            ${project.featured ? '<span class="admin-pill">featured</span>' : ""}
          </div>
          <h3>${project.title.en}</h3>
          <p>${project.title.ru}</p>
        </div>
        <div class="admin-status-note">${project.id}</div>
      </div>
      <p>${projectServices(project)}</p>
      ${actions}
    </article>
  `;
}

function enquiryCard(enquiry) {
  const options = Object.entries(enquiryStatusLabels)
    .map(([value, label]) => `<option value="${value}" ${enquiry.status === value ? "selected" : ""}>${label}</option>`)
    .join("");

  return `
    <article class="admin-list-card" data-enquiry-id="${enquiry.id}">
      <div class="admin-list-row">
        <div>
          <div class="admin-list-meta">
            <span class="admin-pill is-${enquiry.status}">${enquiryStatusLabels[enquiry.status] || enquiry.status}</span>
            <span class="admin-pill">${formatDate(enquiry.createdAt)}</span>
          </div>
          <h3>${enquiry.name}</h3>
          <p>${enquiry.email}</p>
        </div>
        <div class="admin-field admin-select-inline">
          <label>
            <span>Status</span>
            <select data-role="enquiry-status">
              ${options}
            </select>
          </label>
        </div>
      </div>
      <p>${enquiry.message}</p>
    </article>
  `;
}

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await api("/api/auth/logout", { method: "POST" });
    location = "/login.html";
  });
}

async function loadDashboard() {
  const [projects, enquiries] = await Promise.all([
    api("/api/projects"),
    api("/api/enquiries")
  ]);

  const published = projects.filter((project) => project.status === "published");
  const drafts = projects.filter((project) => project.status !== "published");
  const featured = projects.filter((project) => project.featured);
  const freshEnquiries = enquiries.filter((enquiry) => enquiry.status === "new");

  document.querySelector("#dashboard-published-count").textContent = String(published.length);
  document.querySelector("#dashboard-draft-count").textContent = String(drafts.length);
  document.querySelector("#dashboard-featured-count").textContent = String(featured.length);
  document.querySelector("#dashboard-enquiry-count").textContent = String(freshEnquiries.length);

  const projectList = document.querySelector("#dashboard-projects");
  projectList.innerHTML = projects.length
    ? projects.slice(0, 4).map((project) => projectCard(
      project,
      `<div class="admin-actions">
        <a class="admin-button-ghost" href="admin-builder.html?project=${encodeURIComponent(project.id)}">Edit case study</a>
        <a class="admin-button-ghost" href="/project.html?id=${encodeURIComponent(project.id)}" target="_blank" rel="noreferrer">View live page</a>
      </div>`
    )).join("")
    : renderEmptyState("No projects yet", "Create the first project in the Projects workspace.", "Projects");

  const enquiryList = document.querySelector("#dashboard-enquiries");
  enquiryList.innerHTML = enquiries.length
    ? enquiries.slice(0, 3).map((enquiry) => `
      <article class="admin-list-card">
        <div class="admin-list-row">
          <div>
            <div class="admin-list-meta">
              <span class="admin-pill is-${enquiry.status}">${enquiryStatusLabels[enquiry.status] || enquiry.status}</span>
            </div>
            <h3>${enquiry.name}</h3>
            <p>${enquiry.email}</p>
          </div>
          <div class="admin-status-note">${formatDate(enquiry.createdAt)}</div>
        </div>
        <p>${enquiry.message}</p>
      </article>
    `).join("")
    : renderEmptyState("No enquiries yet", "New website contact requests will appear here.", "Enquiries");
}

async function loadProjectsPage() {
  const projects = await api("/api/projects");
  const message = document.querySelector("#projects-message");

  document.querySelector("#projects-total-count").textContent = String(projects.length);
  document.querySelector("#projects-published-count").textContent = String(projects.filter((project) => project.status === "published").length);
  document.querySelector("#projects-draft-count").textContent = String(projects.filter((project) => project.status !== "published").length);
  document.querySelector("#projects-featured-count").textContent = String(projects.filter((project) => project.featured).length);

  const list = document.querySelector("#projects-page-list");
  list.innerHTML = projects.length
    ? projects.map((project) => projectCard(
      project,
      `<div class="admin-actions">
        <button class="admin-button-ghost" data-action="toggle-status" data-project-id="${project.id}" type="button">${project.status === "published" ? "Move to draft" : "Publish now"}</button>
        <button class="admin-button-ghost" data-action="toggle-featured" data-project-id="${project.id}" type="button">${project.featured ? "Remove featured" : "Mark featured"}</button>
        <a class="admin-button-ghost" href="admin-builder.html?project=${encodeURIComponent(project.id)}">Open builder</a>
        <a class="admin-button-ghost" href="/project.html?id=${encodeURIComponent(project.id)}" target="_blank" rel="noreferrer">Open live page</a>
      </div>`
    )).join("")
    : renderEmptyState("No projects yet", "Create your first portfolio entry to start publishing work.", "Projects");

  list.onclick = async (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const project = projects.find((item) => item.id === target.dataset.projectId);
    if (!project) {
      return;
    }

    setMessage(message, "Saving changes...");

    try {
      if (target.dataset.action === "toggle-status") {
        await api(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: project.status === "published" ? "draft" : "published"
          })
        });
      }

      if (target.dataset.action === "toggle-featured") {
        await api(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !project.featured })
        });
      }

      setMessage(message, "Project updated.", "success");
      await loadProjectsPage();
    } catch (error) {
      setMessage(message, error.message, "error");
    }
  };

  const dialog = document.querySelector("#project-dialog");
  const newProjectButton = document.querySelector("#new-project");
  const form = document.querySelector("#project-form");
  const formMessage = document.querySelector("#project-form-message");

  newProjectButton.onclick = () => {
    form.reset();
    setMessage(formMessage, "");
    dialog.showModal();
  };

  form.onsubmit = async (event) => {
    event.preventDefault();

    if (event.submitter?.value === "cancel") {
      dialog.close();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    setMessage(formMessage, "Creating project...");

    try {
      await api("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          title: {
            ru: data.titleRu,
            en: data.titleEn
          },
          category: data.category
        })
      });

      dialog.close();
      setMessage(message, "Project created.", "success");
      await loadProjectsPage();
    } catch (error) {
      setMessage(formMessage, error.message, "error");
    }
  };
}

async function loadBuilderPage() {
  const projects = await api("/api/projects");
  const select = document.querySelector("#builder-project-select");
  const blocksList = document.querySelector("#builder-blocks");
  const form = document.querySelector("#builder-form");
  const saveButton = document.querySelector("#builder-save");
  const message = document.querySelector("#builder-message");
  const previewLink = document.querySelector("#builder-preview-link");
  const projectFromQuery = new URLSearchParams(location.search).get("project");
  let activeProjectId = projectFromQuery && projects.some((project) => project.id === projectFromQuery)
    ? projectFromQuery
    : projects[0]?.id;
  let blocks = [];

  if (!projects.length) {
    select.innerHTML = "";
    blocksList.innerHTML = renderEmptyState("No projects available", "Create a project first, then come back to compose its case study.", "Builder");
    saveButton.disabled = true;
    form.querySelector('[type="submit"]').disabled = true;
    previewLink.href = "admin-projects.html";
    previewLink.textContent = "Create a project first";
    return;
  }

  select.innerHTML = projects.map((project) => `
    <option value="${project.id}" ${project.id === activeProjectId ? "selected" : ""}>${project.title.en}</option>
  `).join("");

  function renderBuilderBlocks() {
    blocksList.innerHTML = blocks.length
      ? blocks.map((block, index) => `
        <article class="admin-block-card">
          <div class="admin-block-card-header">
            <div class="admin-list-meta">
              <span class="admin-pill">${String(index + 1).padStart(2, "0")}</span>
              <span class="admin-pill">${block.type}</span>
            </div>
            <button class="admin-button-danger" data-index="${index}" type="button">Delete block</button>
          </div>
          <p>${block.content}</p>
        </article>
      `).join("")
      : renderEmptyState("No content blocks yet", "Add a heading or text block to start shaping the case study.", "Builder");
  }

  function loadProjectBlocks(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    activeProjectId = project.id;
    blocks = Array.isArray(project.blocks) ? project.blocks.map((block) => ({ ...block })) : [];
    previewLink.href = `/project.html?id=${encodeURIComponent(project.id)}`;
    previewLink.textContent = `Open ${project.title.en}`;
    renderBuilderBlocks();
  }

  loadProjectBlocks(activeProjectId);

  select.onchange = () => {
    loadProjectBlocks(select.value);
    setMessage(message, "");
    const next = new URL(location.href);
    next.searchParams.set("project", select.value);
    history.replaceState({}, "", next);
  };

  form.onsubmit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    blocks.push(data);
    form.reset();
    renderBuilderBlocks();
    setMessage(message, "Block added locally. Save to persist changes.", "success");
  };

  blocksList.onclick = (event) => {
    const target = event.target.closest("[data-index]");
    if (!target) {
      return;
    }

    blocks.splice(Number(target.dataset.index), 1);
    renderBuilderBlocks();
    setMessage(message, "Block removed locally. Save to persist changes.", "success");
  };

  saveButton.onclick = async () => {
    setMessage(message, "Saving case study...");

    try {
      const updated = await api(`/api/projects/${activeProjectId}/blocks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks })
      });

      const projectIndex = projects.findIndex((project) => project.id === activeProjectId);
      if (projectIndex >= 0) {
        projects[projectIndex] = updated;
      }

      loadProjectBlocks(activeProjectId);
      setMessage(message, "Case study saved.", "success");
    } catch (error) {
      setMessage(message, error.message, "error");
    }
  };
}

async function loadEnquiriesPage() {
  const enquiries = await api("/api/enquiries");
  const message = document.querySelector("#enquiries-message");

  document.querySelector("#enquiries-total-count").textContent = String(enquiries.length);
  document.querySelector("#enquiries-new-count").textContent = String(enquiries.filter((enquiry) => enquiry.status === "new").length);
  document.querySelector("#enquiries-discussion-count").textContent = String(enquiries.filter((enquiry) => enquiry.status === "in_discussion").length);
  document.querySelector("#enquiries-accepted-count").textContent = String(enquiries.filter((enquiry) => enquiry.status === "accepted").length);

  const list = document.querySelector("#enquiries-page-list");
  list.innerHTML = enquiries.length
    ? enquiries.map(enquiryCard).join("")
    : renderEmptyState("No enquiries yet", "When the public contact form is used, requests will appear here.", "Inbox");

  list.onchange = async (event) => {
    const select = event.target.closest('[data-role="enquiry-status"]');
    if (!select) {
      return;
    }

    const card = select.closest("[data-enquiry-id]");
    const enquiryId = card?.dataset.enquiryId;
    if (!enquiryId) {
      return;
    }

    setMessage(message, "Updating enquiry status...");

    try {
      await api(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: select.value })
      });

      setMessage(message, "Enquiry updated.", "success");
      await loadEnquiriesPage();
    } catch (error) {
      setMessage(message, error.message, "error");
    }
  };
}

async function init() {
  try {
    if (page === "dashboard") {
      await loadDashboard();
      return;
    }

    if (page === "projects") {
      await loadProjectsPage();
      return;
    }

    if (page === "builder") {
      await loadBuilderPage();
      return;
    }

    if (page === "enquiries") {
      await loadEnquiriesPage();
    }
  } catch (error) {
    const target = document.querySelector(".admin-message");
    if (target) {
      setMessage(target, error.message, "error");
    }
  }
}

init();
