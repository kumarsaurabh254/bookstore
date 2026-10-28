/* Shared helpers: header, footer, toast, cart count (used on every page) */
const $ = id => document.getElementById(id);
const page = location.pathname.split("/").pop() || "index.html";
const inFrame = window.self !== window.top;

const NAV = [
  ["index.html", "Home"],
  ["catalogue.html", "Catalogue"],
  ["login.html", "Login"],
  ["register.html", "Registration"],
  ["about.html", "About"]
];

function notify(msg) {
  let t = $("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => t.classList.remove("show"), 2400);
}

function cartCount() {
  const cart = JSON.parse(localStorage.getItem("glbBookCart") || "[]");
  return cart.reduce((s, i) => s + i.qty, 0);
}
function updateCartBadge() { const c = $("cartCount"); if (c) c.textContent = cartCount(); }

function buildHeader() {
  const links = NAV.map(([href, label]) =>
    `<a href="${href}"${href === page ? ' class="active"' : ""}>${label}</a>`).join("");
  return `<header class="header">
    <a class="college-brand" href="index.html" aria-label="GL Bajaj Book Store home">
      <img class="college-logo-img" src="gl_bajaj_logo.jpg" alt="GL Bajaj logo">
      <span class="college-name">GL Bajaj Institute of Technology and Management</span>
    </a>
    <nav id="nav">${links}</nav>
    <div class="header-buttons"><a class="cart-btn" href="cart.html">Cart <span id="cartCount">0</span></a></div>
    <button class="menu-btn" id="menuToggle" aria-label="Open menu">☰</button>
  </header>`;
}

function buildFooter() {
  return `<footer class="footer">
    <div class="footer-top">
      <div class="footer-college">
        <img class="college-logo-img footer-logo" src="gl_bajaj_logo.jpg" alt="GL Bajaj logo">
        <div><strong>GL Bajaj Institute of Technology and Management</strong><p>Campus Book Store · Student Project</p></div>
      </div>
      <div class="student-info">
        <p><b>Name:</b> Saurabh Kumar</p>
        <p><b>Roll No.:</b> <span>2501920110337</span></p>
        <a href="https://github.com/kumarsaurabh254" target="_blank" rel="noopener noreferrer">github.com/kumarsaurabh254↗</a>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} GL Bajaj Book Store</span><a href="#">Back to top ↑</a></div>
  </footer>`;
}

/* Inside the 3-frame homepage the top frame already shows the header */
if (!inFrame && !document.body.hasAttribute("data-no-header")) document.body.insertAdjacentHTML("afterbegin", buildHeader());
if (!document.body.hasAttribute("data-no-footer")) document.body.insertAdjacentHTML("beforeend", buildFooter());

const mt = $("menuToggle");
if (mt) mt.addEventListener("click", () => $("nav").classList.toggle("open"));
updateCartBadge();
