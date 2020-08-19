import { UnauthorizedException } from '@nestjs/common';

export function copyObjectProperties<T>(target: T, source: T): T {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = value;
  });
  return target;
}

export function logError(e: Error, source: string): void {
  console.log(`${source} error: ${e}`);
}

export function validateUserId(
  requestId: string,
  jwtUserId: string,
): void | never {
  if (requestId !== jwtUserId) {
    throw new UnauthorizedException();
  }
}
