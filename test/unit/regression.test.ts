import {expect} from "chai";

import {VectorType, ByteVectorType, NumberUintType, BitListType, BitVectorType, ListType, fromHexString} from "../../src";

describe("known issues", () => {
  it("default value of composite vector should be correct", () => {
    const Vec = new VectorType({
      elementType: new ByteVectorType({length: 4}),
      length: 4,
    });
    expect(Vec.defaultValue().length).to.equal(Vec.length);
  });

  it("far future epoch from json", function () {
    const Number = new NumberUintType({byteLength: 4});
    const maxBigInt = Number.struct_getMaxBigInt();
    const farFutureEpoch = Number.fromJson(maxBigInt.toString());
    expect(farFutureEpoch).to.be.equal(Infinity);
  });

  it("too large number from json", function () {
    const Number = new NumberUintType({byteLength: 4});
    expect(() => Number.fromJson("18446744073709551616")).to.throw;
  });

  it("converts bit arrays to tree", function () {
    const CommitteeBits = new BitListType({limit: 2048});
    const CommitteeBitsVector = new BitVectorType({length: 2048});
    const bits = Array.from({length: 2048}, () => true);

    expect(() => CommitteeBits.createTreeBackedFromStruct(bits)).to.not.throw();
    expect(() => CommitteeBitsVector.createTreeBackedFromStruct(bits)).to.not.throw();
  });

  it("converts Uint8Array to tree", function () {
    const CommitteeBits = new BitListType({limit: 32});
    const CommitteeBitsVector = new BitVectorType({length: 32});
    const validBytes = fromHexString("0xffffffff");

    expect(() => CommitteeBits.createTreeBackedFromBytes(validBytes)).to.not.throw();
    expect(() => CommitteeBitsVector.createTreeBackedFromBytes(validBytes)).to.not.throw();

    const invalidBytes = fromHexString("0xffffffffff");
    const CommitteeBitsVector2 = new BitVectorType({length: 33});
    // all bits after length should be 0 so this should throw error
    expect(() => CommitteeBitsVector2.createTreeBackedFromBytes(invalidBytes)).to.throw("Invalid deserialized bitvector length");
  });

  it("converts basic vector and list from json", function () {
    const Vec = new VectorType({
      elementType: new NumberUintType({byteLength: 4}),
      length: 4,
    });
    const Lis = new ListType({
      elementType: new NumberUintType({byteLength: 4}),
      limit: 4,
    });
    const arr = [1, 2, 3, 4];
    const json = arr.map(String);

    expect(Vec.fromJson(json)).to.deep.equal(arr);
    expect(Lis.fromJson(json)).to.deep.equal(arr);
  });
});
