import { UnauthorizedException } from '@nestjs/common';

export function copyObjectProperties<T>(target: T, source: Partial<T>): T {
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
  JwtRequestId: string,
): void | never {
  if (requestId !== JwtRequestId) {
    throw new UnauthorizedException();
  }
}

export function getByObjectType(collection: any[], objectType: string): any[] {
  return collection.filter((item: any) => item.objectType === objectType);
}
