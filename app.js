async function loadNews() {
  const newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "<p style='text-align:center;'>⏳ Caricamento notizie in corso...</p>";

  const feedUrl = encodeURIComponent("https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml");
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("HTTP error " + response.status);

    const data = await response.json();
    const items = data.items;

    if (!items || items.length === 0) {
      newsDiv.innerHTML = "<p style='text-align:center; color:#555;'>Nessuna notizia disponibile.</p>";
      return;
    }

    const ul = document.createElement("ul");
    const highlightWords = ["Livorno", "Pisa", "Lucca", "Toscana"];

    items.forEach(item => {
      const title = item.title || "Senza titolo";
      const description = item.description || "";
      );

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${title}</strong><br><br>
        ${description}<br>
        </em>
      `;

      if (highlightWords.some(w => (title + " " + description).toLowerCase().includes(w.toLowerCase()))) {
        li.style.backgroundColor = "#ffe6f2"; // rosa chiaro
      } else {
        li.style.backgroundColor = "#e6f0ff"; // celeste chiaro
      }

      li.style.padding = "12px";
      li.style.borderRadius = "8px";
      li.style.marginBottom = "8px";
      li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

      ul.appendChild(li);
    });

    newsDiv.innerHTML = "";
    newsDiv.appendChild(ul);

  } catch (error) {
    newsDiv.innerHTML = "<p style='color:red; text-align:center;'>⚠️ Errore nel caricamento delle notizie</p>";
    console.error("Errore fetch:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
