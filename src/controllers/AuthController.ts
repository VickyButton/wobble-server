export interface AuthController<Request, Response> {
  authenticateUser(request: Request): Response;
}
