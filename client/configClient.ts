import * as fs from 'fs';

export function getUsers() {
  const data = fs.readFileSync("userRepository.json", "utf-8");
  const users = JSON.parse(data).users;
  return users;
}
