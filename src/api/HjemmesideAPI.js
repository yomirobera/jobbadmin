const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/stilling");
      const json = await response.json();
      //setData(json);
      return json
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  

  
  export {fetchData}