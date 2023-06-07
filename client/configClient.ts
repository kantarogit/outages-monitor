const fs = require("fs");

export function getUsers() {
  const data = fs.readFileSync("appConfig.json");
  const users = JSON.parse(data).users;
  return users;
}

function getUser(email: string) {
  const users = getUsers();
  const user = users.find((user: any) => user.email === email);
  if (user) {
    console.log(`User ${email} found with search locations: ${user.searchLocations}`);
  } else {
    console.log(`User ${email} not found`);
  }
}