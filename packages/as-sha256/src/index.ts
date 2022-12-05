import {newInstance} from "./wasm";
import {HashObject, byteArrayToHashObject, hashObjectToByteArray} from "./hashObject";
import SHA256 from "./sha256";
export {HashObject, byteArrayToHashObject, hashObjectToByteArray, SHA256};

import { keccak_256 } from '@noble/hashes/sha3';
import assert from 'node:assert';

export function digest64(data: Uint8Array): Uint8Array {
  if (data.length === 64) {
    const output = new Uint8Array(32);
    output.set(keccak_256(data));
    return output;
  }
  throw new Error("InvalidLengthForDigest64");
}

export function digest2Bytes32(bytes1: Uint8Array, bytes2: Uint8Array): Uint8Array {
  if (bytes1.length === 32 && bytes2.length === 32) {
    const input = new Uint8Array(64);
    input.set(bytes1);
    input.set(bytes2, 32);
    const output = new Uint8Array(32);
    output.set(keccak_256(input));
    return output;
  }
  throw new Error("InvalidLengthForDigest64");
}

/**
 * Digest 2 objects, each has 8 properties from h0 to h7.
 * The performance is a little bit better than digest64 due to the use of Uint32Array
 * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
 * @returns
 */
export function digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
  const input1 = new Uint8Array(32);
  const input2 = new Uint8Array(32);
  hashObjectToByteArray(obj1, input1, 0);
  hashObjectToByteArray(obj2, input2, 0);
  const output = digest2Bytes32(input1, input2);
  return byteArrayToHashObject(output);
}
