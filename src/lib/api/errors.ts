import { ApiErrorType } from './constants'

export class ApiError<T = unknown> extends Error {
  constructor(
    public type: ApiErrorType,
    message: string,
    public status?: number,
    public originalError?: unknown,
    public details?: T,
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
