import {
  validateCalendar,
  getDepartments,
  getCitiesByDepartment,
  generateVideoCallUrl,
  validateUser,
  updateUser,
} from "./privJs/services.js";

// Vars
let multipleInformacionPoblacional;
let multipleAtencionPreferencial;
let multipleNivelEscolaridad;
let usuarioExiste;

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

function fixData(key, value) {
  if (value === "") return;

  sessionStorage.setItem(key, value);
}

function updateSelectOption(selectElement, text, value) {
  // Ensure the select element exists
  if (!selectElement) {
    console.error("El elemento select no existe");
    return;
  }

  // Ensure the select element has at least one option
  if (selectElement.options.length > 0) {
    selectElement.options[0].textContent = text;
    selectElement.options[0].value = value;
  } else {
    // If no options exist, create one
    const newOption = document.createElement("option");
    newOption.textContent = text;
    newOption.value = value;
    selectElement.appendChild(newOption);
  }

  // Set the value to the special value
  selectElement.value = value;
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

async function userValidation(formData) {
  const user = await validateUser(formData);

  if (user.status === 200) {
    return user.message.response;
  } else {
    return user.message.response;
  }
}

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
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(emailValue);
  console.log(isValid);
  if (!emailValue || !emailPattern.test(emailValue)) {
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
  if (
    !poblationValue &&
    poblationValue !== "- Seleccione -" &&
    poblationValue !== "*****"
  ) {
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
  if (captchaValue === "") {
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
nombreInput[0].addEventListener("blur", (e) => {
  fixData("nombre", e.target.value);
});

const tipoDoc = document.getElementsByName("tipo-documento");
tipoDoc[0].addEventListener("change", (e) => docTypeValidator(e.target.value));
tipoDoc[0].addEventListener("blur", fillData);

const docNumberInput = document.getElementsByName("identificacion");
docNumberInput[0].addEventListener("input", (e) => {
  const regex = /[^0-9]/g;
  e.target.value = e.target.value.replace(regex, "");
  docNumberValidator(e.target.value);
});
docNumberInput[0].addEventListener("blur", fillData);

const celularInput = document.getElementsByName("celular");
celularInput[0].addEventListener("input", (e) => {
  cellphoneValidator(e.target.value);
});
celularInput[0].addEventListener("blur", (e) => {
  fixData("celular", e.target.value);
});

const emailInput = document.getElementsByName("email");
emailInput[0].addEventListener("input", (e) => {
  emailValidator(e.target.value);
});
emailInput[0].addEventListener("blur", (e) => {
  fixData("correo", e.target.value);
});

const departamento = document.getElementsByName("departamento");
departamento[0].addEventListener("change", (e) =>
  departmentValidator(e.target.value)
);
departamento[0].addEventListener("blur", (e) => {
  fixData("departamento", e.target.value);
});

const ciudad = document.getElementsByName("ciudad");
ciudad[0].addEventListener("change", (e) => cityValidator(e.target.value));
ciudad[0].addEventListener("blur", (e) => {
  fixData("ciudad", e.target.value);
});

const sesionUser = document.getElementsByName("sesion");
// sesionUser[0].addEventListener("change", (e) =>
//   sesionValidator(e.target.value)
// );

const generoUser = document.getElementsByName("genero");
generoUser[0].addEventListener("change", (e) =>
  genderValidator(e.target.value)
);
generoUser[0].addEventListener("blur", (e) => {
  fixData("genero", e.target.value);
});

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
  emailValidator(data.correo);
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

/** Esta función lo que hace es que llena los datos si el usuario ya existe */
async function fillData() {
  const form = document.getElementById("form");

  const data = {
    tipoDocumento: form["tipo-documento"].value,
    identificacion: form.identificacion.value,
  };

  const helps = document.querySelectorAll(".help");
  for (let i = 0; i < helps.length; i++) {
    helps[i].style.display = "none";
  }

  docTypeValidator(data.tipoDocumento);
  docNumberValidator(data.identificacion);

  if (!docType || !docNumber) {
    document.getElementById("buttonMessage").style.display = "block";
    return;
  } else {
    document.getElementById("buttonMessage").style.display = "none";
  }

  const user = await userValidation(data);
  usuarioExiste = user;

  if (user === "1" || user === 1) {
    form.nombre.value = "*****";
    form.nombre.setAttribute("disabled", true);

    // updateSelectOption(form["tipo-documento"], "*****", "hidden");
    // form["tipo-documento"].setAttribute("disabled", true);

    updateSelectOption(form.departamento, "*****", "hidden");
    form.departamento.setAttribute("disabled", true);

    updateSelectOption(form.ciudad, "*****", "hidden");
    form.ciudad.setAttribute("disabled", true);

    const infoPoblacional = document.getElementById(
      "multiple-informacion-poblacional"
    );
    infoPoblacional.classList.add("disabled");
    const infoPoblacionalText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    infoPoblacionalText[0].innerText = "*****";

    const atencionPreferencial = document.getElementById(
      "multiple-atencion-preferencial"
    );
    atencionPreferencial.classList.add("disabled");
    const atencionPreferencialText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    atencionPreferencialText[1].innerText = "*****";

    updateSelectOption(form.genero, "*****", "hidden");
    form.genero.setAttribute("disabled", true);

    const infoEscolaridad = document.getElementById("nivel-escolaridad");
    infoEscolaridad.classList.add("disabled");
    const infoEscolaridadText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    infoEscolaridadText[2].innerText = "*****";
    // updateSelectOption(form["nivel-escolaridad"], "*****", "hidden");
    // form["nivel-escolaridad"].setAttribute("disabled", true);
  } else {
    // Se crea este objeto para que si el usuario inició el llenado del formulario y al final valida si existe no va a perder la data que ya llenó
    const sessionData = {
      nombre: sessionStorage.getItem("nombre"),
      celular: sessionStorage.getItem("celular"),
      correo: sessionStorage.getItem("correo"),
      departamento: sessionStorage.getItem("departamento"),
      ciudad: sessionStorage.getItem("ciudad"),
      genero: sessionStorage.getItem("genero"),
    };

    form.nombre.value = sessionData.nombre ? sessionData.nombre : "";
    form.nombre.removeAttribute("disabled");

    // updateSelectOption(form["tipo-documento"], "- Seleccione -", "");
    // form["tipo-documento"].removeAttribute("disabled");

    updateSelectOption(form.departamento, "- Seleccione -", "");
    form.departamento.removeAttribute("disabled");

    updateSelectOption(form.ciudad, "- Seleccione -", "");
    form.ciudad.removeAttribute("disabled");

    const infoPoblacional = document.getElementById(
      "multiple-informacion-poblacional"
    );
    infoPoblacional.classList.remove("disabled");
    const infoPoblacionalText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    infoPoblacionalText[0].innerText = "- Seleccione -";

    const atencionPreferencial = document.getElementById(
      "multiple-atencion-preferencial"
    );
    atencionPreferencial.classList.remove("disabled");
    const atencionPreferencialText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    atencionPreferencialText[1].innerText = "- Seleccione -";

    updateSelectOption(form.genero, "- Seleccione -", "");
    form.genero.removeAttribute("disabled");

    const infoEscolaridad = document.getElementById("nivel-escolaridad");
    infoEscolaridad.classList.remove("disabled");
    const infoEscolaridadText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    infoEscolaridadText[2].innerText = "- Seleccione -";
    // updateSelectOption(form["nivel-escolaridad"], "- Seleccione -", "");
    // form["nivel-escolaridad"].removeAttribute("disabled");
  }
}

// Load
window.addEventListener("load", () => {
  window.open(
    "./popUps/recomendaciones.html",
    "Recomendaciones",
    "width=600,height=800"
  );
  const screenWidth = window.screen.width;
  const windowWidth = Math.floor(screenWidth * 0.5);
  window.open(
    "./popUps/t&c.html",
    "Términos y Condiciones",
    `width=${windowWidth},height=800,left=${screenWidth - windowWidth}`
  );
  async function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById("form");

    const captchaRes = grecaptcha.getResponse();

    const selectetDepto =
      form.departamento.options[form.departamento.selectedIndex];
    let deptoName = "";

    if (selectetDepto.hasAttribute("data-depto-name")) {
      deptoName = selectetDepto.getAttribute("data-depto-name");
    } else {
      deptoName = form.departamento.value;
    }

    const selectetCity = form.ciudad.options[form.ciudad.selectedIndex];
    let cityName = "";

    if (selectetCity.hasAttribute("data-city-name")) {
      cityName = selectetCity.getAttribute("data-city-name");
    } else {
      cityName = form.ciudad.value;
    }

    // Se valida que el array poblacional tenga al menos un elemento y si el texto es ***** el valor de poblacional será hidden. De lo contrario tomará el valor del array
    let poblacional = "";
    const arrayPoblacional = Array.from(
      document.querySelectorAll('[name="informacion-poblacional[]"]')
    )
      .map((element) => element.value)
      .join(", ");
    const infoPoblacionalText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    if (
      arrayPoblacional.length === 0 &&
      infoPoblacionalText[0].innerText === "*****"
    ) {
      poblacional = "hidden";
    } else {
      poblacional = arrayPoblacional;
    }

    // Se valida que el array atencionPreferencial tenga al menos un elemento y si el texto es ***** el valor de atencionPreferencial será hidden. De lo contrario tomará el valor del array
    let atencionPreferencial = "";
    const arrayAtencionPreferencial = Array.from(
      document.querySelectorAll('[name="atencion-preferencial[]"]')
    )
      .map((element) => element.value)
      .join(", ");
    const infoPreferencialText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    if (
      arrayAtencionPreferencial.length === 0 &&
      infoPreferencialText[1].innerText === "*****"
    ) {
      atencionPreferencial = "hidden";
    } else {
      atencionPreferencial = arrayAtencionPreferencial;
    }

    //Se valida que el array nivelEscolaridad tenga al menos un elemento y si el texto es ***** el valor de nivelEscolaridad será hidden. De lo contrario tomará el valor del array
    let nivelEscolaridad = "";
    const arrayNivelEscolaridad = Array.from(
      document.querySelectorAll('[name="nivel-escolaridad[]"]')
    )
      .map((element) => element.value)
      .join(", ");
    const infoEscolaridadText = document.getElementsByClassName(
      "multi-select-header-placeholder"
    );
    if (
      arrayNivelEscolaridad.length === 0 &&
      infoEscolaridadText[2].innerText === "*****"
    ) {
      nivelEscolaridad = "hidden";
    } else {
      nivelEscolaridad = arrayNivelEscolaridad;
    }

    const data = {
      nombre: form.nombre.value ? form.nombre.value : undefined,
      tipoDocumento: form["tipo-documento"].value
        ? form["tipo-documento"].value
        : undefined,
      identificacion: form.identificacion.value
        ? form.identificacion.value
        : undefined,
      celular: form.celular.value ? form.celular.value : undefined,
      correo: form.email.value ? form.email.value : undefined,
      departamento: deptoName,
      ciudad: cityName,
      sesion: "Videollamada", //form.sesion.value ? form.sesion.value : undefined,
      informacionPoblacional: poblacional,
      atencionPreferencial: atencionPreferencial,
      genero: form.genero.value ? form.genero.value : undefined,
      nivelEscolaridad: nivelEscolaridad,
      confirmation: form.confirmation.checked ? "Si" : "No", // En caso de ser "No", no debería dejar llegar a la videollamada.
      captcha: captchaRes !== "" ? "Aceptado" : "No aceptado",
    };

    // console.log(data);

    const isValid = validateForm(data);
    if (!isValid) return false;

    if (usuarioExiste === 1) {
      const updateData = {
        tipoDocumento: form["tipo-documento"].value,
        identificacion: form.identificacion.value,
        celular: form.celular.value,
        correo: form.email.value,
      };

      const userUpdate = await updateUser(updateData);
      console.log(userUpdate);
    } else {
      const videoCallRes = await generateVideoCallUrl(data);
      console.log(videoCallRes);
      // if (videoCallRes) {
      //   const vCallData = videoCallRes.message;
      //   if (vCallData) {
      //     window.location.href = vCallData.url;
      //   }
      // }
    }
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", submitForm);
});
