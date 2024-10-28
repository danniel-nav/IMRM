function mostrarPrematricula() {
    document.getElementById('modalPrematricula').style.display = 'block';
    document.getElementById('paso1').style.display = 'block';
    document.getElementById('paso2').style.display = 'none';
}

function cerrarModal() {
    document.getElementById('modalPrematricula').style.display = 'none';
    document.getElementById('formEstudiante').reset();
    document.getElementById('formEncargado').reset();
}

function actualizarModalidades() {
    const grado = document.querySelector('select[name="grado"]').value;
    const modalidadSelect = document.querySelector('select[name="modalidad"]');
    modalidadSelect.innerHTML = '<option value="">Seleccione la modalidad</option>';

    if (grado >= 10) {
        if (grado == 12) {
            modalidadSelect.innerHTML += `
                <option value="BTPI">BTPI</option>
                <option value="BTPCF">BTPCF</option>
            `;
        } else {
            modalidadSelect.innerHTML += `
                <option value="BTPI">BTPI</option>
                <option value="BTPCF">BTPCF</option>
                <option value="BCH">BCH</option>
            `;
        }
    } else if (grado >= 7) {
        modalidadSelect.innerHTML += '<option value="CBT">CBT</option>';
    }
}

function siguientePaso() {
    // Validar el formulario del estudiante
    const formEstudiante = document.getElementById('formEstudiante');
    if (!formEstudiante.checkValidity()) {
        formEstudiante.reportValidity();
        return;
    }

    document.getElementById('paso1').style.display = 'none';
    document.getElementById('paso2').style.display = 'block';
}

function pasoAnterior() {
    document.getElementById('paso1').style.display = 'block';
    document.getElementById('paso2').style.display = 'none';
}

// Función para generar PDF y CSV   
function generarPDF(event) {
    event.preventDefault();
    
    // Crear instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener fecha actual formateada
    const fecha = new Date().toLocaleDateString('es-HN');
    
    // Obtener datos del formulario y convertir a mayúsculas
    const estudiante = {
        nombre: document.querySelector('[name="nombre"]').value.toUpperCase(),
        apellidoPaterno: document.querySelector('[name="apellidoPaterno"]').value.toUpperCase(),
        apellidoMaterno: document.querySelector('[name="apellidoMaterno"]').value.toUpperCase(),
        dni: document.querySelector('[name="dni"]').value,
        telefono: document.querySelector('[name="telefono"]').value,
        direccion: document.querySelector('[name="direccion"]').value.toUpperCase(),
        fechaNacimiento: document.querySelector('[name="fechaNacimiento"]').value,
        sexo: document.querySelector('[name="sexo"]').value.toUpperCase(),
        centroProcedencia: document.querySelector('[name="centroProcedencia"]').value.toUpperCase(),
        grado: document.querySelector('[name="grado"]').value,
        modalidad: document.querySelector('[name="modalidad"]').value.toUpperCase()
    };

    const encargado = {
        tipo: document.querySelector('[name="tipoEncargado"]').value.toUpperCase(),
        nombre: document.querySelector('[name="nombreEncargado"]').value.toUpperCase(),
        dni: document.querySelector('[name="dniEncargado"]').value,
        telefono: document.querySelector('[name="telefonoEncargado"]').value,
        direccion: document.querySelector('[name="direccionEncargado"]').value.toUpperCase(),
        ocupacion: document.querySelector('[name="ocupacionEncargado"]').value.toUpperCase()
    };

    // Agregar logo
    //const logo = new Image();
    //logo.src = 'img/logo.png';
    //doc.addImage(logo, 'PNG', 10, 10, 30, 30);

    // Título y fecha
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTITUTO MIGUEL RAFAEL MADRID', 105, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('BOLETA DE PREMATRÍCULA', 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fecha}`, 105, 45, { align: 'center' });

    // Datos del estudiante
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL ESTUDIANTE:', 20, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const datosEstudiante = [
        ['DNI:', estudiante.dni],
        ['Nombre Completo:', `${estudiante.nombre} ${estudiante.apellidoPaterno} ${estudiante.apellidoMaterno}`],
        ['Teléfono:', estudiante.telefono],
        ['Dirección:', estudiante.direccion],
        ['Fecha de Nacimiento:', estudiante.fechaNacimiento],
        ['Sexo:', estudiante.sexo],
        ['Centro de Procedencia:', estudiante.centroProcedencia],
        ['Grado:', `${estudiante.grado}°`],
        ['Modalidad:', estudiante.modalidad]
    ];

    // Crear tabla de datos del estudiante
    doc.autoTable({
        startY: 65,
        head: [],
        body: datosEstudiante,
        theme: 'plain',
        styles: { fontSize: 12 },
        columnStyles: {
            0: { cellWidth: 50, font: 'helvetica', fontStyle: 'bold' },
            1: { cellWidth: 140 }
        }
    });

    // Datos del encargado
    doc.text('DATOS DEL ENCARGADO:', 20, doc.lastAutoTable.finalY + 15);
    
    const datosEncargado = [
        ['Tipo de Encargado:', encargado.tipo],
        ['Nombre:', encargado.nombre],
        ['DNI:', encargado.dni],
        ['Teléfono:', encargado.telefono],
        ['Dirección:', encargado.direccion],
        ['Ocupación:', encargado.ocupacion]
    ];

    // Crear tabla de datos del encargado
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [],
        body: datosEncargado,
        theme: 'plain',
        styles: { fontSize: 12 },
        columnStyles: {
            0: { cellWidth: 50, font: 'helvetica', fontStyle: 'bold' },
            1: { cellWidth: 140 }
        }
    });

    // Agregar firmas
    const yFirmas = doc.lastAutoTable.finalY + 40;
    doc.line(30, yFirmas, 90, yFirmas); // Línea para firma del secretario
    doc.line(120, yFirmas, 180, yFirmas); // Línea para firma del director

    doc.setFontSize(10);
    doc.text('Firma del Secretari@', 60, yFirmas + 10, { align: 'center' });
    doc.text('Firma del Director@', 150, yFirmas + 10, { align: 'center' });

    // Guardar datos en CSV
    const csvData = [
        fecha,
        estudiante.dni,
        estudiante.nombre,
        estudiante.apellidoPaterno,
        estudiante.apellidoMaterno,
        estudiante.telefono,
        estudiante.direccion,
        estudiante.fechaNacimiento,
        estudiante.sexo,
        estudiante.centroProcedencia,
        estudiante.grado,
        estudiante.modalidad,
        encargado.tipo,
        encargado.nombre,
        encargado.dni,
        encargado.telefono,
        encargado.direccion,
        encargado.ocupacion
    ].join(',') + '\n';

    // Crear y descargar CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prematricula_${estudiante.dni}.csv`;
    a.click();

    // Abrir PDF en nueva pestaña
    doc.output('dataurlnewwindow');
    
    // Cerrar modal y limpiar formularios
    cerrarModal();
}

document.getElementById('btnPrematricula').addEventListener('click', generarPDF);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnPrematricula').addEventListener('click', generarPDF);
});
//----------------------------------------------------
// Obtener los elementos del formulario
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const closeButton = document.getElementsByClassName("close-button")[0];

// Función para verificar las credenciales de administrador
function loginAdmin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Aquí debes agregar la lógica para verificar si el usuario y contraseña son correctos
  // Por ejemplo, puedes comparar con valores almacenados en una base de datos o en variables
  if (username === "admin" && password === "password") {
    // Si las credenciales son válidas, ocultar el modal y mostrar la sección de administrador
    loginModal.style.display = "none";
    document.getElementById("adminSection").style.display = "block";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// Mostrar el modal de login cuando se carga la página
loginModal.style.display = "block";

// Cerrar el modal al hacer clic fuera o en el botón de cerrar
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
};
closeButton.onclick = function () {
  loginModal.style.display = "none";
};

// Agregar evento de submit al formulario de login
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  loginAdmin();
});
//----------------------------------------------------
// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalPrematricula');
    if (event.target == modal) {
        cerrarModal();
    }
}
// Cerrar modal y limpiar formularios
function cerrarModal() {
    document.getElementById('modalPrematricula').style.display = 'none';
    document.getElementById('formEstudiante').reset();
    document.getElementById('formEncargado').reset();
}