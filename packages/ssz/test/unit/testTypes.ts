// Adapted from https://github.com/prysmaticlabs/prysm/blob/master/shared/ssz/encode_test.go#L296
import {
  UintBigintType,
  BitVectorType,
  BitListType,
  ByteVectorType,
  ContainerType,
  UintNumberType,
  ListBasicType,
  VectorBasicType,
  BooleanType,
  ListCompositeType,
  NoneType,
  UnionType,
} from "../../src";

export const booleanType = new BooleanType();
export const byteType = new UintNumberType(1);
export const bytes2Type = new ByteVectorType(2);
export const bytes4Type = new ByteVectorType(4);
export const bytes8Type = new ByteVectorType(8);
export const bytes32Type = new ByteVectorType(32);

export const byteVector100Type = new ByteVectorType(100);

export const bitList100Type = new BitListType(100);
export const bitVector100Type = new BitVectorType(100);

export const bigint16Type = new UintBigintType(2);
export const bigint64Type = new UintBigintType(8);
export const bigint128Type = new UintBigintType(16);
export const bigint256Type = new UintBigintType(32);

export const number16Type = new UintNumberType(2);
export const number32Type = new UintNumberType(4);
export const number64Type = new UintNumberType(8);
export const number64Type2 = new UintNumberType(8, true);

export const number16Vector6Type = new VectorBasicType(number16Type, 6);
export const number16List100Type = new ListBasicType(number16Type, 100);
export const bigint16List100Type = new ListBasicType(bigint16Type, 100);

export const SimpleObject = new ContainerType({b: number16Type, a: byteType}, {typeName: "SimpleObject"});

export const VariableSizeSimpleObject = new ContainerType(
  {
    b: number16Type,
    a: byteType,
    list: number16List100Type,
  },
  {typeName: "VariableSizeSimpleObject"}
);

export const CamelCaseFieldObject = new ContainerType(
  {
    someValue: new UintNumberType(4),
    someOtherValue: new BooleanType(),
  },
  {typeName: "CamelCaseFieldObject"}
);

export const NoTransformFieldObject = new ContainerType(
  {
    someValue_RandOM: new UintNumberType(4),
    someOtherValue_1Random2: new BooleanType(),
  },
  {typeName: "NoTransformFieldObject"}
);

export const NoTransformFieldObjectWithDeclaredExpectedCase = new ContainerType(
  {
    someValue_RandOM: new UintNumberType(4),
    someOtherValue_1Random2: new BooleanType(),
  },
  {case: "notransform", typeName: "NoTransformFieldObjectWithDeclaredExpectedCase"}
);

export const RandomTransformFieldObject = new ContainerType(
  {
    someValueRandOM: new UintNumberType(4),
    someOtherValue1Random2: new BooleanType(),
  },
  {typeName: "RandomTransformFieldObject"}
);

export const SlashingTransformFieldObject = new ContainerType(
  {
    eth1Data: new UintNumberType(4),
    signedHeader1: new UintNumberType(4),
    signedHeader2: new UintNumberType(4),
    attestation1: new BooleanType(),
    attestation2: new BooleanType(),
  },
  {typeName: "SlashingTransformFieldObject"}
);

export const WithCasingDeclarationFieldObject = new ContainerType(
  {
    eth1Data: new UintNumberType(4),
    signedHeader1: new UintNumberType(4),
    signedHeader2: new UintNumberType(4),
    attestation1: new BooleanType(),
    attestation2: new BooleanType(),
  },
  {
    casingMap: {
      signedHeader1: "signed_header_1",
      signedHeader2: "signed_header_2",
      attestation1: "attestation_1",
      attestation2: "attestation_2",
    },
    typeName: "WithCasingDeclarationFieldObject",
  }
);

export const ComplexCamelCaseFieldObject = new ContainerType(
  {
    someValue: new UintNumberType(4),
    someOtherValue: new BooleanType(),
    container: CamelCaseFieldObject,
  },
  {typeName: "ComplexCamelCaseFieldObject"}
);

export const InnerObject = new ContainerType({v: number16Type}, {typeName: "InnerObject"});

export const OuterObject = new ContainerType({v: byteType, subV: InnerObject}, {typeName: "OuterObject"});

export const ArrayObject = new ContainerType({v: new ListCompositeType(SimpleObject, 100)}, {typeName: "ArrayObject"});

export const ArrayObject2 = new ListCompositeType(OuterObject, 100);

export const UnionObject = new UnionType([new NoneType(), SimpleObject, number16Type]);
export const balancesType = new ListBasicType(number64Type, 100);
