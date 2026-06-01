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
    const jsonText = testua.substring(testua.indexOf("{"), testua.lastIndexOf("}") + 1);
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

async function ordutegiaIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko ordutegia kargatzen...</p>`;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Ordutegiak`;

  try {
    const erantzuna = await fetch(url);
    const testua = await erantzuna.text();
    const jsonText = testua.substring(testua.indexOf("{"), testua.lastIndexOf("}") + 1);
    const json = JSON.parse(jsonText);

    let irudia = "";

    json.table.rows.forEach(row => {
      const taldeaSheet = row.c[0]?.v || "";
      const irudiaUrl = row.c[1]?.v || "";

      if (taldeaSheet === taldea) {
        irudia = irudiaUrl;
      }
    });

    if (irudia) {
      edukia.innerHTML = `
        <h2>${taldea} - Ordutegia</h2>
        <img src="${irudia}" class="irudiHandia">
      `;
    } else {
      edukia.innerHTML = `
        <h2>${taldea} - Ordutegia</h2>
        <p>Ez da ordutegirik aurkitu.</p>
      `;
    }

  } catch (error) {
    edukia.innerHTML = `
      <p>Ezin izan da ordutegia kargatu.</p>
      <small>${error}</small>
    `;
  }
}

async function kokalekuakIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko kokalekuak kargatzen...</p>`;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Kokalekuak`;

  try {
    const erantzuna = await fetch(url);
    const testua = await erantzuna.text();
    const jsonText = testua.substring(testua.indexOf("{"), testua.lastIndexOf("}") + 1);
    const json = JSON.parse(jsonText);

    let irudia = "";

    json.table.rows.forEach(row => {
      const taldeaSheet = row.c[0]?.v || "";
      const irudiaUrl = row.c[1]?.v || "";

      if (taldeaSheet === taldea) {
        irudia = irudiaUrl;
      }
    });

    if (irudia) {
      edukia.innerHTML = `
        <h2>${taldea} - Kokalekuak</h2>
        <img src="${irudia}" class="irudiHandia">
      `;
    } else {
      edukia.innerHTML = `
        <h2>${taldea} - Kokalekuak</h2>
        <p>Ez da kokalekurik aurkitu.</p>
      `;
    }

  } catch (error) {
    edukia.innerHTML = `
      <p>Ezin izan dira kokalekuak kargatu.</p>
      <small>${error}</small>
    `;
  }
}

async function partaideakIkusi(taldea) {
  const edukia = document.getElementById("edukia");
  edukia.innerHTML = `<p>${taldea} taldeko partaideak kargatzen...</p>`;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Partaideak`;

  try {
    const erantzuna = await fetch(url);
    const testua = await erantzuna.text();
    const jsonText = testua.substring(testua.indexOf("{"), testua.lastIndexOf("}") + 1);
    const json = JSON.parse(jsonText);

    let html = `
      <h2>${taldea} - Partaideak</h2>
      <input type="text" id="bilatzailea" placeholder="Bilatu izena edo abizena..." onkeyup="bilatuPartaideak()">
      <div id="partaideZerrenda">
    `;

    json.table.rows.forEach(row => {
      const id = row.c[0]?.v || "";
      const taldeaSheet = row.c[1]?.v || "";
      const izena = row.c[2]?.v || "";
      const abizenak = row.c[3]?.v || "";
      const tutorea = row.c[4]?.v || "";
      const telefonoa = row.c[5]?.v || "";
      const jakinBeharrekoa = row.c[6]?.v || "";
      const baimenak = row.c[7]?.v || "";

      if (taldeaSheet === taldea) {
        html += `
          <div class="txartela partaide-txartela">
            <h3>${izena} ${abizenak}</h3>
            <p><strong>Tutorea:</strong> ${tutorea}</p>
            <p><strong>Telefonoa:</strong> <a href="tel:${telefonoa}">${telefonoa}</a></p>
            <p><strong>Jakin beharrekoa:</strong> ${jakinBeharrekoa}</p>
            <p><strong>Baimenak:</strong> ${baimenak}</p>
            <small>ID: ${id}</small>
          </div>
        `;
      }
    });

    html += `</div>`;
    edukia.innerHTML = html;

  } catch (error) {
    edukia.innerHTML = `
      <p>Ezin izan dira partaideak kargatu.</p>
      <small>${error}</small>
    `;
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
