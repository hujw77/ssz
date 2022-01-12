import path from "path";
import fs from "fs";
import {fromHexString} from "@chainsafe/ssz";
import {uncompress} from "snappyjs";
import jsyaml from "js-yaml";

/* eslint-disable
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/explicit-function-return-type
*/

export type ValidTestCaseData = {
  root: Uint8Array;
  serialized: Uint8Array;
  jsonValue: unknown;
};

/**
 * ssz_static
 * | Attestation
 *   | case_0
 *     | roots.yaml
 *     | serialized.ssz_snappy
 *     | value.yaml
 *
 * Docs: https://github.com/ethereum/consensus-specs/blob/master/tests/formats/ssz_static/core.md
 */
export function parseSszStaticTestcase(dirpath: string): ValidTestCaseData {
  // The root is stored in meta.yml as:
  //   root: 0xDEADBEEF
  const meta = jsyaml.load(path.join(dirpath, "roots.yaml")) as {root: string};
  if (typeof meta.root !== "string") {
    throw Error("meta.root not a string");
  }

  // The serialized value is stored in serialized.ssz_snappy
  const serialized = uncompress<Uint8Array>(fs.readFileSync(path.join(dirpath, "serialized.ssz_snappy")));

  // The value is stored in value.yml
  const yamlPath = path.join(dirpath, "value.yaml");
  const yamlStrNumbersAsNumbers = fs.readFileSync(yamlPath, "utf8");
  const jsonValue = readYamlNumbersAsStrings(yamlStrNumbersAsNumbers);

  // type.fromJson(loadYamlFile(path.join(dirpath, "value.yaml")) as Json) as T;

  return {
    root: fromHexString(meta.root),
    serialized,
    jsonValue,
  };
}

/**
 * ssz_generic
 * | basic_vector
 *   | valid
 *     | vec_bool_1_max
 *       | meta.yaml
 *       | serialized.ssz_snappy
 *       | value.yaml
 *
 * Docs: https://github.com/ethereum/eth2.0-specs/blob/master/tests/formats/ssz_generic/README.md
 */
export function parseSszGenericValidTestcase(dirpath: string): ValidTestCaseData {
  // The root is stored in meta.yml as:
  //   root: 0xDEADBEEF
  const meta = jsyaml.load(path.join(dirpath, "meta.yaml")) as {root: string};
  if (typeof meta.root !== "string") {
    throw Error("meta.root not a string");
  }

  // The serialized value is stored in serialized.ssz_snappy
  const serialized = uncompress<Uint8Array>(fs.readFileSync(path.join(dirpath, "serialized.ssz_snappy")));

  // The value is stored in value.yml
  const yamlPath = path.join(dirpath, "value.yaml");
  const yamlStrNumbersAsNumbers = fs.readFileSync(yamlPath, "utf8");
  const jsonValue = readYamlNumbersAsStrings(yamlStrNumbersAsNumbers);

  // type.fromJson(loadYamlFile(path.join(dirpath, "value.yaml")) as Json) as T;

  return {
    root: fromHexString(meta.root),
    serialized,
    jsonValue,
  };
}

/**
 * ssz_generic
 * | basic_vector
 *   | invalid
 *     | vec_bool_0
 *       | serialized.ssz_snappy
 *
 * Docs: https://github.com/ethereum/eth2.0-specs/blob/master/tests/formats/ssz_generic/README.md
 */
export function parseSszGenericInvalidTestcase(dirpath: string) {
  // The serialized value is stored in serialized.ssz_snappy
  const serialized = uncompress(fs.readFileSync(path.join(dirpath, "serialized.ssz_snappy")));

  return {
    serialized,
  };
}

export function readYamlNumbersAsStrings(yamlStr: string): unknown {
  // eslint-disable-next-line quotes, no-useless-escape
  const yamlStrNumbersAsStrings = yamlStr.replace(/([\[:]\s?)?(\d+)([^0-9]{1})/g, '$1"$2"$3');
  return jsyaml.load(yamlStrNumbersAsStrings);
}
