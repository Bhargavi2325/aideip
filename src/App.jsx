import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const managerNav = [
  ["Overview", "/manager/dashboard", "grid"],
  ["Datasets", "/manager/datasets", "database"],
  ["Analytics", "/manager/analytics", "chart"],
  ["Predictions", "/manager/predictions", "spark"],
  ["Anomalies", "/manager/anomalies", "activity"],
  ["AI insights", "/manager/insights", "light"],
  ["Root cause", "/manager/root-cause", "branch"],
  ["Recommendations", "/manager/recommendations", "bulb"],
  ["Reports", "/manager/reports", "file"],
  ["AI Copilot", "/manager/copilot", "chat"],
];

const adminNav = [
  ["Enterprise overview", "/admin/dashboard", "grid"],
  ["Managers", "/admin/managers", "users"],
  ["Departments", "/admin/departments", "building"],
  ["Datasets", "/admin/datasets", "database"],
  ["Pipelines", "/admin/pipelines", "branch"],
  ["ML models", "/admin/ml-models", "spark"],
  ["AI agents", "/admin/ai-agents", "bot"],
  ["Enterprise analytics", "/admin/analytics", "chart"],
  ["Alerts", "/admin/alerts", "activity"],
  ["Reports", "/admin/reports", "file"],
  ["Enterprise Copilot", "/admin/copilot", "chat"],
  ["Settings", "/admin/settings", "sun"],
  ["System health", "/admin/system-health", "heart"],
];

const initialDatasets = [
  { name: "Customer behavior Q3.csv", owner: "Olivia Martin", rows: "48,290", fields: 18, status: "Processed", date: "Oct 06, 2026", size: "4.8 MB" },
  { name: "Regional operations.csv", owner: "Olivia Martin", rows: "12,840", fields: 11, status: "Processed", date: "Oct 04, 2026", size: "1.2 MB" },
  { name: "Support response data.csv", owner: "Olivia Martin", rows: "8,417", fields: 14, status: "Processing", date: "Oct 03, 2026", size: "820 KB" },
  { name: "Web engagement.csv", owner: "Olivia Martin", rows: "26,104", fields: 9, status: "Processed", date: "Sep 29, 2026", size: "2.6 MB" },
];

const activity = [
  { icon: "database", color: "violet", title: "Dataset profiling completed", detail: "Customer behavior Q3.csv · 18 columns detected", time: "12 min ago" },
  { icon: "spark", color: "blue", title: "Anomaly analysis is ready", detail: "7 unusual patterns identified for review", time: "1 hr ago" },
  { icon: "chart", color: "green", title: "New insights generated", detail: "Behavior trends · Customer behavior Q3.csv", time: "3 hrs ago" },
];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /><path d="M17 6h3v3" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    light: <><path d="M9 18h6M10 22h4M8 14c-1.3-1-2-2.5-2-4a6 6 0 1 1 12 0c0 1.5-.7 3-2 4-.8.7-1 1.3-1 2h-6c0-.7-.2-1.3-1-2Z" /></>,
    branch: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 5h4a4 4 0 0 1 4 4v8M8 5h6a4 4 0 0 1 4 4" /></>,
    bulb: <><path d="M9 18h6M10 22h4M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.2 1.3-1.3 2.5h-4.4c-.1-1.2-.5-1.9-1.3-2.5Z" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    chat: <><path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" /></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2m3 0h2M9 11h2m3 0h2M9 15h2m3 0h2M10 21v-3h4v3" /></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4m-4 5h.01M16 12h.01M9 16h6M2 12h2m16 0h2" /></>,
    heart: <><path d="M20.8 8.6c0 5.4-8.8 11-8.8 11S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.3Z" /><path d="M7 12h3l1.5-3 2 6 1.5-3H18" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    down: <><path d="m7 10 5 5 5-5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8 8 0 1 0 20.5 14.5Z" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg {...common}>{paths[name] || paths.spark}</svg>;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"' && quoted) { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(value); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else value += char;
  }
  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  return rows;
}

function profileCsv(fileName, text) {
  const [header = [], ...records] = parseCsv(text);
  if (!header.length || !records.length) throw new Error("This CSV needs a header row and at least one data row.");
  const columns = header.map((name, index) => {
    const values = records.map((record) => (record[index] || "").trim());
    const filled = values.filter(Boolean);
    const numbers = filled.map(Number);
    const numeric = filled.length > 0 && numbers.every(Number.isFinite);
    const dates = filled.length > 0 && filled.every((value) => !Number.isNaN(Date.parse(value)));
    const unique = new Set(filled).size;
    const numericStats = numeric ? numbers.reduce((stats, number) => ({ min: Math.min(stats.min, number), max: Math.max(stats.max, number), sum: stats.sum + number }), { min: Infinity, max: -Infinity, sum: 0 }) : null;
    return {
      name: name.trim() || `Column ${index + 1}`,
      type: numeric ? "Numeric" : dates ? "Date" : "Categorical",
      nulls: values.length - filled.length,
      unique,
      min: numeric ? numericStats.min : "—",
      max: numeric ? numericStats.max : "—",
      mean: numeric ? (numericStats.sum / numbers.length).toFixed(2) : "—",
    };
  });
  const numericCount = columns.filter((column) => column.type === "Numeric").length;
  const dateCount = columns.filter((column) => column.type === "Date").length;
  const categoricalCount = columns.filter((column) => column.type === "Categorical").length;
  const capabilities = ["Numerical analysis"];
  if (numericCount > 1) capabilities.push("Correlation analysis", "Clustering", "Anomaly detection");
  if (dateCount > 0) capabilities.push("Time analysis", "Forecasting");
  if (categoricalCount > 0) capabilities.push("Categorical analysis");
  return { name: fileName, rows: records.length, sample: records.slice(0, 5), columns, numericCount, dateCount, categoricalCount, capabilities };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function LineChart() {
  const points = "0,122 43,102 86,110 129,74 172,86 215,61 258,73 301,35 344,48 387,20 430,32 473,12";
  const bars = [44, 64, 51, 76, 57, 90, 69, 100, 82, 114, 92, 123];
  return (
    <div className="chart-wrap">
      <div className="chart-labels"><span>80k</span><span>60k</span><span>40k</span><span>20k</span><span>0</span></div>
      <svg className="line-chart" viewBox="0 0 480 150" preserveAspectRatio="none" role="img" aria-label="Monthly dataset activity trend">
        {[20, 50, 80, 110, 140].map((y) => <line key={y} x1="0" y1={y} x2="480" y2={y} className="chart-grid" />)}
        {bars.map((height, index) => <rect key={index} x={index * 40 + 7} y={140 - height / 2} width="16" height={height / 2} rx="3" className="chart-bar" />)}
        <polyline points={points} className="chart-line" />
        {points.split(" ").map((pair, index) => { const [cx, cy] = pair.split(","); return <circle key={index} cx={cx} cy={cy} r="3.5" className="chart-dot" />; })}
      </svg>
      <div className="chart-months">{["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month) => <span key={month}>{month}</span>)}</div>
    </div>
  );
}

function Kpi({ label, value, change, icon, tone }) {
  return (
    <section className="kpi-card">
      <div className="kpi-top"><span>{label}</span><span className={`kpi-icon ${tone}`}><Icon name={icon} size={17} /></span></div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-foot"><span className="trend-up">{change}</span><span className="muted">vs. last month</span></div>
    </section>
  );
}

function Status({ children }) {
  return <span className={`status status-${children.toLowerCase()}`}><i />{children}</span>;
}

function App() {
  const [role, setRole] = useState("MANAGER");
  const [route, setRoute] = useState(() => {
    const initialPath = window.location.pathname;
    return initialPath === "/" || initialPath.startsWith("/admin") ? "/manager/dashboard" : initialPath;
  });
  const [dataset, setDataset] = useState(null);
  const [datasets, setDatasets] = useState(initialDatasets);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);
  const isAdmin = route.startsWith("/admin");
  const nav = isAdmin ? adminNav : managerNav;

  useEffect(() => {
    const onPop = () => {
      const nextPath = window.location.pathname === "/" ? "/manager/dashboard" : window.location.pathname;
      if (nextPath.startsWith("/admin") && role !== "ADMIN") {
        window.history.replaceState({}, "", "/manager/dashboard");
        setRoute("/manager/dashboard");
        return;
      }
      setRoute(nextPath);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [role]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function navigate(path) {
    const guardedPath = path.startsWith("/admin") && role !== "ADMIN" ? "/manager/dashboard" : path;
    if (guardedPath !== path) setToast("Admin pages are only available in Admin view.");
    window.history.pushState({}, "", guardedPath);
    setRoute(guardedPath);
    setMobileOpen(false);
    setSearch("");
  }

  function switchRole() {
    const next = role === "MANAGER" ? "ADMIN" : "MANAGER";
    const nextPath = next === "ADMIN" ? "/admin/dashboard" : "/manager/dashboard";
    setRole(next);
    window.history.pushState({}, "", nextPath);
    setRoute(nextPath);
    setSearch("");
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) { setToast("Please choose a CSV file."); return; }
    if (file.size > 50 * 1024 * 1024) { setToast("Files must be smaller than 50 MB."); return; }
    setSelectedFile(file);
    navigate("/manager/datasets/upload");
    try {
      const text = await file.text();
      const result = profileCsv(file.name, text);
      setDataset(result);
      setDatasets((current) => [{ name: file.name, owner: "Olivia Martin", rows: formatNumber(result.rows), fields: result.columns.length, status: "Processed", date: "Just now", size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` }, ...current]);
      setToast(`${file.name} profiled successfully.`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "We couldn't read this CSV.");
    }
  }

  const filteredDatasets = useMemo(() => datasets.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [datasets, search]);
  const activeNav = nav.find((item) => item[1] === route);
  const currentTitle = activeNav?.[0] || (route.includes("/overview") ? "Dataset overview" : route.includes("/columns") ? "Columns" : route.includes("/preview") ? "Data preview" : route.includes("/cleaning") ? "Cleaning summary" : "Overview");

  function sendMessage(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "you", text }, { from: "ai", text: "I can help explore the data available in your workspace. Connect an AIDEIP AI service to generate an evidence-backed answer for this question.", evidence: dataset ? `${dataset.name} · ${formatNumber(dataset.rows)} rows profiled` : "Using demo workspace data" }]);
    setChatInput("");
  }

  if (route === "/login") {
    return <div className="login-screen">
      <div className="login-brand"><span className="brand-mark"><Icon name="spark" /></span><span><b>AIDEIP</b><small>AI Enterprise Decision Intelligence</small></span></div>
      <form className="login-form" onSubmit={(event) => { event.preventDefault(); navigate(role === "ADMIN" ? "/admin/dashboard" : "/manager/dashboard"); }}>
        <div className="eyebrow">WELCOME BACK</div><h1>Sign in to your workspace</h1><p>Continue to your decision intelligence platform.</p>
        <label>Email address<input type="email" defaultValue="olivia.martin@acme.com" required /></label>
        <label>Password<input type="password" defaultValue="password" required /></label>
        <button className="primary-button full-button">Sign in <Icon name="arrow" size={16} /></button>
        <div className="login-demo">Demo mode · Use the role switcher after signing in</div>
      </form>
      <div className="login-aside"><div className="login-orb orb-one" /><div className="login-orb orb-two" /><div className="login-aside-copy"><span className="eyebrow">INTELLIGENCE, IN CONTEXT</span><h2>Turn complex data into your next clear decision.</h2><p>Profile any dataset. Find the signal. Move forward with confidence.</p></div><div className="login-aside-foot">AIDEIP · Decision intelligence for modern teams</div></div>
    </div>;
  }

  const isUpload = route === "/manager/datasets/upload";
  const isProcessing = route.endsWith("/processing");
  const isChat = route.endsWith("/copilot");
  const isDatasetTable = route === "/manager/datasets" || route === "/admin/datasets";
  const isOverview = route === "/manager/dashboard" || route === "/admin/dashboard";
  const isColumns = route.endsWith("/columns");
  const isPreview = route.endsWith("/preview");
  const isCleaning = route.endsWith("/cleaning");
  const isDatasetOverview = route.endsWith("/overview");

  return (
    <div className={`app-shell ${dark ? "theme-dark" : "theme-light"}`}>
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <a href={role === "ADMIN" ? "/admin/dashboard" : "/manager/dashboard"} className="brand" onClick={(event) => { event.preventDefault(); navigate(role === "ADMIN" ? "/admin/dashboard" : "/manager/dashboard"); }}>
          <span className="brand-mark"><Icon name="spark" size={20} /></span><span className="brand-copy"><strong>AIDEIP</strong><small>DECISION INTELLIGENCE</small></span>
        </a>
        <div className="workspace-picker"><span className="workspace-logo">{role === "ADMIN" ? "A" : "N"}</span><span><b>{role === "ADMIN" ? "Acme Enterprise" : "Northstar Group"}</b><small>{role === "ADMIN" ? "Enterprise workspace" : "Manager workspace"}</small></span><Icon name="down" size={14} /></div>
        <div className="nav-label">{role === "ADMIN" ? "ADMINISTRATION" : "WORKSPACE"}</div>
        <nav className="side-nav" aria-label={`${role.toLowerCase()} navigation`}>
          {nav.map(([label, path, icon]) => <a key={path} href={path} className={`nav-link ${route === path ? "nav-active" : ""}`} onClick={(event) => { event.preventDefault(); navigate(path); }}><Icon name={icon} size={17} /><span>{label}</span>{label === "Anomalies" && <span className="nav-count">7</span>}</a>)}
        </nav>
        <div className="sidebar-bottom">
          <a href={`${role === "ADMIN" ? "/admin" : "/manager"}/settings`} className={`nav-link ${route.endsWith("/settings") ? "nav-active" : ""}`} onClick={(event) => { event.preventDefault(); navigate(`${role === "ADMIN" ? "/admin" : "/manager"}/settings`); }}><Icon name="sun" size={17} /><span>Settings</span></a>
          <div className="sidebar-help"><div className="help-icon"><Icon name="light" size={17} /></div><div><b>Need a hand?</b><small>Explore the AIDEIP guide</small></div><Icon name="arrow" size={14} /></div>
          <div className="profile-row"><div className="avatar">OM</div><div className="profile-info"><b>Olivia Martin</b><small>{role === "ADMIN" ? "Platform administrator" : "Data manager"}</small></div><button className="icon-button profile-menu" aria-label="Open profile menu" onClick={() => navigate("/login")}><Icon name="down" size={16} /></button></div>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><span className="hamburger">☰</span></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-sep">/</span><b>{currentTitle}</b></div></div>
          <div className="topbar-actions">
            <label className="global-search"><Icon name="search" size={16} /><input aria-label="Search datasets" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
            <button className="icon-button theme-toggle" title="Toggle light and dark mode" aria-label="Toggle theme" onClick={() => setDark((value) => !value)}><Icon name={dark ? "sun" : "moon"} size={17} /></button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up on notifications.")}><Icon name="bell" size={17} /><i /></button>
            <span className="topbar-divider" />
            <button className="role-switch" onClick={switchRole}><span className="role-avatar">{role === "ADMIN" ? "A" : "M"}</span><span>{role === "ADMIN" ? "Admin view" : "Manager view"}</span><Icon name="down" size={14} /></button>
          </div>
        </header>
        <div className="page-content">
          {isOverview ? <Dashboard role={role} datasets={datasets} onNavigate={navigate} onToast={setToast} /> :
            isUpload ? <UploadPage file={selectedFile} inputRef={fileInput} dragging={dragging} setDragging={setDragging} onFile={handleFile} onChoose={() => fileInput.current?.click()} onNavigate={navigate} dataset={dataset} /> :
              isProcessing ? <ProcessingPage dataset={dataset} onNavigate={navigate} /> :
                isDatasetTable ? <DatasetsPage datasets={filteredDatasets} search={search} onSearch={setSearch} isAdmin={isAdmin} onNavigate={navigate} onUpload={() => navigate("/manager/datasets/upload")} /> :
                  isColumns ? <ColumnsPage dataset={dataset} /> :
                    isPreview ? <PreviewPage dataset={dataset} /> :
                      isCleaning ? <CleaningPage dataset={dataset} /> :
                        isDatasetOverview ? <DatasetOverview dataset={dataset} onNavigate={navigate} /> :
                        isChat ? <CopilotPage messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMessage} isAdmin={isAdmin} /> :
                          <GenericPage title={currentTitle} role={role} dataset={dataset} onNavigate={navigate} onToast={setToast} />}
        </div>
        <footer className="app-footer"><span>© 2026 AIDEIP Technologies</span><span><i className="online-dot" /> All systems operational</span><span>Data is private to your workspace</span></footer>
      </main>
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={15} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="close" size={14} /></button></div>}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p>{children}</div>{action}</div>;
}

function Dashboard({ role, datasets, onNavigate, onToast }) {
  const admin = role === "ADMIN";
  const stats = admin
    ? [["Active managers", "24", "+3.2%", "users", "violet"], ["Datasets monitored", "186", "+12.8%", "database", "blue"], ["Models deployed", "32", "+8.1%", "spark", "green"], ["Open alerts", "09", "2 critical", "activity", "orange"]]
    : [["Records analyzed", "95,651", "+12.4%", "database", "violet"], ["Datasets", `${datasets.length}`, "+2 this month", "file", "blue"], ["AI predictions", "1,248", "+18.6%", "spark", "green"], ["Anomalies", "37", "7 need review", "activity", "orange"]];
  return <>
    <PageHeader eyebrow={admin ? "ENTERPRISE OVERVIEW" : "MONDAY, OCTOBER 6, 2026"} title={admin ? "Enterprise overview" : "Good morning, Olivia"} description={admin ? "A real-time view of intelligence activity across your organization." : "Here's what's happening across your data workspace."} action={<div className="heading-actions"><button className="secondary-button" onClick={() => onToast("Your dashboard report is being prepared.")}><Icon name="file" size={16} /> Export report</button><button className="primary-button" onClick={() => onNavigate("/manager/datasets/upload")}><Icon name="plus" size={16} /> Upload dataset</button></div>} />
    <div className="kpi-grid">{stats.map(([label, value, change, icon, tone]) => <Kpi key={label} label={label} value={value} change={change} icon={icon} tone={tone} />)}</div>
    <div className="dashboard-grid">
      <section className="panel trend-panel"><div className="panel-heading"><div><h2>{admin ? "Enterprise activity" : "Data activity"}</h2><p>{admin ? "Platform usage and processing volume" : "Records processed across your datasets"}</p></div><button className="select-button">Last 6 months <Icon name="down" size={14} /></button></div><div className="chart-legend"><span><i className="legend-primary" /> Records processed</span><span><i className="legend-secondary" /> New datasets</span><b>+24.8% <small>vs previous period</small></b></div><LineChart /></section>
      <section className="panel insight-panel"><div className="panel-heading"><div><h2>AI highlights</h2><p>Evidence-backed signals from your data</p></div><button className="text-button" onClick={() => onNavigate(admin ? "/admin/analytics" : "/manager/insights")}>View all <Icon name="arrow" size={14} /></button></div>
        <div className="highlight"><span className="highlight-icon green"><Icon name="chart" size={16} /></span><div><span className="highlight-tag">TREND · HIGH CONFIDENCE</span><b>Engagement is trending upward</b><p>Observed across 4 of 5 recent weekly periods.</p></div></div>
        <div className="highlight"><span className="highlight-icon orange"><Icon name="activity" size={16} /></span><div><span className="highlight-tag">ANOMALY · REVIEW</span><b>7 records differ from baseline</b><p>Concentrated in the latest data refresh.</p></div></div>
        <button className="insight-footer" onClick={() => onNavigate(admin ? "/admin/copilot" : "/manager/copilot")}><span className="copilot-mini"><Icon name="spark" size={15} /></span> Explore these signals with Copilot <Icon name="arrow" size={14} /></button>
      </section>
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent datasets</h2><p>Your latest uploads and processing status</p></div><button className="text-button" onClick={() => onNavigate(admin ? "/admin/datasets" : "/manager/datasets")}>View datasets <Icon name="arrow" size={14} /></button></div>
        <div className="table-scroll"><table><thead><tr><th>DATASET</th><th>RECORDS</th><th>STATUS</th><th>UPDATED</th></tr></thead><tbody>{datasets.slice(0, 3).map((item) => <tr key={item.name}><td><span className="dataset-name-cell"><span className="csv-icon">CSV</span><span><b>{item.name}</b><small>{item.fields} columns</small></span></span></td><td>{item.rows}</td><td><Status>{item.status}</Status></td><td>{item.date}</td></tr>)}</tbody></table></div>
      </section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your workspace</p></div><button className="icon-button subtle-button" aria-label="More activity"><span>···</span></button></div><div className="activity-list">{activity.map((item) => <div className="activity-item" key={item.title}><span className={`activity-icon ${item.color}`}><Icon name={item.icon} size={15} /></span><div><b>{item.title}</b><p>{item.detail}</p></div><time>{item.time}</time></div>)}</div></section>
    </div>
  </>;
}

function UploadPage({ file, inputRef, dragging, setDragging, onFile, onChoose, onNavigate, dataset }) {
  if (dataset && file) return <section className="panel processing-card"><div className="processing-orb"><Icon name="spark" size={26} /></div><div className="eyebrow">AUTOMATIC DATASET PROFILING</div><h1>Understanding your data</h1><p className="processing-subtitle">AIDEIP is inspecting <b>{file.name}</b> and detecting its structure.</p><div className="processing-steps">{["Read CSV", "Detect schema", "Profile columns", "Identify capabilities"].map((step, index) => <div className="processing-step" key={step}><span className="step-check"><Icon name="check" size={14} /></span><span>{step}</span>{index < 3 && <i />}</div>)}</div><div className="profile-result"><span className="profile-result-icon"><Icon name="database" size={18} /></span><div><b>{formatNumber(dataset.rows)} rows · {dataset.columns.length} columns detected</b><p>{dataset.numericCount} numeric · {dataset.categoricalCount} categorical · {dataset.dateCount} date</p></div><button className="primary-button" onClick={() => onNavigate("/manager/datasets/active/overview")}>View dataset <Icon name="arrow" size={15} /></button></div><button className="text-button upload-another" onClick={() => onNavigate("/manager/datasets/upload")}>Upload another CSV</button></section>;
  return <>
    <PageHeader eyebrow="DATA WORKSPACE" title="Bring your data into focus" description="Upload any CSV. AIDEIP automatically discovers its structure and available analysis." />
    <section className={`upload-zone ${dragging ? "upload-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onFile(event.dataTransfer.files[0]); }}>
      <input ref={inputRef} type="file" accept=".csv,text/csv" hidden onChange={(event) => onFile(event.target.files?.[0])} />
      <div className="upload-symbol"><Icon name="upload" size={24} /></div><h2>Upload enterprise dataset</h2><p>Drag and drop your CSV file here, or choose a file from your device.</p><button className="primary-button" onClick={onChoose}>Choose CSV file</button><span className="upload-hint">CSV format · Maximum file size 50 MB</span>
    </section>
    <div className="upload-info-row"><div><span className="info-icon"><Icon name="spark" size={17} /></span><div><b>Automatic dataset intelligence</b><p>No dataset type selection needed. Profiling and capabilities are detected from the data itself.</p></div></div><span className="demo-badge">DEMO MODE</span></div>
    <div className="upload-bottom"><span><Icon name="check" size={15} /> Your data stays in your workspace</span><span>Need another format? <button onClick={() => {}}>Contact your administrator</button></span></div>
  </>;
}

function DatasetsPage({ datasets, search, onSearch, isAdmin, onNavigate, onUpload }) {
  return <>
    <PageHeader eyebrow={isAdmin ? "ENTERPRISE DATA" : "DATA WORKSPACE"} title={isAdmin ? "All datasets" : "Datasets"} description={isAdmin ? "Monitor dataset ingestion and intelligence across departments." : "Manage your uploads and explore automatically generated profiles."} action={!isAdmin && <button className="primary-button" onClick={onUpload}><Icon name="plus" size={16} /> Upload dataset</button>} />
    <section className="panel data-table-panel"><div className="table-toolbar"><div><b>{datasets.length} datasets</b><span> · Demo workspace data</span></div><div className="table-tools"><label className="table-search"><Icon name="search" size={15} /><input placeholder="Filter datasets..." value={search} onChange={(event) => onSearch(event.target.value)} /></label><button className="secondary-button compact-button"><Icon name="activity" size={15} /> Filter</button></div></div><div className="table-scroll"><table className="wide-table"><thead><tr><th>DATASET</th>{isAdmin && <th>OWNER</th>}<th>RECORDS</th><th>COLUMNS</th><th>STATUS</th><th>UPLOADED</th><th /></tr></thead><tbody>{datasets.map((item) => <tr key={item.name}><td><span className="dataset-name-cell"><span className="csv-icon">CSV</span><span><b>{item.name}</b><small>{item.size}</small></span></span></td>{isAdmin && <td>{item.owner}</td>}<td>{item.rows}</td><td>{item.fields}</td><td><Status>{item.status}</Status></td><td>{item.date}</td><td><button className="text-button" onClick={() => onNavigate("/manager/datasets/active/overview")}>Explore <Icon name="arrow" size={14} /></button></td></tr>)}{datasets.length === 0 && <tr><td colSpan={isAdmin ? 7 : 6} className="empty-row">No datasets match “{search}”.</td></tr>}</tbody></table></div><div className="table-pagination"><span>Showing {datasets.length} of {datasets.length} datasets</span><div><button disabled>Previous</button><button className="page-number">1</button><button disabled>Next</button></div></div></section>
    <div className="data-note"><span className="info-icon"><Icon name="light" size={16} /></span><span><b>Keep your data dynamic.</b> Each dataset is profiled independently. Previously processed datasets open their existing results and never choose a future ML pipeline.</span></div>
  </>;
}

function ColumnsPage({ dataset }) {
  const columns = dataset?.columns || [
    { name: "session_id", type: "Categorical", nulls: 0, unique: 48290, min: "—", max: "—", mean: "—" },
    { name: "event_timestamp", type: "Date", nulls: 12, unique: 1348, min: "2026-07-01", max: "2026-10-06", mean: "—" },
    { name: "engagement_score", type: "Numeric", nulls: 24, unique: 86, min: 0, max: 100, mean: "62.41" },
    { name: "events_count", type: "Numeric", nulls: 7, unique: 42, min: 0, max: 245, mean: "18.37" },
    { name: "segment", type: "Categorical", nulls: 0, unique: 6, min: "—", max: "—", mean: "—" },
  ];
  return <><PageHeader eyebrow="DATASET INTELLIGENCE" title="Column profile" description={`Automatically detected schema for ${dataset?.name || "Customer behavior Q3.csv"}.`} /><div className="kpi-grid small-kpi-grid"><Kpi label="Total columns" value={dataset?.columns.length || "18"} change="Schema detected" icon="database" tone="violet" /><Kpi label="Numeric fields" value={dataset?.numericCount ?? "8"} change="Suitable for analysis" icon="chart" tone="blue" /><Kpi label="Categorical fields" value={dataset?.categoricalCount ?? "7"} change="Categories detected" icon="grid" tone="green" /><Kpi label="Date fields" value={dataset?.dateCount ?? "3"} change="Time features available" icon="activity" tone="orange" /></div><section className="panel data-table-panel"><div className="panel-heading table-panel-title"><div><h2>Data dictionary</h2><p>Column types and descriptive statistics</p></div><span className="demo-badge">AUTO-PROFILED</span></div><div className="table-scroll"><table className="wide-table"><thead><tr><th>COLUMN</th><th>DATA TYPE</th><th>NULLS</th><th>UNIQUE</th><th>MIN</th><th>MAX</th><th>MEAN</th></tr></thead><tbody>{columns.map((column) => <tr key={column.name}><td className="mono-cell">{column.name}</td><td><span className={`type-pill type-${column.type.toLowerCase()}`}><i />{column.type}</span></td><td>{column.nulls}</td><td>{formatNumber(column.unique)}</td><td>{column.min}</td><td>{column.max}</td><td>{column.mean}</td></tr>)}</tbody></table></div></section></>;
}

function PreviewPage({ dataset }) {
  const sample = dataset?.sample || [["S-10482", "2026-10-04 09:42", "73.2", "14", "Returning"], ["S-10483", "2026-10-04 09:45", "48.6", "8", "New"], ["S-10484", "2026-10-05 10:03", "91.4", "32", "Returning"], ["S-10485", "2026-10-05 10:17", "67.8", "19", "Loyal"], ["S-10486", "2026-10-05 11:21", "—", "3", "New"]];
  const heads = dataset?.columns.map((item) => item.name) || ["session_id", "event_timestamp", "engagement_score", "events_count", "segment"];
  return <><PageHeader eyebrow="DATASET INTELLIGENCE" title="Data preview" description={`A sample of rows from ${dataset?.name || "Customer behavior Q3.csv"}.`} /><section className="panel preview-panel"><div className="panel-heading"><div><h2>First rows</h2><p>Showing a preview of the original dataset · {formatNumber(dataset?.rows || 48290)} total records</p></div><span className="demo-badge">{dataset ? "UPLOADED CSV" : "DEMO DATA"}</span></div><div className="table-scroll"><table className="preview-table"><thead><tr>{heads.slice(0, 5).map((head) => <th key={head}>{head}<small>{dataset?.columns.find((column) => column.name === head)?.type || "STRING"}</small></th>)}</tr></thead><tbody>{sample.map((row, rowIndex) => <tr key={rowIndex}>{row.slice(0, Math.min(heads.length, 5)).map((value, index) => <td key={index} className={value === "—" ? "null-cell" : ""}>{value || "—"}</td>)}</tr>)}</tbody></table></div><div className="preview-footer">Sample rows <span>·</span> {dataset ? "Values loaded from uploaded CSV" : "Illustrative demo data"}</div></section></>;
}

function DatasetOverview({ dataset, onNavigate }) {
  const capabilities = dataset?.capabilities || ["Numerical analysis", "Correlation analysis", "Time analysis", "Clustering", "Anomaly detection"];
  return <>
    <PageHeader eyebrow="DATASET INTELLIGENCE" title={dataset?.name || "Customer behavior Q3.csv"} description="A data-driven overview. Profiling is based on detected columns, not a manually selected category." action={<Status>Processed</Status>} />
    <div className="kpi-grid small-kpi-grid"><Kpi label="Records" value={formatNumber(dataset?.rows || 48290)} change="Available for analysis" icon="database" tone="violet" /><Kpi label="Columns" value={dataset?.columns.length || "18"} change="Schema detected" icon="grid" tone="blue" /><Kpi label="Processing" value="Complete" change="Demo workspace" icon="activity" tone="green" /><Kpi label="Data source" value={dataset ? "Uploaded CSV" : "Demo data"} change="Automatic profile" icon="file" tone="orange" /></div>
    <div className="capability-layout">
      <section className="panel capability-panel"><div className="panel-heading"><div><h2>Detected characteristics</h2><p>Observed directly from the available dataset</p></div><span className="dynamic-pill"><Icon name="spark" size={13} /> AUTO-PROFILED</span></div><div className="profile-counts"><div><b>{dataset?.numericCount ?? 8}</b><span>Numeric fields</span></div><div><b>{dataset?.categoricalCount ?? 7}</b><span>Categorical fields</span></div><div><b>{dataset?.dateCount ?? 3}</b><span>Date fields</span></div><div><b>{dataset ? formatNumber(dataset.columns.reduce((sum, column) => sum + column.nulls, 0)) : "43"}</b><span>Empty values</span></div></div><div className="overview-divider" /><h3 className="capability-subtitle">Available analysis</h3><div className="capability-chips">{capabilities.map((capability) => <span key={capability}><span className="cap-check"><Icon name="check" size={12} /></span>{capability}</span>)}</div></section>
      <section className="panel dataset-actions"><div className="eyebrow">EXPLORE DATASET</div><h3>Go deeper into your data.</h3><p>Explore the automatically profiled schema, view source rows, or check data quality.</p>{[["Column profile", "Explore types and summary statistics", "columns"], ["Data preview", "Review the first rows in your file", "preview"], ["Cleaning summary", "Understand preparation stages", "cleaning"]].map(([label, hint, tab]) => <button key={tab} onClick={() => onNavigate(`/manager/datasets/active/${tab}`)}><span><b>{label}</b><small>{hint}</small></span><Icon name="arrow" size={15} /></button>)}</section>
    </div>
    <div className="data-note"><span className="info-icon"><Icon name="light" size={16} /></span><span><b>Dynamic ML routing.</b> Models and analytics capabilities are determined from dataset characteristics. No business category or model is hard-coded.</span></div>
  </>;
}

function CleaningPage({ dataset }) {
  const stages = [["Bronze", "Raw source data", "Complete"], ["Silver", "Validated & cleaned", "Complete"], ["Gold", "Analysis-ready table", "Complete"]];
  return <><PageHeader eyebrow="DATASET INTELLIGENCE" title="Cleaning summary" description="A transparent view of dataset preparation from ingestion through analysis." /><div className="pipeline-strip">{stages.map(([name, caption, state], index) => <div className="pipeline-stage" key={name}><span className="pipeline-number"><Icon name="check" size={15} /></span><b>{name}</b><small>{caption}</small><Status>{state}</Status>{index < 2 && <i className="pipeline-connector" />}</div>)}</div><div className="cleaning-grid">{[["Original records", formatNumber(dataset?.rows || 50000), "database"], ["Duplicates removed", "92", "activity"], ["Empty rows removed", "58", "close"], ["Invalid values fixed", "21", "check"]].map(([label, value, icon]) => <section className="panel cleaning-stat" key={label}><span className="cleaning-stat-icon"><Icon name={icon} size={17} /></span><span>{label}</span><b>{value}</b></section>)}</div><section className="panel final-records"><div><span className="eyebrow">GOLD LAYER · FINAL DATA</span><h2>{formatNumber(Math.max(0, (dataset?.rows || 50000) - 171))} <small>records ready for analysis</small></h2><p>Cleaning summary values are illustrative until connected to the processing API.</p></div><span className="demo-badge">DEMO VALUES</span></section></>;
}

function ProcessingPage({ dataset, onNavigate }) {
  return <section className="panel processing-card"><div className="processing-orb"><Icon name="spark" size={26} /></div><div className="eyebrow">DATASET PROCESSING</div><h1>Preparing your data</h1><p className="processing-subtitle">{dataset?.name || "Your dataset"} · AIDEIP is automatically profiling the data.</p><div className="processing-steps">{["Upload", "Ingestion", "Bronze processing", "Silver cleaning", "Dataset profiling"].map((step, index) => <div className="processing-step" key={step}><span className="step-check"><Icon name="check" size={14} /></span><span>{step}</span>{index < 4 && <i />}</div>)}</div><div className="profile-result"><span className="profile-result-icon"><Icon name="database" size={18} /></span><div><b>Dataset profiling complete</b><p>Capabilities were detected from the dataset schema.</p></div><button className="primary-button" onClick={() => onNavigate("/manager/datasets/active/overview")}>View results <Icon name="arrow" size={15} /></button></div><p className="processing-note">No dataset type or model selection is required.</p></section>;
}

function CopilotPage({ messages, input, setInput, onSend, isAdmin }) {
  const suggestions = isAdmin ? ["Which department has the most active datasets?", "Summarize current pipeline health", "What needs administrator attention?"] : ["Summarize my latest dataset", "Which patterns look unusual?", "What analysis is available for my data?"];
  return <><PageHeader eyebrow={isAdmin ? "ENTERPRISE-WIDE AI" : "DEPARTMENT-SCOPED AI"} title={isAdmin ? "Enterprise Copilot" : "AIDEIP Copilot"} description={isAdmin ? "Ask questions across enterprise data, departments, and platform activity." : "Ask questions about your workspace data and explore evidence-backed findings."} /><div className="copilot-layout"><section className="panel chat-panel"><div className="chat-top"><span className="copilot-mini"><Icon name="spark" size={17} /></span><div><b>AIDEIP Intelligence</b><small><i className="online-dot" /> Ready to help · {isAdmin ? "Enterprise scope" : "Manager scope"}</small></div><span className="demo-badge">DEMO</span></div><div className="chat-content">{messages.length === 0 ? <div className="chat-welcome"><div className="chat-welcome-icon"><Icon name="spark" size={22} /></div><h2>What would you like to understand?</h2><p>Ask a question about your data. Answers should be grounded in available evidence.</p><div className="suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setInput(suggestion)}>{suggestion}<Icon name="arrow" size={14} /></button>)}</div></div> : messages.map((message, index) => <div className={`chat-message ${message.from}`} key={index}><span className="chat-avatar">{message.from === "you" ? "OM" : <Icon name="spark" size={15} />}</span><div><b>{message.from === "you" ? "You" : "AIDEIP Copilot"}</b><p>{message.text}</p>{message.evidence && <small className="evidence-label">SOURCE · {message.evidence}</small>}</div></div>)}</div><form className="chat-compose" onSubmit={onSend}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question about your data..." /><button className="send-button" aria-label="Send message"><Icon name="arrow" size={17} /></button></form><div className="chat-disclaimer">AI-generated responses should be reviewed. Data connections are currently mocked.</div></section><aside className="copilot-side"><section className="panel scope-panel"><span className="scope-icon"><Icon name={isAdmin ? "building" : "database"} size={17} /></span><div className="eyebrow">CURRENT SCOPE</div><h3>{isAdmin ? "Enterprise-wide" : "Your workspace"}</h3><p>{isAdmin ? "Responses may reference cross-department demo information." : "Responses are limited to your department's connected datasets."}</p><div className="scope-line"><span className="online-dot" /> {isAdmin ? "Organization data" : "4 available datasets"}</div></section><section className="panel copilot-note"><span className="highlight-icon blue"><Icon name="light" size={16} /></span><b>Grounded in your data</b><p>Copilot responses will include source references when connected to your intelligence services.</p></section></aside></div></>;
}

function GenericPage({ title, role, dataset, onNavigate, onToast }) {
  const admin = role === "ADMIN";
  const descriptions = {
    Analytics: "Explore patterns and relationships detected from your dataset characteristics.",
    Predictions: "Predictions use an automatically selected model based on profiled data.",
    Anomalies: "Review records that differ from the observed dataset baseline.",
    "AI insights": "Observed signals, model outputs, and interpretations from your data.",
    "Root cause": "Explore contributing factors with supporting evidence.",
    Recommendations: "Prioritized next steps linked to observed data signals.",
    Reports: "Generate and review intelligence reports for your workspace.",
    Managers: "Manage platform users and their workspace access.",
    Departments: "Monitor registered departments across the enterprise.",
    Pipelines: "Track ingestion and processing jobs across datasets.",
    "ML models": "Monitor model performance and dynamic routing decisions.",
    "AI agents": "View the health and activity of enterprise intelligence agents.",
    "Enterprise analytics": "Compare platform activity across departments.",
    Alerts: "Review important events that may require administrator attention.",
    "System health": "Monitor platform services and connected data infrastructure.",
    Settings: "Manage profile, security, notifications, and workspace preferences.",
  };
  const capabilities = dataset?.capabilities || ["Numerical analysis", "Correlation analysis", "Time analysis", "Clustering", "Anomaly detection"];
  const count = admin ? "186" : "4";
  const cards = title === "Predictions" ? [["Problem type", "Automatically detected", "spark"], ["Model selection", "Dynamic ML Router", "branch"], ["Training records", dataset ? formatNumber(dataset.rows) : "48,290", "database"]] :
    title === "Anomalies" ? [["Detected", "37", "activity"], ["Critical", "2", "activity"], ["For review", "7", "file"]] :
      title === "System health" ? [["Backend API", "Operational", "heart"], ["Pipeline service", "Operational", "branch"], ["AI services", "Demo mode", "spark"]] :
        [["Available datasets", count, "database"], ["Detected capabilities", `${capabilities.length}`, "spark"], ["Analysis status", "Ready", "activity"]];
  return <>
    <PageHeader eyebrow={admin ? "ENTERPRISE INTELLIGENCE" : "DATA INTELLIGENCE"} title={title} description={descriptions[title] || `Explore ${title.toLowerCase()} across your ${admin ? "enterprise" : "workspace"}.`} action={["Reports", "Recommendations"].includes(title) && <button className="primary-button" onClick={() => onToast(`${title} generation started.`)}><Icon name="plus" size={16} /> {title === "Reports" ? "Generate report" : "Refresh recommendations"}</button>} />
    <div className="kpi-grid small-kpi-grid">{cards.map(([label, value, icon], index) => <Kpi key={label} label={label} value={value} change={index === 0 ? "DEMO DATA" : "Automatically derived"} icon={icon} tone={["violet", "blue", "green"][index]} />)}</div>
    {(title === "Analytics" || title === "Enterprise analytics") && <section className="panel trend-panel generic-chart-panel"><div className="panel-heading"><div><h2>Dataset activity</h2><p>Illustrative overview · Connect analytics service for live results</p></div><button className="select-button">Last 6 months <Icon name="down" size={14} /></button></div><LineChart /></section>}
    {title === "System health" ? <section className="panel service-list">{["Backend API", "MongoDB", "Databricks", "SQL Warehouse", "Pipeline Service", "ML Service", "AI Agent Service"].map((service, index) => <div key={service}><span className={`service-icon ${index < 2 ? "green" : "orange"}`}><Icon name={index === 4 ? "branch" : index === 6 ? "bot" : "database"} size={16} /></span><b>{service}</b><span className="service-description">{index < 2 ? "Connected and responding" : "Integration not connected"}</span><Status>{index < 2 ? "Online" : "Demo"}</Status></div>)}</section> : null}
    {title === "Pipelines" && <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent pipeline runs</h2><p>Latest dataset processing activity</p></div><span className="demo-badge">DEMO</span></div><div className="table-scroll"><table className="wide-table"><thead><tr><th>DATASET</th><th>PIPELINE</th><th>DURATION</th><th>STATUS</th><th>STARTED</th><th /></tr></thead><tbody>{["Customer behavior Q3.csv", "Regional operations.csv", "Support response data.csv"].map((name, index) => <tr key={name}><td>{name}</td><td>Dynamic profiling</td><td>{index ? "02m 14s" : "01m 48s"}</td><td><Status>{index === 2 ? "Processing" : "Processed"}</Status></td><td>{index ? "Oct 04, 2026" : "Oct 06, 2026"}</td><td><button className="text-button" onClick={() => onToast("Detailed pipeline logs require an API connection.")}>View logs</button></td></tr>)}</tbody></table></div></section>}
    <div className="capability-layout">
      <section className="panel capability-panel"><div className="panel-heading"><div><h2>{title === "Predictions" ? "Dynamic model selection" : title === "Anomalies" ? "Anomaly review" : title === "Recommendations" ? "Recommended actions" : title === "Root cause" ? "Contributing factors" : title === "Reports" ? "Available reports" : title === "Departments" ? "Registered departments" : title === "Managers" ? "Workspace managers" : title === "AI agents" ? "Agent activity" : "Available analysis"}</h2><p>{dataset ? `Dynamically generated from ${dataset.name}` : "Based on detected characteristics, not a selected dataset category"}</p></div><span className="dynamic-pill"><Icon name="spark" size={13} /> DYNAMIC</span></div>
        {title === "Predictions" ? <div className="model-card"><div className="model-icon"><Icon name="spark" size={18} /></div><div><span className="eyebrow">AUTOMATICALLY SELECTED</span><h3>Suitable model determined at runtime</h3><p>The Dynamic ML Router evaluates column types, data characteristics, and available targets. No manual model selection.</p></div><div className="model-status"><i className="online-dot" /> Ready</div></div> :
          title === "Anomalies" ? <div className="anomaly-list">{[["Record #10482", "Value differs from dataset baseline", "High", "Confidence 94%"], ["Record #10831", "Unusual combination of observed features", "Medium", "Confidence 87%"], ["Record #10907", "Outside the recent distribution range", "Low", "Confidence 78%"]].map(([id, reason, severity, confidence]) => <div className="anomaly-row" key={id}><span className={`severity-dot severity-${severity.toLowerCase()}`} /><div><b>{id}</b><p>{reason}</p></div><span className={`severity-label severity-text-${severity.toLowerCase()}`}>{severity}</span><small>{confidence}</small></div>)}</div> :
            title === "Recommendations" ? <div className="recommendation-row"><span className="recommend-number">01</span><div><span className="severity-label severity-text-high">HIGH PRIORITY</span><h3>Review records flagged by anomaly detection</h3><p>Inspect the 7 observations outside the current baseline before acting on them.</p><small>Evidence · Dataset anomaly analysis · Demo data</small></div><button className="secondary-button compact-button" onClick={() => onNavigate("/manager/anomalies")}>Review <Icon name="arrow" size={14} /></button></div> :
              title === "Reports" ? <div className="report-row"><span className="report-icon"><Icon name="file" size={19} /></span><div><b>Workspace intelligence summary</b><p>Overview · Dataset profile · Signals · Recommendations</p><small>Last updated Oct 06, 2026 · Demo report</small></div><button className="secondary-button compact-button" onClick={() => onToast("Report preview is available when report services are connected.")}>Preview</button></div> :
                title === "Root cause" ? <div className="root-flow"><div className="root-node root-problem"><span className="eyebrow">OBSERVED SIGNAL</span><b>Pattern requires investigation</b><small>Evidence will be derived from connected data</small></div><span className="root-connector">↓</span><div className="root-causes">{[["Data distribution", "Compare current and historical records"], ["Feature relationships", "Review correlated variables"], ["Temporal patterns", "Check for time-based changes"]].map(([name, desc]) => <div key={name}><span className="cause-bar" /><b>{name}</b><small>{desc}</small></div>)}</div><p className="evidence-note">No causal claims are made without supporting evidence.</p></div> :
                  title === "Departments" ? <div className="mini-departments">{["Operations", "Finance", "People", "Customer Success", "Product"].map((name, index) => <div key={name}><span className="department-avatar">{name.charAt(0)}</span><b>{name}</b><span>{[42, 38, 31, 27, 48][index]} datasets</span><Status>Active</Status></div>)}</div> :
                    <div className="capability-chips">{capabilities.map((capability) => <span key={capability}><span className="cap-check"><Icon name="check" size={12} /></span>{capability}</span>)}</div>}
      </section>
      <aside className="panel dynamic-info"><span className="dynamic-icon"><Icon name="spark" size={18} /></span><div className="eyebrow">DESIGNED FOR ANY DATA</div><h3>No assumptions about your columns.</h3><p>AIDEIP detects available analysis from dataset characteristics. Unsupported capabilities are not shown as results.</p><button className="text-button" onClick={() => onNavigate(role === "ADMIN" ? "/admin/datasets" : "/manager/datasets")}>Explore datasets <Icon name="arrow" size={14} /></button></aside>
    </div>
    {title === "ML models" && <section className="panel table-panel"><div className="panel-heading"><div><h2>Model registry</h2><p>Model suitability is evaluated dynamically for each dataset.</p></div></div><div className="empty-state"><div className="empty-icon"><Icon name="spark" size={21} /></div><b>Model service not connected</b><p>When connected, approved models and measured performance will appear here.</p></div></section>}
    {title === "Managers" && <section className="panel manager-tools"><div className="panel-heading"><div><h2>Manager access</h2><p>Manage role-scoped platform access.</p></div><button className="primary-button" onClick={() => onToast("Manager creation is available when the admin API is connected.")}><Icon name="plus" size={15} /> Add manager</button></div><div className="manager-demo-row"><div className="avatar">OM</div><div><b>Olivia Martin</b><small>olivia.martin@acme.com</small></div><span>Northstar Group</span><Status>Active</Status><button className="text-button" onClick={() => onToast("Manager actions require an admin API connection.")}>Manage</button></div></section>}
    {title === "Alerts" && <section className="panel alert-list">{[["HIGH", "Pipeline requires attention", "Support response data.csv · Processing delayed", "12 min ago"], ["MEDIUM", "Unusual data activity detected", "7 observations flagged for review", "1 hr ago"], ["INFO", "Dataset profiling completed", "Customer behavior Q3.csv · 18 columns", "3 hrs ago"]].map(([severity, titleText, detail, time]) => <div key={titleText}><span className={`alert-tag alert-${severity.toLowerCase()}`}>{severity}</span><div><b>{titleText}</b><p>{detail}</p></div><time>{time}</time><button className="text-button" onClick={() => onToast("Alert detail requires a backend connection.")}>View</button></div>)}</section>}
  </>;
}

export default App;
