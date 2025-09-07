// Lista completa dei feed RSS (ordine importante)
const feeds = [
  { name: "Livorno", url: "https://politepol.com/fd/7FAzGNxzlGrH.xml" },
  { name: "Pisa", url: "https://politepol.com/fd/kWox2Fs7UboR.xml" },
  { name: "Firenze", url: "https://politepol.com/fd/3iwGLQs5Exvu.xml" },
  { name: "Fiere", url: "https://politepol.com/fd/2IMJC9CIwzZS.xml" },
  { name: "Versilia", url: "https://politepol.com/fd/3lqUBIRZX9fV.xml" }
];

// Colori diversi per i feed
const sourceColors = {
  "Livorno": "#C9E2F8",
  "Pisa": "#D4F8C9",
  "Firenze": "#F8E2C9",
  "Fiere": "#E2C9F8",
  "Versilia": "#F8C9D4"
};

const container = document.getElementById("news");
const list = document.createElement("ul");
container.appendChild(list);

let allItems = [];

// --- Rendering notizie ---
function renderAllNews() {
  list.innerHTML = "";
  allItems.forEach(item => {
    const li = document.createElement("li");
    li.style.backgroundColor = sourceColors[item.source] || "#EEEEEE";

    const description = item.description || "";
    const safeDescription = description.replace(/(<([^>]+)>)/gi, ""); // rimuove HTML
    const shortDesc = safeDescription.length > 300 ? safeDescription.substring(0, 300) + "..." : safeDescription;

    li.innerHTML = `
      <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
      <div class="news-desc">${shortDesc}</div>
      <div class="news-source">${item.source}</div>
    `;

    list.appendChild(li);
  });
}

// --- Caricamento notizie ---
function loadNews() {
  Promise.all(
    feeds.map(feed => {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      return fetch(apiUrl)
        .then(res => res.json())
        .then(data =>
          (data.items || []).map(item => {
            return {
              title: item.title || "Titolo mancante",
              link: item.link || "#",
              description: item.description || "",
              pubDate: new Date(item.pubDate || Date.now()),
              source: feed.name
            };
          })
        )
        .catch(err => {
          console.error("Errore nel caricare", feed.name, err);
          return [];
        });
    })
  ).then(results => {
    // Mantiene l’ordine dei feed come dichiarato sopra
    allItems = results.flat();
    renderAllNews();
  });
}

// Caricamento iniziale
loadNews();

// Refresh ogni 5 minuti
setInterval(loadNews, 300000);
