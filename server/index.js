import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = express();
const projectFile = path.join(root, "data", "projects.json");
const enquiryFile = path.join(root, "data", "enquiries.json");
const sessions = new Map();
const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
const getSession = (req) => (req.headers.cookie || "").split("; ").find((item) => item.startsWith("mgs_session="))?.split("=")[1];
const requireAdmin = (req, res, next) => sessions.has(getSession(req)) ? next() : res.status(401).json({ error: "Authentication required." });
app.use(express.json({ limit: "1mb" }));
app.get("/admin.html", async (req, res) => sessions.has(getSession(req)) ? res.type("html").send((await readFile(path.join(root, "admin.html"), "utf8")).replace("</head>", '<link rel="stylesheet" href="admin-type.css"></head>')) : res.redirect("/login.html"));
app.get(["/admin-projects.html", "/admin-builder.html", "/admin-enquiries.html"], async (req, res) => sessions.has(getSession(req)) ? res.type("html").send((await readFile(path.join(root, req.path.slice(1)), "utf8")).replace("</head>", '<link rel="stylesheet" href="admin-type.css"></head>')) : res.redirect("/login.html"));
app.use(express.static(root, { extensions: ["html"] }));
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
app.post("/api/auth/login", (req, res) => {
  const supplied = Buffer.from(req.body.password || "");
  const expected = Buffer.from(adminPassword);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return res.status(401).json({ error: "Invalid password." });
  const token = crypto.randomUUID();
  sessions.set(token, { createdAt: Date.now() });
  res.setHeader("Set-Cookie", `mgs_session=${token}; HttpOnly; SameSite=Lax; Path=/`);
  res.json({ ok: true });
});
app.post("/api/auth/logout", requireAdmin, (req, res) => { sessions.delete(getSession(req)); res.setHeader("Set-Cookie", "mgs_session=; HttpOnly; Max-Age=0; Path=/"); res.status(204).end(); });
app.get("/api/auth/session", (req, res) => res.json({ authenticated: sessions.has(getSession(req)) }));
app.get("/api/projects", async (_req, res) => res.json(await readJson(projectFile)));
app.get("/api/projects/:id", async (req, res) => {
  const project = (await readJson(projectFile)).find((item) => item.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json(project);
});
app.post("/api/projects", requireAdmin, async (req, res) => {
  const { id, title, category } = req.body;
  if (!id || !title?.ru || !title?.en || !category) return res.status(400).json({ error: "id, bilingual title and category are required." });
  const projects = await readJson(projectFile);
  if (projects.some((project) => project.id === id)) return res.status(409).json({ error: "Project id already exists." });
  const project = { year: new Date().getFullYear(), services: [], featured: false, status: "draft", ...req.body };
  projects.push(project);
  await writeFile(projectFile, JSON.stringify(projects, null, 2));
  res.status(201).json(project);
});
app.patch("/api/projects/:id", requireAdmin, async (req, res) => {
  const projects = await readJson(projectFile);
  const index = projects.findIndex((item) => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Project not found." });
  projects[index] = { ...projects[index], ...req.body, id: projects[index].id };
  await writeFile(projectFile, JSON.stringify(projects, null, 2));
  res.json(projects[index]);
});
app.put("/api/projects/:id/blocks", requireAdmin, async (req, res) => {
  if (!Array.isArray(req.body.blocks)) return res.status(400).json({ error: "blocks must be an array." });
  const projects = await readJson(projectFile);
  const index = projects.findIndex((item) => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Project not found." });
  projects[index].blocks = req.body.blocks;
  await writeFile(projectFile, JSON.stringify(projects, null, 2));
  res.json(projects[index]);
});
app.get("/api/enquiries", requireAdmin, async (_req, res) => res.json(await readJson(enquiryFile)));
app.patch("/api/enquiries/:id", requireAdmin, async (req, res) => {
  const allowed = ["new", "contacted", "in_discussion", "accepted", "declined"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid enquiry status." });
  const enquiries = await readJson(enquiryFile);
  const index = enquiries.findIndex((item) => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Enquiry not found." });
  enquiries[index].status = req.body.status;
  await writeFile(enquiryFile, JSON.stringify(enquiries, null, 2));
  res.json(enquiries[index]);
});
app.post("/api/enquiries", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Name, email and message are required." });
  const enquiries = await readJson(enquiryFile);
  const enquiry = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString(), status: "new" };
  enquiries.push(enquiry);
  await writeFile(enquiryFile, JSON.stringify(enquiries, null, 2));
  res.status(201).json({ id: enquiry.id });
});
app.listen(process.env.PORT || 8000, () => console.log("MGS running on http://localhost:8000"));
