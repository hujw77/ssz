import {itBench} from "@dapplion/benchmark";
import {packedRootsBytesToLeafNodes} from "../../src/packedNode";

describe("packedRootsBytesToLeafNodes", () => {
  const bytes = 4 * 1000;

  for (let offset = 0; offset < 4; offset++) {
    const start = offset;
    const end = start + bytes;

    const data = new Uint8Array(bytes + offset);
    data.set(Buffer.alloc(bytes, 0xdd));

    itBench(`packedRootsBytesToLeafNodes bytes ${bytes} offset ${offset} `, () => {
      packedRootsBytesToLeafNodes(data, start, end);
    });
  }
});
