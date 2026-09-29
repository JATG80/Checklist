// ====== Mostrar textarea dinámico y conservar contenido ======
    const selects = document.querySelectorAll('.turno');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            let textarea = this.parentNode.querySelector(`.comentario[data-id="${this.dataset.id}"]`);
            if (!textarea) {
                textarea = document.createElement('textarea');
                textarea.classList.add('form-control', 'comentario', 'mt-2');
                textarea.placeholder = 'Agrega tus comentarios aquí...';
                textarea.setAttribute('data-id', this.dataset.id);
                this.parentNode.appendChild(textarea);
            }
            // Mantener textarea visible siempre, incluso si es OK
        });
    });

    // ====== Firma ======
    const canvas = document.getElementById("signature-pad");
    const signaturePad = new SignaturePad(canvas);
    document.getElementById("limpiar-firma").onclick = () => signaturePad.clear();

    // ====== Nombre de archivo ======
    function generarNombreArchivo(base) {
        const sala = (document.getElementById("sala")?.value || "SIN_SALA").trim().replace(/\s+/g, "_");
        const ahora = new Date();
        const fecha = ahora.toISOString().slice(0,10);
        const hora = ahora.toTimeString().slice(0,8).replace(/:/g, "-");
        return `${base}${sala}_${fecha}_${hora}`;
    }

    // ====== Generar checklist para PDF/JPG ======
    function generarChecklistFormato() {
        const cont = document.getElementById("reporte-checklist");
        cont.style.display = "block";

        cont.innerHTML = `
            <h2>CHECKLIST VISITA SUPERVISIÓN</h2>
            <hr>
            <table>
                <tr><td class="header-cell">Sala:</td><td>${document.getElementById("sala")?.value || ""}</td></tr>
                <tr><td class="header-cell">Total máquinas rentadas:</td><td>${document.getElementById("maquinas")?.value || ""}</td></tr>
                <tr><td class="header-cell">Turno:</td><td>${document.getElementById("turno")?.value || ""}</td></tr>
                <tr><td class="header-cell">Responsable:</td><td>${document.getElementById("nombre")?.value || ""}</td></tr>
            </table>
            <br>
            <table border="1" style="border-collapse:collapse; width:100%; text-align:center;">
                <thead>
                    <tr style="background:#2f56a6">
                        <th>Item</th>
                        <th>Revisado</th>
                        <th>Comentarios</th>
                    </tr>
                </thead>
                <tbody id="tabla-checklist"></tbody>
            </table>
            <br><br>
            <div style="display:flex; justify-content:center; align-items:center; flex-direction:column; text-align:center;">
                <img id="rep-firma" style="width:200px; margin-bottom:5px;">
                <div style="margin-bottom:3px; font-weight:bold;">${document.getElementById("nombre")?.value || ""}</div>
                <div style="margin-bottom:3px; font-weight:bold;">${document.getElementById("puesto")?.value || ""}</div>
                <div>Nombre, firma y puesto</div>
            </div>
        `;

        const items = [
            { label: "Alineación de máquinas", id: "alineacion-terminales" },
            { label: "Limpieza de muebles", id: "limpieza-muebles" },
            { label: "Revisión touch y audio", id: "revision-touch-audio" },
            { label: "Limpieza de botoneras", id: "limpieza-botoneras" },
            { label: "Degradación LED", id: "revision-degradacion-leds" },
            { label: "Detalles estéticos", id: "revision-detalles-esteticos" },
            { label: "Placas NOM", id: "revision-placas" },
            { label: "Estructuras de signs", id: "revision-estructuras" },
            { label: "Alineación pantallas", id: "alineacion-pantallas" },
            { label: "Cinta gaffer", id: "cinta-gaffer" },
        ];

        const tbody = document.getElementById("tabla-checklist");
        items.forEach(i => {
            const select = document.querySelector(`.turno[data-id="${i.id}"]`);
            const valSelect = select ? select.value : "";

            const textarea = document.querySelector(`.comentario[data-id="${i.id}"]`);
            const valComentario = textarea ? textarea.value.replace(/\n/g, "<br>") : "";

            tbody.innerHTML += `
                <tr>
                    <td style="text-align:center;" class="header-cell">${i.label}</td>
                    <td style="text-align:center;">${valSelect}</td>
                    <td style="text-align:left;">${valComentario}</td>
                </tr>
            `;
        });

        document.getElementById("rep-firma").src =
            signaturePad.isEmpty() ? "" : signaturePad.toDataURL();
    }

    // ====== Exportar PDF ======
    document.getElementById("btn-pdf").addEventListener("click", async () => {
        generarChecklistFormato();

        const element = document.getElementById("reporte-checklist");
        const canvas = await html2canvas(element, { scale: 3 });
        const img = canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jspdf.jsPDF("p", "pt", "letter");
        const width = 550;
        const height = canvas.height * (width / canvas.width);
        pdf.addImage(img, "JPEG", 30, 20, width, height);

        const nombreArchivo = generarNombreArchivo("");
        pdf.save(`${nombreArchivo}.pdf`);
    });

    // ====== Exportar JPG ======
    document.getElementById("btn-jpg").addEventListener("click", async () => {
        generarChecklistFormato();

        const element = document.getElementById("reporte-checklist");
        const canvas = await html2canvas(element, { scale: 3 });
        const img = canvas.toDataURL("image/jpeg", 1.0);

        const nombreArchivo = generarNombreArchivo("");
        const a = document.createElement("a");
        a.href = img;
        a.download = `${nombreArchivo}.jpg`;
        a.click();
    });

    document.getElementById("btn-txt").addEventListener("click", () => {

    let texto = "";

    // ====== Datos generales ======
    const sala = document.getElementById("sala")?.value || "";
    const fecha = document.getElementById("fecha")?.value || "";
    const turno = document.getElementById("turno")?.value || "";
    const responsable = document.getElementById("nombre")?.value || "";

    texto += `CHECKLIST VISITA SUPERVISIÓN\n`;
    texto += `Sala: ${sala}\n`;
    texto += `Fecha: ${fecha}\n`;
    texto += `Turno: ${turno}\n`;
    texto += `Responsable: ${responsable}\n`;

    // ====== Items del checklist ======
    const items = [
        { label: "Alineación de máquinas", id: "alineacion-terminales" },
        { label: "Limpieza de muebles", id: "limpieza-muebles" },
        { label: "Revisión touch y audio", id: "revision-touch-audio" },
        { label: "Limpieza de botoneras", id: "limpieza-botoneras" },
        { label: "Degradación LED", id: "revision-degradacion-leds" },
        { label: "Detalles estéticos", id: "revision-detalles-esteticos" },
        { label: "Placas NOM", id: "revision-placas" },
        { label: "Estructuras de signs", id: "revision-estructuras" },
        { label: "Alineación pantallas", id: "alineacion-pantallas" },
        { label: "Cinta gaffer", id: "cinta-gaffer" },
    ];

    items.forEach(i => {
        const select = document.querySelector(`.turno[data-id="${i.id}"]`);
        const estado = select ? select.value : "";

        const textarea = document.querySelector(`.comentario[data-id="${i.id}"]`);
        const comentario = textarea ? textarea.value : "";

        texto += `${i.label}\n`;
        texto += `Revisado: ${estado}\n`;
        texto += `Comentarios:\n${comentario}\n\n`;
    });

    // ====== Convertir texto a archivo ======
    const blob = new Blob([texto], { type: "text/plain" });

    const nombreArchivo = generarNombreArchivo("");

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${nombreArchivo}.txt`;
    enlace.click();

});
