// ---------------------------------------- IMPORTANTE --------------------------------------------
/**
 * La idea de este archivo es separar la lógica, así como evitar exponer datos innecesarios en el front.
 * Por favor este archivo ponerlo en un lugar que NO sea expuesto al usuario, pero en donde el front pueda acceder a el
 */

const url = "https://cariai.com/happydps/process";

export const validateCalendar = async () => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "validateCalendar");
  formdata.append("dataOrigin", "Click to call");

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok)
      throw new Error("Error en el servicio de validación del calendario");

    const data = await res.text();
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getDepartments = async () => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "getAllDeptos");

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok) throw new Error("Error en el servicio de departamentos");

    const data = await res.text();
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getCitiesByDepartment = async (deptoCode) => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "getCitiesFromUserDepto");
  formdata.append("deptoSel", deptoCode);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok) throw new Error("Error en el servicio de ciudades");

    const data = await res.text();
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const validateUser = async (data) => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "consultUser");
  formdata.append("typeIdentification", data.tipoDocumento);
  formdata.append("numIdentification", data.identificacion);
  formdata.append("dataOrigin", "Click to call");

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok)
      throw new Error("Error en el servicio de validación de usuario");

    const data = await res.text();
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const generateVideoCallUrl = async (data) => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "generateURLVCall");
  formdata.append("userName", data.nombre);
  formdata.append("typeIdentification", data.tipoDocumento);
  formdata.append("numIdentification", data.identificacion);
  formdata.append("cellphone", data.celular);
  formdata.append("email", data.correo);
  formdata.append("department", data.departamento);
  formdata.append("city", data.ciudad);
  formdata.append("informationPoblation", data.informacionPoblacional);
  formdata.append("preferentialAtention", data.atencionPreferencial);
  formdata.append("gender", data.genero);
  formdata.append("educationLevel", data.nivelEscolaridad);
  formdata.append("confirmedTyC", data.confirmed);
  formdata.append("dataOrigin", data.sesion);
  // formdata.append("data", JSON.stringify(data));

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok) throw new Error("Error en el servicio de generación de url");

    const data = await res.text();
    // console.log(typeof data, data.length, data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateUser = async (data) => {
  const headers = new Headers();
  headers.append("Authorization", "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx");

  const formdata = new FormData();
  formdata.append("operation", "updateUser");
  formdata.append("typeIdentification", data.tipoDocumento);
  formdata.append("numIdentification", data.identificacion);
  formdata.append("cellphone", data.celular);
  formdata.append("email", data.correo);
  formdata.append("dataOrigin", "Click to call");

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok)
      throw new Error("Error en el servicio de actualización de usuario");

    const data = await res.text();
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
