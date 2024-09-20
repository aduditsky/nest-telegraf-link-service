import { isURL } from 'class-validator';

export function isValidUrl(url: string): boolean {
  return isURL(url, {
    require_protocol: true,
    protocols: ['http', 'https'],
    require_valid_protocol: true,
  });
}
