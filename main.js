import {
  validateCalendar,
  getDepartments,
  getCitiesByDepartment,
} from "./privJs/services.js";

async function isInSchedule() {
  const response = await validateCalendar();
  return response;
}

window.addEventListener("load", async function () {
  loadMultiSelects();
  await loadDivipolaSelects();

  const res = await isInSchedule();
  // console.log(res);

  if (res) {
    const response = res.message;
    const onTime = res.message.status_calendar;
    const description = res.message.description_calendar;

    if (onTime !== 1) {
      sessionStorage.setItem("description", description);
      setTimeout(() => {
        window.location.href = "./fueraDeHorario.html";
      }, 1500);
    } else {
      console.log("Está en horario");
    }
  }
});

// Cons
const url =
  "https://aw01.us-east-1.020.ivrpowers.net/forms/mas-gobcol/request.php";

// Vars
let multipleInformacionPoblacional;
let multipleAtencionPreferencial;
let multipleNivelEscolaridad;

// Functions
const loadDivipolaSelects = async () => {
  const departamentoSelect = document.getElementById("departamento");
  const ciudadSelect = document.getElementById("ciudad");
  const departments = await getDepartments();

  if (departments.status === 200) {
    const departamentos = departments.message.deptos;

    departamentoSelect.innerHTML = `
    <option value="" data-depto-name="Error">- Seleccione -</option>
    ${departamentos
      .map(
        (depto) =>
          `<option value="${depto.value}" data-depto-name="${depto.label}">${depto.label}</option>`
      )
      .join("")}
    `;
  }

  // Actualizar el selector de ciudades según el departamento seleccionado
  departamentoSelect.addEventListener("change", async function (e) {
    const codDepto = e.target.value;
    // Limpiar las opciones actuales del selector de ciudades
    ciudadSelect.innerHTML =
      '<option value="" data-city-name="Error">- Seleccione -</option>';
    ciudadSelect.disabled = codDepto === "";
    if (codDepto !== "") {
      const ciudades = await getCitiesByDepartment(codDepto);
      // console.log(ciudades);

      if (ciudades.status === 200) {
        const ciudadesArray = ciudades.message.cities;

        ciudadSelect.innerHTML = `
        <option value="">- Seleccione -</option>
        ${ciudadesArray
          .map(
            (ciudad) =>
              `<option value="${ciudad.value}" data-city-name="${ciudad.label}">${ciudad.label}</option>`
          )
          .join("")}
        `;
      }
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

//variables to handle the call
let nameValidated,
  docType,
  docNumber,
  cellphone,
  residenceDep,
  residenceCity,
  sesionValidated,
  pobInformation,
  preferencialAtention,
  genderValidated,
  scholarship,
  confirmValidated;

const nameValidator = (name) => {
  if (!name || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    document.getElementById("error-nombre").style.display = "block";
    nameValidated = false;
  }
};

const docTypeValidator = (docTypeV) => {
  if (!docTypeV) {
    document.getElementById("error-tipo-documento").style.display = "block";
    docType = false;
  }
};

const docNumberValidator = (docNumberV) => {
  if (!docNumberV || !/^\d{4,15}$/.test(docNumberV)) {
    document.getElementById("error-identificacion").style.display = "block";
    docNumber = false;
  }
};

const cellphoneValidator = (cellphoneV) => {
  if (
    !cellphoneV ||
    !/^\d{1,10}$/.test(cellphoneV) ||
    cellphoneV.length < 10 ||
    cellphoneV.length > 10
  ) {
    document.getElementById("error-celular").style.display = "block";
    cellphone = false;
  }
};

const departmentValidator = (department) => {
  if (!department || department === undefined) {
    document.getElementById("error-departamento").style.display = "block";
    residenceDep = false;
  }
};

const cityValidator = (city) => {
  if (!city) {
    document.getElementById("error-ciudad").style.display = "block";
    residenceCity = false;
  }
};

const sesionValidator = (sesionValue) => {
  if (!sesionValue) {
    document.getElementById("error-sesion").style.display = "block";
    sesionValidated = false;
  }
};

const poblationValidator = (poblationValue) => {
  if (!poblationValue) {
    document.getElementById("error-informacion-poblacional").style.display =
      "block";
    pobInformation = false;
  }
};

const preferentialAtentionValidator = (preferentialAtentionValue) => {
  if (!preferentialAtentionValue) {
    document.getElementById("error-atencion-preferencial").style.display =
      "block";
    preferencialAtention = false;
  }
};

const genderValidator = (genderValue) => {
  if (!genderValue) {
    document.getElementById("error-genero").style.display = "block";
    genderValidated = false;
  }
};

const scholarshipValidator = (scholarshipValue) => {
  if (!scholarshipValue) {
    document.getElementById("error-nivel-escolaridad").style.display = "block";
    scholarship = false;
  }
};

const confirmValidator = (confirmValue) => {
  if (!confirmValue) {
    document.getElementById("error-confirmation").style.display = "block";
    confirmValidated = false;
  }
};

const validateForm = (data) => {
  const helps = document.querySelectorAll(".help");
  for (let i = 0; i < helps.length; i++) {
    helps[i].style.display = "none";
  }
  nameValidator(data.nombre);
  docTypeValidator(data.tipoDocumento);
  docNumberValidator(data.identificacion);
  cellphoneValidator(data.celular);
  departmentValidator(data.departamento);
  cityValidator(data.ciudad);
  sesionValidator(data.sesion);
  poblationValidator(data.informacionPoblacional);
  preferentialAtentionValidator(data.atencionPreferencial);
  genderValidator(data.genero);
  scholarshipValidator(data.nivelEscolaridad);
  confirmValidator(data.confirmation);
  if (
    !nameValidated ||
    !docType ||
    !docNumber ||
    !cellphone ||
    !residenceDep ||
    !residenceCity ||
    !sesionValidated ||
    !pobInformation ||
    !preferencialAtention ||
    !genderValidated ||
    !scholarship ||
    !confirmValidated
  ) {
    document.getElementById("buttonMessage").style.display = "block";
    return false;
  } else return true;
};

// Load
window.addEventListener("load", () => {
  async function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById("form");
    console.log("checked:", form.confirmation.checked);

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
        .join(", "),
      atencionPreferencial: Array.from(
        document.querySelectorAll('[name="atencion-preferencial[]"]')
      )
        .map((element) => element.value)
        .join(", "),
      genero: form.genero.value ? form.genero.value : undefined,
      nivelEscolaridad: Array.from(
        document.querySelectorAll('[name="nivel-escolaridad[]"]')
      )
        .map((element) => element.value)
        .join(", "),
      confirmation: form.confirmation.checked ? true : false,
    };

    const isValid = validateForm(data);
    console.log(isValid);
    // if (!isValid) return false;

    console.log("Form data", data);
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", submitForm);
  // loadDivipolaSelects();
  // loadMultiSelects();
  // document.getElementById("submit-btn").addEventListener("click", (e) => {
  //   e.preventDefault();
  //   const form = document.getElementById("form");
  //   const data = {
  //     nombre: form.nombre.value ? form.nombre.value : undefined,
  //     tipoDocumento: form["tipo-documento"].value
  //       ? form["tipo-documento"].value
  //       : undefined,
  //     identificacion: form.identificacion.value
  //       ? form.identificacion.value
  //       : undefined,
  //     celular: form.celular.value ? form.celular.value : undefined,
  //     departamento: form.departamento.value
  //       ? form.departamento.value
  //       : undefined,
  //     ciudad: form.ciudad.value ? form.ciudad.value : undefined,
  //     sesion: form.sesion.value ? form.sesion.value : undefined,
  //     informacionPoblacional: Array.from(
  //       document.querySelectorAll('[name="informacion-poblacional[]"]')
  //     )
  //       .map((element) => element.value)
  //       .join(","),
  //     atencionPreferencial: Array.from(
  //       document.querySelectorAll('[name="atencion-preferencial[]"]')
  //     )
  //       .map((element) => element.value)
  //       .join(","),
  //     genero: form.genero.value ? form.genero.value : undefined,
  //     nivelEscolaridad: Array.from(
  //       document.querySelectorAll('[name="nivel-escolaridad[]"]')
  //     )
  //       .map((element) => element.value)
  //       .join(","),
  //   };
  //   const isValid = validateForm(data);
  //   if (!isValid) return false;
  //   fetch(url, {
  //     method: "POST",
  //     mode: "no-cors",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((res) => {
  //       if (res && res.url) window.location = res.url;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // });
});
