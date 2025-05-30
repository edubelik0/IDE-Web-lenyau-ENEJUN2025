function actualizarLineas() {
    const codigo = document.getElementById("codigo");
    const lineas = codigo.value.split("\n").length;
    let contador = "";
    for (let i = 1; i <= lineas; i++) {
        contador += i + "\n";
    }
    const lineasTextarea = document.getElementById("lineas");
    lineasTextarea.value = contador;
    
    // Ajustar altura
    codigo.style.height = 'auto';
    codigo.style.height = codigo.scrollHeight + 'px';
    lineasTextarea.style.height = codigo.style.height;
}

function limpiarErrores() {
    const overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
}

function medirAnchoTexto(texto) {
    const medidor = document.createElement('pre');
    medidor.style.visibility = 'hidden';
    medidor.style.position = 'absolute';
    medidor.style.top = '-9999px';
    medidor.style.fontFamily = 'monospace';
    medidor.style.fontSize = '14px';
    medidor.textContent = texto + " ";
    document.body.appendChild(medidor);
    const ancho = medidor.offsetWidth;
    document.body.removeChild(medidor);
    return ancho;
}

async function analizarEnTiempoReal() {
    const codigo = document.getElementById("codigo").value;
    try {
        const response = await fetch('/analizar_sintactico', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo })
        });

        const data = await response.json();
        resaltarErrores(data.resultado);
    } catch (error) {
        console.error("Error al analizar:", error);
    }
}

let timeoutId = null;

function resaltarErrores(errores) {
    const codigo = document.getElementById("codigo");
    const overlay = document.getElementById("overlay");
    const lineas = codigo.value.split("\n");
    
    limpiarErrores();
    
    const lineHeight = parseFloat(getComputedStyle(codigo).lineHeight);
    const paddingTop = parseFloat(getComputedStyle(codigo).paddingTop);
    
    errores.forEach(error => {
        const lineaIndex = error.linea - 1;
        if (lineaIndex >= 0 && lineaIndex < lineas.length) {
            const linea = lineas[lineaIndex];
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-line";
            
            errorDiv.setAttribute('title', error.mensaje || 'Error en esta línea');
            
            // Calcular el ancho exacto del texto
            const anchoTexto = medirAnchoTexto(linea);
            errorDiv.style.width = `${anchoTexto}px`;
            
            errorDiv.style.top = `${(lineaIndex * lineHeight) + lineHeight - 3 + paddingTop}px`;
            
            overlay.appendChild(errorDiv);
        }
    });
}

function actualizarReloj() {
    const reloj = document.getElementById("reloj");
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let segundos = ahora.getSeconds();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    
    horas = horas % 12;
    horas = horas ? horas : 12;
    
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    
    reloj.textContent = `${horas}:${minutos}:${segundos} ${ampm}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const codigo = document.getElementById("codigo");
    codigo.rows = 20;
    
    // Inicializar y actualizar el reloj cada segundo
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    
    codigo.addEventListener("input", () => {
        actualizarLineas();
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
            analizarEnTiempoReal();
        }, 500);
    });

    // Ajuste inicial
    actualizarLineas();

    codigo.addEventListener("scroll", () => {
        const overlay = document.getElementById("overlay");
        const lineasTextarea = document.getElementById("lineas");
        overlay.scrollTop = codigo.scrollTop;
        lineasTextarea.scrollTop = codigo.scrollTop;
    });

    document.getElementById("btnLexico").addEventListener("click", () => analizar("lexico"));
    document.getElementById("btnSintactico").addEventListener("click", () => analizar("sintactico"));
    document.getElementById("btnTuring").addEventListener("click", () => analizar("turing"));
    document.getElementById("btnTokens").addEventListener("click", mostrarTablaTokens);

    // Funcionalidad del tema
    const themeToggle = document.getElementById('themeToggle');
    
    // Verificar si hay un tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Manejar el cambio de tema
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});

async function analizar(tipo) {
    const codigo = document.getElementById("codigo").value;
    const salida = document.getElementById("salida");
    salida.innerHTML = "";

    try {
        const response = await fetch(tipo === "turing" ? "/simular_turing" : "/analizar_" + tipo, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo })
        });

        const data = await response.json();

        if (tipo === "sintactico") {
            if (data.resultado.length === 0) {
                salida.textContent = "Sintaxis válida: todas las líneas fueron aceptadas.";
                limpiarErrores();
            } else {
                let mensaje = "Errores encontrados en las líneas: ";
                const lineasError = data.resultado.map(e => e.linea);
                mensaje += lineasError.join(", ");
                salida.textContent = mensaje;
                resaltarErrores(data.resultado);
            }
        } else {
            salida.textContent = data.resultado;
        }
    } catch (error) {
        console.error("Error al analizar:", error);
        salida.textContent = "Error al procesar la solicitud";
    }
}

async function mostrarTablaTokens() {
    const tablaTokens = document.getElementById('tablaTokens');
    const btnTokens = document.getElementById('btnTokens');
    
    // Si la tabla ya está visible, solo la ocultamos y cambiamos el texto del botón
    if (tablaTokens.style.display === 'block') {
        tablaTokens.style.display = 'none';
        btnTokens.textContent = 'Generar tabla de tokens';
        return;
    }

    try {
        const response = await fetch('/obtener_tokens');
        const data = await response.json();
        
        const tbody = document.querySelector('#tokensTable tbody');
        tbody.innerHTML = '';
        
        for (const [token, ejemplos] of Object.entries(data.tokens)) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${token}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${ejemplos}</td>
            `;
            tbody.appendChild(tr);
        }
        
        tablaTokens.style.display = 'block';
        btnTokens.textContent = 'Cerrar tabla de tokens';
        document.getElementById('salida').textContent = '';
    } catch (error) {
        console.error("Error al obtener tokens:", error);
        document.getElementById('salida').textContent = "Error al obtener la tabla de tokens";
    }
}