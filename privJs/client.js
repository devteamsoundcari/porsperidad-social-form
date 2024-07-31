class Client {
  async postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic VXNlckNhcmlIYXBweURQUzpEOVMqcFB5aDQx",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export { Client };
