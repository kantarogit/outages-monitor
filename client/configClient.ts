import * as fs from 'fs';

export function getUsers() {
  const data = fs.readFileSync("appConfig.json");
  const users = JSON.parse(data).users;
  return users;
}
