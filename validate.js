/* Experiments 6 & 7: validation of the registration form */
// Fill the date-of-birth select boxes
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

/* ---- Experiment 6: name and password ---- */
function validateName(v) {
  v = v.trim();
  if (!/^[A-Za-z ]+$/.test(v)) return "Name must contain alphabets only";
  if (v.replace(/ /g, "").length < 6) return "Name must be at least 6 characters long";
  return "";
}
function validatePassword(v) {
  return v.length < 6 ? "Password must be at least 6 characters long" : "";
}
/* ---- Experiment 7: email and phone number ---- */
function validateEmail(v) {
  v = v.trim();
  if (/\s/.test(v)) return "E-mail must not contain spaces";
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(v) ? "" : "Enter a valid e-mail like name@domain.com";
}
function validatePhone(v) {
  return /^\d{10}$/.test(v) ? "" : "Phone number must contain exactly 10 digits";
}

function show(inputId, errId, msg) {
  $(errId).textContent = msg;
  const el = $(inputId); if (el) el.classList.toggle("invalid", !!msg);
  return !msg;
}

const form = $("registerForm");
const dobDate = () => ({ d: $("dobDay").value, m: $("dobMonth").value, y: $("dobYear").value });

// Live feedback while the user leaves a field
[["regName", "nameErr", validateName], ["regPassword", "passwordErr", validatePassword],
 ["regEmail", "emailErr", validateEmail], ["regPhone", "phoneErr", validatePhone]]
  .forEach(([id, err, fn]) => $(id).addEventListener("blur", () => show(id, err, fn($(id).value))));
$("regPhone").addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));

form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  ok = show("regName", "nameErr", validateName($("regName").value)) && ok;
  ok = show("regPassword", "passwordErr", validatePassword($("regPassword").value)) && ok;
  ok = show("regEmail", "emailErr", validateEmail($("regEmail").value)) && ok;
  ok = show("regPhone", "phoneErr", validatePhone($("regPhone").value)) && ok;
  ok = show(null, "sexErr", form.sex.value ? "" : "Please select your sex") && ok;
  const { d, m, y } = dobDate();
  let dobMsg = (!d || !m || !y) ? "Please select day, month and year" : "";
  if (!dobMsg && new Date(y, m - 1, d).getMonth() !== m - 1) dobMsg = "This date does not exist";
  ok = show(null, "dobErr", dobMsg) && ok;
  const langs = [...form.querySelectorAll('[name=lang]:checked')].map(c => c.value);
  ok = show(null, "langErr", langs.length ? "" : "Select at least one language") && ok;
  ok = show("regAddress", "addressErr", $("regAddress").value.trim().length < 10 ? "Please enter your full address" : "") && ok;
  if (!ok) { $("regMsg").textContent = ""; return; }

  // Demo only: password is never stored
  localStorage.setItem("glbBookUser", JSON.stringify({
    name: $("regName").value.trim(), email: $("regEmail").value.trim(), phone: $("regPhone").value,
    sex: form.sex.value, dob: `${d}-${m}-${y}`, languages: langs, address: $("regAddress").value.trim()
  }));
  $("regMsg").textContent = "Registration successful! Redirecting to login...";
  form.reset();
  setTimeout(() => location.href = "login.html", 1500);
});
form.addEventListener("reset", () => {
  document.querySelectorAll(".err").forEach(x => x.textContent = "");
  document.querySelectorAll(".invalid").forEach(x => x.classList.remove("invalid"));
});
