export interface UserController<Request, Response> {
  getUsers(request: Request): Response;
  getUserById(request: Request): Response;
  createUser(request: Request): Response;
  updateUser(request: Request): Response;
}
