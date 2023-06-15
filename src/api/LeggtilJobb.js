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

  const deleteStilling = async (stillingId) => {
    try {
      const response = await fetch(`${apiUrl}/${stillingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Feil ved sletting av stilling");
      }
    } catch (error) {
      throw new Error(`Feil oppstår ved sletting av stilling: ${error.message}`);
    }
  };
  

  const getStillinger = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Feil ved henting av stillinger");
      }
      const stillinger = await response.json();
      return stillinger;
    } catch (error) {
      throw new Error(`Feil oppstår ved henting av stillinger: ${error.message}`);
    }
  };

  const updateStilling = async (stilling) => {
    try {
      const response = await fetch(`${apiUrl}/${stilling.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stilling),
      });
      if (!response.ok) {
        throw new Error("Feil ved oppdatering av stilling");
      }
    } catch (error) {
      throw new Error(`Feil oppstår ved oppdatering av stilling: ${error.message}`);
    }
  };
  
  export { addStilling, deleteStilling, getStillinger, updateStilling, apiUrl };
  
