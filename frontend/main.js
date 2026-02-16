async function checkHealth() {
  const statusEl = document.getElementById("status");

  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    statusEl.textContent = `API status: ${data.status}`;
  } catch (error) {
    statusEl.textContent = "API status: error";
    console.error(error);
  }
}

document.getElementById("checkButton").addEventListener("click", checkHealth);

checkHealth();
