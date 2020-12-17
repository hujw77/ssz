import {Type} from "../type";

/**
 * Check if `type` is an instance of `typeSymbol` type
 *
 * Used by various isFooType functions
 */
export function isTypeOf(type: unknown, typeSymbol: symbol): boolean {
  return (
    type &&
    (type as BasicType<unknown>)._typeSymbols &&
    (type as BasicType<unknown>)._typeSymbols.has &&
    (type as BasicType<unknown>)._typeSymbols.has(typeSymbol)
  );
}

/**
 * A BasicType is a terminal type, which has no flexibility in its representation.
 *
 * It is serialized as, at maximum, 32 bytes and merkleized as, at maximum, a single chunk
 */
export abstract class BasicType<T> extends Type<T> {
  constructor() {
    super();
  }

  isBasic(): boolean {
    return true;
  }

  /**
   * Clone / copy
   */
  clone(value: T): T {
    return value;
  }

  /**
   * Equality
   */
  equals(value1: T, value2: T): boolean {
    this.assertValidValue(value1);
    this.assertValidValue(value2);
    return value1 === value2;
  }

  /**
   * Check if type has a variable number of elements (or subelements)
   *
   * For basic types, this is always false
   */
  isVariableSize(): boolean {
    return false;
  }

  /**
   * Maximal serialized byte length
   */
  maxSize(): number {
    return this.size();
  }

  /**
   * Minimal serialized byte length
   */
  minSize(): number {
    return this.size();
  }

  /**
   * Validate bytes before calling fromBytes
   * @param data
   * @param offset
   */
  validateBytes(data: Uint8Array, offset: number): void {
    if (!data) {
      throw new Error("Data is null or undefined");
    }
    if (data.length === 0) {
      throw new Error("Data is empty");
    }
    const length = data.length - offset;
    if (length < this.size()) {
      throw new Error(`Data length of ${length} is too small, expect ${this.size()}`);
    }
    // accept data length > this.size()
  }

  /**
   * Deserialization
   */
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0);
  }

  /**
   * Serialization
   */
  serialize(value: T): Uint8Array {
    const output = new Uint8Array(this.size());
    this.toBytes(value, output, 0);
    return output;
  }

  /**
   * Merkleization
   */
  hashTreeRoot(value: T): Uint8Array {
    const output = new Uint8Array(32);
    this.toBytes(value, output, 0);
    return output;
  }

  /**
   * Serialized byte length
   */
  abstract size(): number;

  /**
   * Low-level deserialization
   */
  abstract fromBytes(data: Uint8Array, offset: number): T;

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  abstract toBytes(value: T, output: Uint8Array, offset: number): number;
}
