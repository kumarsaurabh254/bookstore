/* Books data, catalogue table (Exp 3) and shopping cart (Exp 4) */
const books = [
{id:1,title:"Computer Fundamentals",author:"P. K. Sinha",publisher:"BPB Publications",category:"Engineering",price:399,bg:"#d7e4ce",ink:"#244b37",short:"CF",img:"https://covers.openlibrary.org/b/isbn/9788176567527-L.jpg"},
{id:2,title:"Data Structures & Algorithms",author:"Reema Thareja",publisher:"Oxford University Press",category:"Coding",price:549,bg:"#315b45",ink:"#f6f3e7",short:"DS",img:"https://covers.openlibrary.org/b/isbn/9780198099307-L.jpg"},
{id:3,title:"Let Us C",author:"Yashavant Kanetkar",publisher:"BPB Publications",category:"Coding",price:325,bg:"#e6a078",ink:"#263d2d",short:"C",img:"assets/let-us-c.svg"},
{id:4,title:"Engineering Mathematics",author:"B. S. Grewal",publisher:"Khanna Publishers",category:"Engineering",price:625,bg:"#e5e1d2",ink:"#2d4939",short:"∑",img:"assets/engineering-mathematics.svg"},
{id:5,title:"Quantitative Aptitude",author:"R. S. Aggarwal",publisher:"S. Chand Publishing",category:"Aptitude",price:475,bg:"#ffcc3f",ink:"#512912",short:"Q",img:"assets/quantitative-aptitude.svg"},
{id:6,title:"The Alchemist",author:"Paulo Coelho",publisher:"HarperOne",category:"Fiction",price:249,bg:"#d8c7a7",ink:"#55452d",short:"A",img:"https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg"},
{id:7,title:"Operating System Concepts",author:"Silberschatz et al.",publisher:"Wiley",category:"Engineering",price:699,bg:"#c8d8dc",ink:"#244653",short:"OS",img:"https://covers.openlibrary.org/b/isbn/9781119456339-L.jpg"},
{id:8,title:"Clean Code",author:"Robert C. Martin",publisher:"Prentice Hall",category:"Coding",price:599,bg:"#e8d6d0",ink:"#613e38",short:"{}",img:"https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"}
];
let category = "All";
let cart = JSON.parse(localStorage.getItem("glbBookCart") || "[]");
const money = n => "₹" + n.toLocaleString("en-IN");
const find = id => books.find(b => b.id === id);
const total = () => cart.reduce((s, i) => s + find(i.id).price * i.qty, 0);

function saveCart() { localStorage.setItem("glbBookCart", JSON.stringify(cart)); updateCartBadge(); renderCart(); }
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart(); notify("Book added to cart");
}

/* ---------- Experiment 3: Catalogue table ---------- */
function coverCell(b) {
  return `<div style="position:relative;width:62px;height:84px">
    <div class="thumb-fallback" style="background:${b.bg};color:${b.ink}">${b.short}</div>
    <img class="thumb" style="position:absolute;inset:0" src="${b.img}" alt="Cover of ${b.title}" loading="lazy" onerror="this.remove()">
  </div>`;
}
function renderBooks() {
  const body = $("bookRows"); if (!body) return;
  const q = $("searchInput").value.trim().toLowerCase();
  const shown = books.filter(b => (category === "All" || b.category === category) &&
    `${b.title} ${b.author} ${b.publisher} ${b.category}`.toLowerCase().includes(q));
  body.innerHTML = shown.map(b => `<tr>
    <td>${coverCell(b)}</td><td><strong>${b.title}</strong></td><td>${b.author}</td>
    <td>${b.publisher}</td><td>${b.category}</td><td><strong>${money(b.price)}</strong></td>
    <td><button class="btn-sm" data-add="${b.id}">Add to cart</button></td></tr>`).join("");
  $("emptyState").classList.toggle("hidden", shown.length > 0);
}
if ($("bookRows")) {
  $("categoryFilters").addEventListener("click", e => {
    const b = e.target.closest("[data-category]"); if (!b) return;
    category = b.dataset.category;
    document.querySelectorAll(".filter").forEach(x => x.classList.toggle("active", x === b));
    renderBooks();
  });
  $("searchInput").addEventListener("input", renderBooks);
  $("bookRows").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) addToCart(Number(b.dataset.add)); });
  renderBooks();
}

/* ---------- Experiment 4: Shopping cart page ---------- */
function renderCart() {
  const body = $("cartRows"); if (!body) return;
  const empty = cart.length === 0;
  $("cartEmpty").classList.toggle("hidden", !empty);
  $("cartContent").classList.toggle("hidden", empty);
  body.innerHTML = cart.map(i => { const b = find(i.id); return `<tr>
    <td>${coverCell(b)}</td><td><strong>${b.title}</strong><br><small>${b.author}</small></td>
    <td>${money(b.price)}</td>
    <td><div class="qty-control"><button data-qty="${b.id}" data-change="-1" aria-label="Decrease">−</button><span>${i.qty}</span><button data-qty="${b.id}" data-change="1" aria-label="Increase">+</button></div></td>
    <td><strong>${money(b.price * i.qty)}</strong></td>
    <td><button class="btn-sm" data-remove="${b.id}">Remove</button></td></tr>`; }).join("");
  $("cartTotal").textContent = money(total());
  $("checkoutTotal").textContent = money(total());
}
if ($("cartRows")) {
  $("cartRows").addEventListener("click", e => {
    const q = e.target.closest("[data-qty]"), r = e.target.closest("[data-remove]");
    if (q) { cart.find(x => x.id === Number(q.dataset.qty)).qty += Number(q.dataset.change); cart = cart.filter(x => x.qty > 0); saveCart(); }
    if (r) { cart = cart.filter(x => x.id !== Number(r.dataset.remove)); saveCart(); }
  });
  $("clearCart").addEventListener("click", () => { cart = []; saveCart(); });
  const user = JSON.parse(localStorage.getItem("glbBookUser") || "null");
  if (user) { $("customerName").value = user.name; $("customerEmail").value = user.email; }
  $("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!cart.length) return notify("Your cart is empty");
    const orderId = "GLB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const orders = JSON.parse(localStorage.getItem("glbBookOrders") || "[]");
    orders.push({ orderId, name: $("customerName").value, email: $("customerEmail").value, delivery: $("deliveryType").value, cart, total: total(), date: new Date().toISOString() });
    localStorage.setItem("glbBookOrders", JSON.stringify(orders));
    cart = []; saveCart(); $("checkoutForm").reset();
    $("checkoutMessage").textContent = `Demo order ${orderId} placed. No payment was collected.`;
    notify(`Order ${orderId} placed successfully`);
  });
  renderCart();
}
