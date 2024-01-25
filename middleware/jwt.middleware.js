const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET || "token-secret",
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  console.log('-------------------- Hello ', req.headers)

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    console.log(">>>>>>>>> This is the token: ", token)
    return token;
  }

  return null;
}

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
};
