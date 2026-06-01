const SHEET_ID = "14HT9OC7slKCsJrVNCLMcTaJPPYDfcgw3VKhLMO-6Xfo";

function erakutsiAtala(atala) {
  const edukia = document.getElementById("edukia");

  if (atala === "hasiera") {
    edukia.innerHTML = `
      <h2>Ongi etorri!</h2>
      <p>Kirolez Blai 2026 langileentzako aplikazioa.</p>
    `;
  }

  if (atala === "abisuak") {
    kargatuAbisuak();
  }

  if (["LH3", "LH4", "LH5", "DBH"].includes(atala)) {
    edukia.innerHTML = `
      <h2>${atala}</h2>

      <button onclick="ordutegiaIkusi('${atala}')">📅 Ordutegia</button>
      <button onclick="kokalekuakIkusi('${atala}')">📍 Kokalekuak</button>
      <button onclick="partaideakIkusi('${atala}')">👥 Partaideak</button>
      <button onclick="asistentziaIkusi('${atala}')">✅ Asistentzia</button>
    `;
  }

  if (atala === "dokumentuak") {
    edukia.innerHTML = `
      <h2>Dokumentuak</h2>
      <p>Laster dokumentuak hemen agertuko dira.</p>
    `;
  }

  if (atala === "protokoloak") {
    edukia.innerHTML = `
      <h2>Protokoloak</h2>
      <p>Laster protokoloak hemen agertuko dira.</p>
    `;
  }
}

async function kargatuAbisuak() {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = "<p>Abisuak kargatzen...</p>";

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Abisuak`;

  try {
    const erantzuna = await fetch(url);
    const testua = await erantzuna.text();

    const jsonText = testua.substring(
      testua.indexOf("{"),
      testua.lastIndexOf("}") + 1
    );

    const json = JSON.parse(jsonText);

    let html = "<h2>📢 Abisuak</h2>";

    json.table.rows.forEach(row => {
      const data = row.c[0]?.v || "";
      const izenburua = row.c[1]?.v || "";
      const mezua = row.c[2]?.v || "";
      const taldea = row.c[3]?.v || "";

      html += `
        <div class="txartela">
          <h3>${izenburua}</h3>
          <p>${mezua}</p>
          <small>${data} · ${taldea}</small>
        </div>
      `;
    });

    edukia.innerHTML = html;

  } catch (error) {
    edukia.innerHTML = `
      <p>Ezin izan dira abisuak kargatu.</p>
      <small>${error}</small>
    `;
  }
}

function ordutegiaIkusi(taldea) {
  document.getElementById("edukia").innerHTML = `
    <h2>${taldea} - Ordutegia</h2>
    <p>Hemen talde honen ordutegia agertuko da.</p>
  `;
}

function kokalekuakIkusi(taldea) {
  document.getElementById("edukia").innerHTML = `
    <h2>${taldea} - Kokalekuak</h2>
    <p>Hemen talde honen kokalekuak agertuko dira.</p>
  `;
}

function partaideakIkusi(taldea) {
  document.getElementById("edukia").innerHTML = `
    <h2>${taldea} - Partaideak</h2>
    <p>Hemen talde honetako partaideak agertuko dira.</p>
  `;
}

function asistentziaIkusi(taldea) {
  document.getElementById("edukia").innerHTML = `
    <h2>${taldea} - Asistentzia</h2>
    <p>Hemen asistentzia markatzeko aukera egongo da.</p>
  `;
}
