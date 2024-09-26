import { createHash } from 'crypto';

/**
 * 计算字符串的hash
 * @param str 
 * @param algorithm 
 * @returns 
 */
export function hashString(str: string, algorithm: string = 'sha256'): string {
  const hash = createHash(algorithm);
  hash.update(str);
  return hash.digest('hex');
}
