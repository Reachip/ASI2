import Repository from "./Repository.mjs";

class UserRepository {
  constructor() {
    this.repository = new Repository();
  }

  getUsers() {
    return this.repository.get("users")
  }
}
