import {
  BasicListByteArrayHandler,
  BasicListStructuralHandler,
  BasicListTreeHandler,
  CompositeListByteArrayHandler,
  CompositeListStructuralHandler,
  CompositeListTreeHandler,
} from "../../backings";
import {List} from "../../interface";
import {FULL_HASH_LENGTH, GIndexPathKeys, GINDEX_LEN_PATH} from "../../util/gIndex";
import {getPowerOfTwoCeil} from "../../util/math";
import {isTypeOf, UINT_TYPE} from "../basic";
import {BasicArrayType, CompositeArrayType, IArrayOptions} from "./array";
import {Gindex, toGindex} from "@chainsafe/persistent-merkle-tree";

export interface IListOptions extends IArrayOptions {
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListType<T extends List<any> = List<any>> = BasicListType<T> | CompositeListType<T>;
type ListTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends List<any>>(options: IListOptions): ListType<T>;
};

export const LIST_TYPE = Symbol.for("ssz/ListType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isListType<T extends List<any> = List<any>>(type: unknown): type is ListType<T> {
  return isTypeOf(type, LIST_TYPE);
}

// Trick typescript into treating ListType as a constructor
export const ListType: ListTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function ListType<T extends List<any> = List<any>>(options: IListOptions): ListType<T> {
    if (options.elementType.isBasic()) {
      return new BasicListType(options);
    } else {
      return new CompositeListType(options);
    }
  } as unknown) as ListTypeConstructor;

export class BasicListType<T extends List<unknown> = List<unknown>> extends BasicArrayType<T> {
  limit: number;
  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this.structural = new BasicListStructuralHandler(this);
    this.tree = new BasicListTreeHandler(this);
    this.byteArray = new BasicListByteArrayHandler(this);
    this._typeSymbols.add(LIST_TYPE);
  }
  isVariableSize(): boolean {
    return true;
  }
  chunkCount(): number {
    return Math.ceil((this.limit * this.elementType.getItemLength()) / 32);
  }

  getItemPosition(index: number): [number, number, number] {
    const start = index + this.elementType.getItemLength();
    return [
      Math.floor(start / FULL_HASH_LENGTH),
      start % FULL_HASH_LENGTH,
      (start % FULL_HASH_LENGTH) + this.elementType.getItemLength(),
    ];
  }

  getGeneralizedIndex(pathParts: GIndexPathKeys[], rootIndex = BigInt(1)): Gindex {
    const path = parseInt(pathParts[0] as string);
    if (isNaN(path) || path < 0 || path > this.limit) {
      throw new Error(`Invalid array index ${path}`);
    }
    let chunkIndex;
    if (this.isPacked()) {
      const elemsPerChunk = Math.floor(32 / this.elementType.getItemLength());
      chunkIndex = Math.floor(path / elemsPerChunk);
    } else {
      chunkIndex = path;
    }
    return rootIndex * toGindex(chunkIndex, BigInt(this.tree.depth()));
  }
}

export class CompositeListType<T extends List<object> = List<object>> extends CompositeArrayType<T> {
  limit: number;
  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this.structural = new CompositeListStructuralHandler(this);
    this.tree = new CompositeListTreeHandler(this);
    this.byteArray = new CompositeListByteArrayHandler(this);
    this._typeSymbols.add(LIST_TYPE);
  }
  isVariableSize(): boolean {
    return true;
  }

  chunkCount(): number {
    return Math.ceil((this.limit * this.elementType.getItemLength()) / 32);
  }

  getItemPosition(index: number): [number, number, number] {
    const start = index + this.elementType.getItemLength();
    return [
      Math.floor(start / FULL_HASH_LENGTH),
      start % FULL_HASH_LENGTH,
      (start % FULL_HASH_LENGTH) + this.elementType.getItemLength(),
    ];
  }

  getGeneralizedIndex(pathParts: GIndexPathKeys[], rootIndex = 1): number {
    if (pathParts.length === 0) {
      return rootIndex;
    }
    const path = parseInt(pathParts[0] as string);
    if (isNaN(path)) {
      throw new Error("CompositeArray supports only element index as path. Received " + path);
    }
    const [pos] = this.getItemPosition(path);
    const baseIndex = 2;
    rootIndex = rootIndex * baseIndex * getPowerOfTwoCeil(this.chunkCount()) + pos;
    return this.elementType.getGeneralizedIndex(pathParts.slice(1), rootIndex);
  }
}
