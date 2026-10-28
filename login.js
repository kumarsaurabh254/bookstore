$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("loginEmail").value.trim();
  const user = JSON.parse(localStorage.getItem("glbBookUser") || "null");
  if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
    $("loginMsg").style.color = "#b3261e";
    $("loginMsg").textContent = "No account found for this email. Please register first.";
    return;
  }
  $("loginMsg").style.color = "";
  $("loginMsg").textContent = "Welcome back, " + user.name + "! Opening the catalogue...";
  setTimeout(() => location.href = "catalogue.html", 1200);
});
