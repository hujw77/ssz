import { Gindex, toGindex } from "@chainsafe/persistent-merkle-tree";
import {ContainerByteArrayHandler, ContainerStructuralHandler, ContainerTreeHandler} from "../../backings";
import {ObjectLike} from "../../interface";
import {GIndexPathKeys, GINDEX_LEN_PATH} from "../../util/gIndex";
import {getPowerOfTwoCeil} from "../../util/math";
import {isTypeOf} from "../basic";
import {Type} from "../type";
import {CompositeType} from "./abstract";

export interface IContainerOptions<T extends ObjectLike = ObjectLike> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<keyof T, Type<any>>;
}

export const CONTAINER_TYPE = Symbol.for("ssz/ContainerType");

export function isContainerType<T extends ObjectLike = ObjectLike>(type: unknown): type is ContainerType<T> {
  return isTypeOf(type, CONTAINER_TYPE);
}
export class ContainerType<T extends ObjectLike = ObjectLike> extends CompositeType<T> {
  // ES6 ensures key order is chronological
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<keyof T, Type<any>>;
  constructor(options: IContainerOptions<T>) {
    super();
    this.fields = {...options.fields};
    this.structural = new ContainerStructuralHandler(this);
    this.tree = new ContainerTreeHandler(this);
    this.byteArray = new ContainerByteArrayHandler(this);
    this._typeSymbols.add(CONTAINER_TYPE);
  }

  isVariableSize(): boolean {
    return Object.values(this.fields).some((fieldType) => fieldType.isVariableSize());
  }

  chunkCount(): number {
    return Object.keys(this.fields).length;
  }

  getItemPosition(propertyName: keyof T): [number, number, number] {
    const pos = Object.keys(this.fields).indexOf(propertyName as string);
    if (pos === -1) {
      throw new Error(`Property ${propertyName} doesn't exists on container`);
    }
    return [pos, 0, this.fields[propertyName].getItemLength()];
  }

  getGeneralizedIndex(pathParts: GIndexPathKeys[], rootIndex = BigInt(1)): Gindex {
    if (pathParts.length === 0) {
      return rootIndex;
    }
    const path = pathParts[0];
    const fieldIndex = Object.keys(this.fields).indexOf(String(path));
    if (fieldIndex === -1) {
      throw new Error(`Field ${path} doesn't exists on container`);
    }
    return rootIndex * toGindex(fieldIndex, BigInt(this.tree.depth()));
  }
}
