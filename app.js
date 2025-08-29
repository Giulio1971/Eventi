document.addEventListener("DOMContentLoaded", () => {
  const feeds = [
    { name: "Televideo", url: "https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml" }
  ];

  const container = document.getElementById("news");
  if (!container) {
    console.error("Elemento #news non trovato!");
    return;
  }

  // Create one <ul> for all news
  const list = document.createElement("ul");
  container.innerHTML = ""; // rimuove "Caricamento notizie..."
  container.appendChild(list);

  const sourceColors = {
    "Televideo": "#cceeff",
  };

  const highlightWords = ["Livorno", "Pisa", "Lucca", "Toscana"];
  let allItems = [];
  let lastSeenLinks = new Set();

  function renderItem(item) {
    const li = document.createElement("li");
    const combinedText = (item.title + " " + item.description).toLowerCase();
    const hasHighlight = highlightWords.some(w => combinedText.includes(w.toLowerCase()));

    li.style.backgroundColor = hasHighlight ? "#ffb6c1" : (sourceColors[item.source] || "#ffffff");

    const dateStr = item.pubDate.toLocaleString("it-IT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    li.innerHTML = `
      <a href="${item.link}" target="_blank"><b>${item.title}</b></a><br>
      <div>${item.description || ""}</div>
      <em style="color:#555; font-size:14px;">${dateStr}</em>
    `;

    list.appendChild(li);
  }

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
      allItems.sort((a, b) => b.pubDate - a.pubDate);
      list.innerHTML = "";
      allItems.forEach(renderItem);

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

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  loadNews();
  setInterval(loadNews, 300000);
});
