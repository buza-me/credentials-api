import { UnauthorizedException } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcryptjs';
import { createHash } from 'crypto';

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

export async function encrypt(value: string): Promise<string> {
  const salt = await genSalt(12);
  // Sha256 encrypted string size is 44 bytes,
  // which is less then 72 bytes,- a limit for Bcrypt hash function.
  // Hashing sha256 encrypted string removes length boundaries.
  return hash(
    createHash('sha256')
      .update(value)
      .digest('base64'),
    salt,
  );
}

export async function compareWithHash(
  str: string,
  hash: string,
): Promise<boolean> {
  return compare(
    createHash('sha256')
      .update(str)
      .digest('base64'),
    hash,
  );
}
