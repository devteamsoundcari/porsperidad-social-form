import {
  validateCalendar,
  getDepartments,
  getCitiesByDepartment,
  generateVideoCallUrl,
} from "./privJs/services.js";

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
          `<option value="${depto.value}" data-depto-name="${depto.value}, ${depto.label}">${depto.label}</option>`
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

      if (ciudades.status === 200) {
        const ciudadesArray = ciudades.message.cities;

        ciudadSelect.innerHTML = `
        <option value="">- Seleccione -</option>
        ${ciudadesArray
          .map(
            (ciudad) =>
              `<option value="${ciudad.value}" data-city-name="${ciudad.value}, ${ciudad.label}">${ciudad.label}</option>`
          )
          .join("")}
        `;
      }
    }
  });
};

async function isInSchedule() {
  const response = await validateCalendar();
  return response;
}

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
      onChange: function (value, text, element) {
        poblationValidator(this.element.innerText);
      },
      //Validador de informacion al deseleccionar
      onUnselect: function (value, text, element) {
        const texto = this.element.innerText.trim();
        this.placeholder === texto
          ? poblationValidator("")
          : poblationValidator(texto);
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
      onChange: function (value, text, element) {
        preferentialAtentionValidator(this.element.innerText);
      },
      onUnselect: function (value, text, element) {
        const texto = this.element.innerText.trim();
        this.placeholder === texto
          ? preferentialAtentionValidator("")
          : preferentialAtentionValidator(texto);
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
      onChange: function (value, text, element) {
        scholarshipValidator(this.element.innerText);
      },
      onUnselect: function (value, text, element) {
        const texto = this.element.innerText.trim();
        this.placeholder === texto
          ? scholarshipValidator("")
          : scholarshipValidator(texto);
      },
    }
  );
};

window.addEventListener("load", async function () {
  loadMultiSelects();
  await loadDivipolaSelects();

  const res = await isInSchedule();

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
      console.log("T");
    }
  }
});

//variables to handle the call
let nameValidated,
  docType,
  docNumber,
  cellphone,
  email,
  residenceDep,
  residenceCity,
  // sesionValidated,
  pobInformation,
  preferencialAtention,
  genderValidated,
  scholarship,
  confirmValidated,
  captchaValidated;

const nameValidator = (name) => {
  if (!name) {
    document.getElementById("error-nombre").style.display = "block";
    nameValidated = false;
  } else {
    document.getElementById("error-nombre").style.display = "none";
    nameValidated = true;
  }
};

const docTypeValidator = (docTypeV) => {
  if (!docTypeV) {
    document.getElementById("error-tipo-documento").style.display = "block";
    docType = false;
  } else {
    document.getElementById("error-tipo-documento").style.display = "none";
    docType = true;
  }
};

const docNumberValidator = (docNumberV) => {
  if (!docNumberV) {
    document.getElementById("error-identificacion").style.display = "block";
    docNumber = false;
  } else {
    document.getElementById("error-identificacion").style.display = "none";
    docNumber = true;
  }
};

const cellphoneValidator = (cellphoneV) => {
  if (
    !cellphoneV ||
    !/^\d{1,10}$/.test(cellphoneV) ||
    cellphoneV.length !== 10
  ) {
    document.getElementById("error-celular").style.display = "block";
    cellphone = false;
  } else {
    document.getElementById("error-celular").style.display = "none";
    cellphone = true;
  }
};

const emailValidator = (emailValue) => {
  if (
    !emailValue ||
    !/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
  ) {
    document.getElementById("error-email").style.display = "block";
    email = false;
  } else {
    document.getElementById("error-email").style.display = "none";
    email = true;
  }
};

const departmentValidator = (department) => {
  if (!department || department === undefined) {
    document.getElementById("error-departamento").style.display = "block";
    residenceDep = false;
  } else {
    document.getElementById("error-departamento").style.display = "none";
    residenceDep = true;
  }
};

const cityValidator = (city) => {
  if (!city) {
    document.getElementById("error-ciudad").style.display = "block";
    residenceCity = false;
  } else {
    document.getElementById("error-ciudad").style.display = "none";
    residenceCity = true;
  }
};

const sesionValidator = (sesionValue) => {
  if (!sesionValue) {
    document.getElementById("error-sesion").style.display = "block";
    sesionValidated = false;
  } else {
    document.getElementById("error-sesion").style.display = "none";
    sesionValidated = true;
  }
};

function poblationValidator(poblationValue) {
  if (!poblationValue && poblationValue !== "- Seleccione -") {
    document.getElementById("error-informacion-poblacional").style.display =
      "block";
    pobInformation = false;
  } else {
    document.getElementById("error-informacion-poblacional").style.display =
      "none";
    pobInformation = true;
  }
}

const preferentialAtentionValidator = (preferentialAtentionValue) => {
  if (!preferentialAtentionValue) {
    document.getElementById("error-atencion-preferencial").style.display =
      "block";
    preferencialAtention = false;
  } else {
    document.getElementById("error-atencion-preferencial").style.display =
      "none";
    preferencialAtention = true;
  }
};

const genderValidator = (genderValue) => {
  if (!genderValue) {
    document.getElementById("error-genero").style.display = "block";
    genderValidated = false;
  } else {
    document.getElementById("error-genero").style.display = "none";
    genderValidated = true;
  }
};

const scholarshipValidator = (scholarshipValue) => {
  if (!scholarshipValue) {
    document.getElementById("error-nivel-escolaridad").style.display = "block";
    scholarship = false;
  } else {
    document.getElementById("error-nivel-escolaridad").style.display = "none";
    scholarship = true;
  }
};

const confirmValidator = (confirmValue) => {
  if (!confirmValue) {
    document.getElementById("error-confirmation").style.display = "block";
    confirmValidated = false;
  } else {
    document.getElementById("error-confirmation").style.display = "none";
    confirmValidated = true;
  }
};

const captchaValidator = (captchaValue) => {
  if (captchaValue === "No aceptado") {
    document.getElementById("error-captcha").style.display = "block";
    captchaValidated = false;
  } else {
    document.getElementById("error-captcha").style.display = "none";
    captchaValidated = true;
  }
};
//-----------------------------------HANDLE ERRORS WITH CHANGE OR BLUR-----------------------------------
const nombreInput = document.getElementsByName("nombre");
nombreInput[0].addEventListener("input", (e) => {
  const patron =
    /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜß\s-']/g;
  e.target.value = e.target.value.replace(patron, "");
  nameValidator(e.target.value);
});

const tipoDoc = document.getElementsByName("tipo-documento");
tipoDoc[0].addEventListener("change", (e) => docTypeValidator(e.target.value));

const docNumberInput = document.getElementsByName("identificacion");
docNumberInput[0].addEventListener("input", (e) => {
  const regex = /[^0-9]/g;
  e.target.value = e.target.value.replace(regex, "");
  docNumberValidator(e.target.value);
});

const celularInput = document.getElementsByName("celular");
celularInput[0].addEventListener("input", (e) => {
  cellphoneValidator(e.target.value);
});

const emailInput = document.getElementsByName("email");
emailInput[0].addEventListener("input", (e) => {
  emailValidator(e.target.value);
});

const departamento = document.getElementsByName("departamento");
departamento[0].addEventListener("change", (e) =>
  departmentValidator(e.target.value)
);

const ciudad = document.getElementsByName("ciudad");
ciudad[0].addEventListener("change", (e) => cityValidator(e.target.value));

const sesionUser = document.getElementsByName("sesion");
// sesionUser[0].addEventListener("change", (e) =>
//   sesionValidator(e.target.value)
// );

const generoUser = document.getElementsByName("genero");
generoUser[0].addEventListener("change", (e) =>
  genderValidator(e.target.value)
);

const confirmData = document.getElementsByName("confirmation");
confirmData[0].addEventListener("change", (e) =>
  confirmValidator(e.target.checked)
);

const validateForm = (data) => {
  const helps = document.querySelectorAll(".help");
  for (let i = 0; i < helps.length; i++) {
    helps[i].style.display = "none";
  }
  nameValidator(data.nombre);
  docTypeValidator(data.tipoDocumento);
  docNumberValidator(data.identificacion);
  cellphoneValidator(data.celular);
  emailValidator(data.email);
  departmentValidator(data.departamento);
  cityValidator(data.ciudad);
  // sesionValidator(data.sesion);
  poblationValidator(data.informacionPoblacional);
  preferentialAtentionValidator(data.atencionPreferencial);
  genderValidator(data.genero);
  scholarshipValidator(data.nivelEscolaridad);
  confirmValidator(data.confirmation);
  captchaValidator(data.captcha);
  if (
    !nameValidated ||
    !docType ||
    !docNumber ||
    !cellphone ||
    !email ||
    !residenceDep ||
    !residenceCity ||
    // !sesionValidated ||
    !pobInformation ||
    !preferencialAtention ||
    !genderValidated ||
    !scholarship ||
    !confirmValidated ||
    !captchaValidated
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

    const captchaRes = grecaptcha.getResponse();

    const selectetDepto =
      form.departamento.options[form.departamento.selectedIndex];
    let deptoName = "";

    if (selectetDepto.hasAttribute("data-depto-name"))
      deptoName = selectetDepto.getAttribute("data-depto-name");

    const selectetCity = form.ciudad.options[form.ciudad.selectedIndex];
    let cityName = "";

    if (selectetCity.hasAttribute("data-city-name"))
      cityName = selectetCity.getAttribute("data-city-name");

    const data = {
      nombre: form.nombre.value ? form.nombre.value : undefined,
      tipoDocumento: form["tipo-documento"].value
        ? form["tipo-documento"].value
        : undefined,
      identificacion: form.identificacion.value
        ? form.identificacion.value
        : undefined,
      celular: form.celular.value ? form.celular.value : undefined,
      departamento: deptoName,
      ciudad: cityName,
      // sesion: form.sesion.value ? form.sesion.value : undefined,
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
      confirmation: form.confirmation.checked ? "Si" : "No", // En caso de ser "No", no debería dejar llegar a la videollamada.
      captcha: captchaRes !== "" ? "Aceptado" : "No aceptado",
    };

    const isValid = validateForm(data);
    if (!isValid) return false;

    const videoCallRes = await generateVideoCallUrl(data);

    if (videoCallRes) {
      const vCallData = videoCallRes.message;
      if (vCallData) {
        window.location.href = vCallData.url;
      }
    }
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", submitForm);
});
