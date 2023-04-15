export function genericError(status?: number, message?: string) {
  return {
    status: status || 500,
    message: message || 'Something is wrong in the server.',
  };
}
