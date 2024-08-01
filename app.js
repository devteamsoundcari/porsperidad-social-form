// Cons
const url =
  "https://aw01.us-east-1.020.ivrpowers.net/forms/mas-gobcol/request.php";

// Vars
let multipleInformacionPoblacional;
let multipleAtencionPreferencial;
let multipleNivelEscolaridad;

// Functions
const loadDivipolaSelects = () => {
  const departamentoSelect = document.getElementById("departamento");
  const ciudadSelect = document.getElementById("ciudad");
  const departamentos = {};
  DIVIPOLA.forEach((entry) => {
    if (!departamentos[entry.cod_depto]) {
      departamentos[entry.cod_depto] = {
        nombre: entry.dpto,
        ciudades: [],
      };
    }
    departamentos[entry.cod_depto].ciudades.push({
      codigo: entry.cod_mpio,
      nombre: entry.nom_mpio,
    });
  });
  // Llenar el selector de departamentos
  for (const [codigo, info] of Object.entries(departamentos)) {
    const option = document.createElement("option");
    option.value = codigo;
    option.textContent = info.nombre;
    departamentoSelect.appendChild(option);
  }
  // Actualizar el selector de ciudades según el departamento seleccionado
  departamentoSelect.addEventListener("change", function () {
    const codDepto = this.value;
    // Limpiar las opciones actuales del selector de ciudades
    ciudadSelect.innerHTML = '<option value="">- Seleccione -</option>';
    ciudadSelect.disabled = codDepto === "";
    if (codDepto !== "") {
      const ciudades = departamentos[codDepto].ciudades;
      ciudades.forEach((ciudad) => {
        const option = document.createElement("option");
        option.value = ciudad.codigo;
        option.textContent = ciudad.nombre;
        ciudadSelect.appendChild(option);
      });
    }
  });
};

const loadMultiSelects = () => {
  multipleInformacionPoblacional = new MultiSelect(
    document.getElementById("multiple-informacion-poblacional"),
    {
      selectAll: false,
      search: false,
      onSelect(value) {
        if (value === "No aporta")
          multipleInformacionPoblacional.setValue(["No aporta"]);
        else if (value === "Ninguna de las anteriores")
          multipleInformacionPoblacional.setValue([
            "Ninguna de las anteriores",
          ]);
      },
    }
  );
  multipleAtencionPreferencial = new MultiSelect(
    document.getElementById("multiple-atencion-preferencial"),
    {
      selectAll: false,
      search: false,
      onSelect(value) {
        if (value === "No aporta")
          multipleAtencionPreferencial.setValue(["No aporta"]);
        else if (value === "Ninguna de las anteriores")
          multipleAtencionPreferencial.setValue(["Ninguna de las anteriores"]);
      },
    }
  );
  multipleNivelEscolaridad = new MultiSelect(
    document.getElementById("nivel-escolaridad"),
    {
      selectAll: false,
      search: false,
      onSelect(value) {
        if (value === "No aporta")
          multipleNivelEscolaridad.setValue(["No aporta"]);
        else if (value === "Ninguna de las anteriores")
          multipleNivelEscolaridad.setValue(["Ninguna de las anteriores"]);
      },
    }
  );
};

const validateForm = (data) => {
  const helps = document.querySelectorAll(".help");
  for (let i = 0; i < helps.length; i++) {
    helps[i].style.display = "none";
  }
  if (!data.nombre || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
    document.getElementById("error-nombre").style.display = "block";
    return false;
  } else if (!data.tipoDocumento) {
    document.getElementById("error-tipo-documento").style.display = "block";
    return false;
  } else if (!data.identificacion || !/^\d{4,15}$/.test(data.identificacion)) {
    document.getElementById("error-identificacion").style.display = "block";
    return false;
  } else if (!data.celular || !/^\d{1,10}$/.test(data.celular)) {
    document.getElementById("error-celular").style.display = "block";
    return false;
  } else if (!data.departamento) {
    document.getElementById("error-departamento").style.display = "block";
    return false;
  } else if (!data.ciudad) {
    document.getElementById("error-ciudad").style.display = "block";
    return false;
  } else if (!data.sesion) {
    document.getElementById("error-sesion").style.display = "block";
    return false;
  } else if (!data.informacionPoblacional) {
    document.getElementById("error-informacion-poblacional").style.display =
      "block";
    return false;
  } else if (!data.atencionPreferencial) {
    document.getElementById("error-atencion-preferencial").style.display =
      "block";
    return false;
  } else if (!data.genero) {
    document.getElementById("error-genero").style.display = "block";
    return false;
  } else if (!data.nivelEscolaridad) {
    document.getElementById("error-nivel-escolaridad").style.display = "block";
    return false;
  } else if (!form.confirmation.checked) {
    document.getElementById("error-confirmation").style.display = "block";
    return false;
  }
  return true;
};

// Load
window.addEventListener("load", () => {
  loadDivipolaSelects();
  loadMultiSelects();

  document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const data = {
      nombre: form.nombre.value ? form.nombre.value : undefined,
      tipoDocumento: form["tipo-documento"].value
        ? form["tipo-documento"].value
        : undefined,
      identificacion: form.identificacion.value
        ? form.identificacion.value
        : undefined,
      celular: form.celular.value ? form.celular.value : undefined,
      departamento: form.departamento.value
        ? form.departamento.value
        : undefined,
      ciudad: form.ciudad.value ? form.ciudad.value : undefined,
      sesion: form.sesion.value ? form.sesion.value : undefined,
      informacionPoblacional: Array.from(
        document.querySelectorAll('[name="informacion-poblacional[]"]')
      )
        .map((element) => element.value)
        .join(","),
      atencionPreferencial: Array.from(
        document.querySelectorAll('[name="atencion-preferencial[]"]')
      )
        .map((element) => element.value)
        .join(","),
      genero: form.genero.value ? form.genero.value : undefined,
      nivelEscolaridad: Array.from(
        document.querySelectorAll('[name="nivel-escolaridad[]"]')
      )
        .map((element) => element.value)
        .join(","),
    };

    const isValid = validateForm(data);
    if (!isValid) return false;

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res && res.url) window.location = res.url;
      })
      .catch(function (error) {
        console.error(error);
      });
  });
});
