async function loadNews() {
  const newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "<p style='text-align:center;'>⏳ Caricamento notizie in corso...</p>";

  try {
    // Fetch the RSS XML
    const response = await fetch("https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml");
    if (!response.ok) throw new Error("HTTP error " + response.status);

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const items = xmlDoc.querySelectorAll("item");
    if (!items.length) {
      newsDiv.innerHTML = "<p style='text-align:center; color:#555;'>Nessuna notizia disponibile.</p>";
      return;
    }

    const ul = document.createElement("ul");
    const highlightWords = ["Livorno", "Pisa", "Lucca", "Toscana"];

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Senza titolo";
      const description = item.querySelector("description")?.textContent || "";

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${title}</strong><br>
        <div style="margin-top:6px;">${description}</div>
      `;

      // Highlight background if contains keywords
      if (highlightWords.some(w => (title + " " + description).toLowerCase().includes(w.toLowerCase()))) {
        li.style.backgroundColor = "#ffe6f2"; // pink
      } else {
        li.style.backgroundColor = "#e6f0ff"; // light blue
      }

      ul.appendChild(li);
    });

    newsDiv.innerHTML = ""; // remove loading message
    newsDiv.appendChild(ul);

  } catch (error) {
    newsDiv.innerHTML = "<p style='color:red; text-align:center;'>⚠️ Errore nel caricamento delle notizie</p>";
    console.error("Errore fetch:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
