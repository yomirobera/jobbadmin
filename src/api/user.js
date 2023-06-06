import keycloak from "../components/keycloak/keycloak";

// API URL for user
const apiUrl = "http://localhost:8080/api/v1/users"

// Function to get user by ID
const getUser = async (userId) => {
  try {
    // Sending a GET request to the API to fetch user data
    const response = await fetch(`${apiUrl}/${userId}`);

    // Checking if the response status is 404 (user not found)
    if(response.status === 404){
      throw new Error();
    }

    // Parsing the response body as JSON
    const user = await response.json();
    return user;
  } catch (error) {
    // Catching any errors that occurred during the process and returning false
    return false;
  }
};

// Function to add users
const addUsers = async () => {
  try {
    console.log("REGISTER")
    // Sending a POST request to the API to add a user
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Including user data in the request body, obtained from keycloak
      body: JSON.stringify({  
        id: keycloak.tokenParsed.sub,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        email: keycloak.tokenParsed.email
      }),
    });
    return response;
  } catch (error) {
    console.log(error)
    // Throwing an error with a message if there was an issue adding the user
    throw new Error(`Error adding project: ${error.message}`);
  }
};

// Exporting the functions and the API URL
export { addUsers, getUser, apiUrl };
