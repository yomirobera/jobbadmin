const apiUrl = "http://localhost:8080/api/v1/stilling"


const addStilling = async (stilling) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stilling),
      });
      return response;
    } catch (error) {
      throw new Error(`Feil oppstår når stilling blir laget: ${error.message}`);
    }
  };

  export {addStilling, apiUrl};