// Lista dei feed RSS
const feeds = [
  { name: "Televideo", url: "https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml" }
];

const container = document.getElementById("news");

// Create one <ul> for all news
const list = document.createElement("ul");
container.appendChild(list);

// Colore di sfondo base per la fonte
const sourceColors = {
  "Televideo": "#cceeff",   // celeste chiaro
};

// Parole che attivano lo sfondo rosa
const highlightWords = ["Livorno", "Pisa", "Lucca", "Toscana"];

let allItems = [];
let lastSeenLinks = new Set();

// --- Funzione rendering singola notizia ---
function renderItem(item) {
  const li = document.createElement("li");

  // Controllo parole chiave per sfondo rosa
  const combinedText = (item.title + " " + item.description).toLowerCase();
  const hasHighlight = highlightWords.some(w => combinedText.includes(w.toLowerCase()));

  li.style.backgroundColor = hasHighlight ? "#ffb6c1" : (sourceColors[item.source] || "#ffffff");
  li.style.padding = "12px";
  li.style.borderRadius = "8px";
  li.style.marginBottom = "8px";
  li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

  // Formattazione data/ora
  const dateStr = item.pubDate.toLocaleString("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  li.innerHTML = `
    <a href="${item.link}" target="_blank" style="color:#000; text-decoration:none; font-weight:bold;">
      ${item.title}
    </a><br>
    <div style="color:#000; margin-top:4px;">
      ${item.description || ""}
    </div><br>
    <em style="color:#555; font-size:14px;">
      ${dateStr}
    </em>
  `;

  list.appendChild(li);
}

// --- Caricamento notizie ---
function loadNews() {
  Promise.all(
    feeds.map(feed => {
      return fetch(feed.url)
        .then(res => res.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
          const items = [...data.querySelectorAll("item")];
          return items.map(item => ({
            title: item.querySelector("title")?.textContent || "",
            description: item.querySelector("description")?.textContent || "",
            link: item.querySelector("link")?.textContent || "",
            pubDate: new Date(item.querySelector("pubDate")?.textContent || Date.now()),
            source: feed.name
          }));
        })
        .catch(err => {
          console.error("Errore nel caricare", feed.name, err);
          return [];
        });
    })
  ).then(results => {
    allItems = results.flat();

    // Ordinamento cronologico inverso
    allItems.sort((a, b) => b.pubDate - a.pubDate);

    // Reset lista
    list.innerHTML = "";

    // Rendering di tutte le notizie
    allItems.forEach(renderItem);

    // --- Notifiche nuove notizie ---
    const newLinks = allItems.map(n => n.link);
    const unseen = newLinks.filter(link => !lastSeenLinks.has(link));

    if (unseen.length > 0 && Notification.permission === "granted") {
      new Notification("Nuove notizie disponibili!", {
        body: `${unseen.length} nuovi articoli`,
        icon: "https://cdn-icons-png.flaticon.com/512/21/21601.png"
      });
    }
    lastSeenLinks = new Set(newLinks);
  });
}

// --- Richiesta permesso notifiche ---
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Caricamento iniziale
loadNews();

// Refresh ogni 5 minuti
setInterval(loadNews, 300000);
