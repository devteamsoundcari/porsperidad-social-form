class Client {
  async post(url, requestOptions) {
    console.log(url, requestOptions);
    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        // Puedes lanzar un error o devolver algo que indique el fallo
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export { Client };
