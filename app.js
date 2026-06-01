const SHEET_ID = "14HT9OC7slKCsJrVNCLMcTaJPPYDfcgw3VKhLMO-6Xfo";

function erakutsiAtala(atala) {
  const edukia = document.getElementById("edukia");

  if (atala === "hasiera") {
    edukia.innerHTML = `<h2>Ongi etorri!</h2><p>Kirolez Blai 2026 langileentzako aplikazioa.</p>`;
  }

  if (atala === "abisuak") kargatuAbisuak();

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
    edukia.innerHTML = `<h2>Dokumentuak</h2><p>Laster dokumentuak hemen agertuko dira.</p>`;
  }

  if (atala === "protokoloak") {
    edukia.innerHTML = `<h2>Protokoloak</h2><p>Laster protokoloak hemen agertuko dira.</p>`;
  }
}

async function sheetKargatu(sheetIzena) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetIzena}`;
  const erantzuna = await fetch(url);
  const testua = await erantzuna.text();
  const jsonText = testua.substring(testua.indexOf("{"), testua.lastIndexOf("}") + 1);
  return JSON.parse(jsonText);
}

function gelaxka(row, index) {
  return row.c[index]?.v || "";
}

async function kargatuAbisuak() {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = "<p>Abisuak kargatzen...</p>";

  try {
    const json = await sheetKargatu("Abisuak");
    let html = "<h2>📢 Abisuak</h2>";

    json.table.rows.forEach(row => {
      const data = gelaxka(row, 0);
      const izenburua = gelaxka(row, 1);
      const mezua = gelaxka(row, 2);
      const taldea = gelaxka(row, 3);

      if (izenburua || mezua) {
        html += `
          <div class="txartela">
            <h3>${izenburua}</h3>
            <p>${mezua}</p>
            <small>${data} · ${taldea}</small>
          </div>
        `;
      }
    });

    edukia.innerHTML = html;
  } catch (error) {
    edukia.innerHTML = `<p>Ezin izan dira abisuak kargatu.</p><small>${error}</small>`;
  }
}

async function ordutegiaIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko ordutegia kargatzen...</p>`;

  try {
    const json = await sheetKargatu("Ordutegiak");
    let irudia = "";

    json.table.rows.forEach(row => {
      if (gelaxka(row, 0) === taldea) irudia = gelaxka(row, 1);
    });

    edukia.innerHTML = irudia
      ? `<h2>${taldea} - Ordutegia</h2><img src="${irudia}" class="irudiHandia">`
      : `<h2>${taldea} - Ordutegia</h2><p>Ez da ordutegirik aurkitu.</p>`;
  } catch (error) {
    edukia.innerHTML = `<p>Ezin izan da ordutegia kargatu.</p><small>${error}</small>`;
  }
}

async function kokalekuakIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko kokalekuak kargatzen...</p>`;

  try {
    const json = await sheetKargatu("Kokalekuak");
    let irudia = "";

    json.table.rows.forEach(row => {
      if (gelaxka(row, 0) === taldea) irudia = gelaxka(row, 1);
    });

    edukia.innerHTML = irudia
      ? `<h2>${taldea} - Kokalekuak</h2><img src="${irudia}" class="irudiHandia">`
      : `<h2>${taldea} - Kokalekuak</h2><p>Ez da kokalekurik aurkitu.</p>`;
  } catch (error) {
    edukia.innerHTML = `<p>Ezin izan dira kokalekuak kargatu.</p><small>${error}</small>`;
  }
}

async function partaideakIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko partaideak kargatzen...</p>`;

  try {
    const json = await sheetKargatu("Partaideak");

    let html = `
      <h2>${taldea} - Partaideak</h2>
      <input type="text" id="bilatzailea" placeholder="Bilatu izena..." onkeyup="bilatuPartaideak()">
      <div id="partaideZerrenda">
    `;

    json.table.rows.forEach(row => {
      const id = gelaxka(row, 0);
      const taldeaSheet = gelaxka(row, 1);
      const izena = gelaxka(row, 2);
      const tutorea = gelaxka(row, 3);
      const telefonoa = gelaxka(row, 4);
      const alergiak = gelaxka(row, 5);
      const beldurrak = gelaxka(row, 6);
      const baimenak = gelaxka(row, 7);

      if (taldeaSheet === taldea && izena) {
        html += `
          <div class="txartela partaide-txartela">
            <h3>${izena}</h3>
            <p><strong>Tutorea:</strong> ${tutorea}</p>
            <p><strong>Telefonoa:</strong> <a href="tel:${telefonoa}">${telefonoa}</a></p>
            <p><strong>Alergiak:</strong> ${alergiak}</p>
            <p><strong>Beldurrak:</strong> ${beldurrak}</p>
            <p><strong>Baimenak:</strong> ${baimenak}</p>
            <small>ID: ${id}</small>
          </div>
        `;
      }
    });

    html += `</div>`;
    edukia.innerHTML = html;
  } catch (error) {
    edukia.innerHTML = `<p>Ezin izan dira partaideak kargatu.</p><small>${error}</small>`;
  }
}

function bilatuPartaideak() {
  const input = document.getElementById("bilatzailea").value.toLowerCase();
  const txartelak = document.querySelectorAll(".partaide-txartela");

  txartelak.forEach(txartela => {
    const testua = txartela.innerText.toLowerCase();
    txartela.style.display = testua.includes(input) ? "block" : "none";
  });
}

function asistentziaIkusi(taldea) {
  document.getElementById("edukia").innerHTML = `
    <h2>${taldea} - Asistentzia</h2>
    <p>Hemen asistentzia markatzeko aukera egongo da.</p>
  `;
}
