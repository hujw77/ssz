import {ByteVectorStructuralHandler, ByteVectorTreeHandler} from "../../backings";
import {ByteVector} from "../../interface";
import {byteType, isTypeOf} from "../basic";
import {BasicVectorType} from "./vector";

export interface IByteVectorOptions {
  length: number;
}

export const BYTEVECTOR_TYPE = Symbol.for("ssz/ByteVectorType");

export function isByteVectorType<T extends ByteVector = ByteVector>(type: unknown): type is ByteVectorType {
  return isTypeOf(type, BYTEVECTOR_TYPE);
}

export class ByteVectorType extends BasicVectorType<ByteVector> {
  constructor(options: IByteVectorOptions) {
    super({elementType: byteType, ...options});
    this.structural = new ByteVectorStructuralHandler(this);
    this.tree = new ByteVectorTreeHandler(this);
    this._typeSymbols.add(BYTEVECTOR_TYPE);
  }
}
