import type { BiometricProcessor } from './types.js';
import { MockBiometricProcessor } from './mock-processor.js';

/**
 * Jedyna fabryka procesora — logika w monorepo.
 * PROCESSING_MODE=mock (domyślnie) | future: sharp, onnx, własne reguły
 */
export function createProcessor(): BiometricProcessor {
  const mode = process.env.PROCESSING_MODE ?? 'mock';
  switch (mode) {
    case 'mock':
      return new MockBiometricProcessor();
    default:
      throw new Error(`Unknown PROCESSING_MODE: ${mode}`);
  }
}
