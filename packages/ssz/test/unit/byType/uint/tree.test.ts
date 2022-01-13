import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {toHexString, fromHexString} from "../../../../src/util/byteArray";
import {UintNumberType} from "../../../../src";

describe("UintNumberType / tree", () => {
  const byteType = new UintNumberType(1);

  it("Single value", () => {
    const leafNode = new LeafNode(Buffer.alloc(32, 0));
    byteType.tree_setToNode(leafNode, 1);

    expect(toHexString(leafNode.root)).to.equal("0x0100000000000000000000000000000000000000000000000000000000000000");

    expect(byteType.tree_getFromNode(leafNode)).to.equal(1);
  });

  it("Packed node of bytes", () => {
    const buf = Buffer.alloc(32, 0);

    const leafNode = new LeafNode(Buffer.alloc(32, 0));
    for (let i = 0; i < 32; i++) {
      const value = i + 1;
      byteType.tree_setToPackedNode(leafNode, i, value);
      buf[i] = value;
    }

    expect(toHexString(leafNode.root)).to.equal(toHexString(buf), "Wrong leafNode.root value");
  });
});

// Ensure UintNumberType can deal with Infinity value
describe("UintType - Infinity with clipInfinity", () => {
  const hexOffset0 = "0xffffffffffffffff000000000000000000000000000000000000000000000000";
  const hexOffset2 = "0x00000000000000000000000000000000ffffffffffffffff0000000000000000";

  const uint64Type = new UintNumberType(8, true);

  it("Infinity getFromNode", () => {
    const node = new LeafNode(fromHexString(hexOffset0));
    expect(uint64Type.tree_getFromNode(node)).to.equal(Infinity);
  });

  it("Infinity getFromPackedNode", () => {
    const node = new LeafNode(fromHexString(hexOffset2));
    expect(uint64Type.tree_getFromPackedNode(node, 2)).to.equal(Infinity);
  });

  it("Infinity setToNode", () => {
    const node = new LeafNode(Buffer.alloc(32, 0));
    uint64Type.tree_setToNode(node, Infinity);
    expect(toHexString(node.root)).to.equal(hexOffset0);
  });

  it("Infinity setToPackedNode", () => {
    const node = new LeafNode(Buffer.alloc(32, 0));
    uint64Type.tree_setToPackedNode(node, 2, Infinity);
    expect(toHexString(node.root)).to.equal(hexOffset2);
  });
});