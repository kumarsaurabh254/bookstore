/* Experiment 5: registration form (no validation here; validation code of Exp 6 & 7 lives in validate.js, not loaded) */
(function fillDob() {
  const d = $("dobDay"), m = $("dobMonth"), y = $("dobYear");
  d.innerHTML = '<option value="">Day</option>';
  for (let i = 1; i <= 31; i++) d.innerHTML += `<option value="${i}">${i}</option>`;
  m.innerHTML = '<option value="">Month</option>' +
    ["January","February","March","April","May","June","July","August","September","October","November","December"]
      .map((n, i) => `<option value="${i + 1}">${n}</option>`).join("");
  y.innerHTML = '<option value="">Year</option>';
  for (let i = new Date().getFullYear() - 10; i >= 1960; i--) y.innerHTML += `<option value="${i}">${i}</option>`;
})();

$("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  localStorage.setItem("glbBookUser", JSON.stringify({
    name: $("regName").value.trim() || "Student", email: $("regEmail").value.trim(),
    phone: $("regPhone").value, sex: f.sex.value,
    dob: `${$("dobDay").value}-${$("dobMonth").value}-${$("dobYear").value}`,
    languages: [...f.querySelectorAll("[name=lang]:checked")].map(c => c.value),
    address: $("regAddress").value.trim()
  }));
  $("regMsg").textContent = "Registration successful! Redirecting to login...";
  f.reset();
  setTimeout(() => location.href = "login.html", 1500);
});
