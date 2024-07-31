class Client {
  async postData(url = "", data = {}) {
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, reqOptions);
    return response.json();
  }
}

export { Client };
