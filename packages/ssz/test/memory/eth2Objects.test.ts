import {testRunnerMemory} from "./testRunnerMemory";
import {ssz} from "../lodestarTypes/phase0";
import {
  getAttestation,
  getSignedAggregateAndProof,
  getBitsSingle,
  getSignedBeaconBlockPhase0,
} from "../utils/generateEth2Objs";

// Results in Linux Dec 2021
//
// Attestation struct             - 2311.9 bytes / instance
// Attestation tree               - 3048.2 bytes / instance
// SignedAggregateAndProof struct - 2950.4 bytes / instance
// SignedAggregateAndProof tree   - 4691.3 bytes / instance
// AggregationBits struct         - 1180.1 bytes / instance
// AggregationBits tree           - 701.5 bytes / instance
// SignedBeaconBlockPhase0 struct - 210580.6 bytes / instance
// SignedBeaconBlockPhase0 tree   - 278512.7 bytes / instance

testRunnerMemoryBpi([
  // aggregationBits: 1196
  // data: 796
  // signature: 287
  //
  // sum: 2279, all: 2251
  {id: "Attestation struct", getInstance: getAttestation},
  {id: "Attestation tree", getInstance: (i) => ssz.Attestation.createTreeBackedFromStruct(getAttestation(i))},

  {id: "SignedAggregateAndProof struct", getInstance: getSignedAggregateAndProof},
  {
    id: "SignedAggregateAndProof tree",
    getInstance: (i) => ssz.SignedAggregateAndProof.createTreeBackedFromStruct(getSignedAggregateAndProof(i)),
  },

  {id: "AggregationBits struct", getInstance: (i) => getBitsSingle(120, i % 120)},
  {
    id: "AggregationBits tree",
    getInstance: (i) => ssz.CommitteeBits.createTreeBackedFromStruct(getBitsSingle(120, i % 120)),
  },

  {id: "SignedBeaconBlockPhase0 struct", getInstance: getSignedBeaconBlockPhase0},
  {
    id: "SignedBeaconBlockPhase0 tree",
    getInstance: (i) => ssz.SignedBeaconBlock.createTreeBackedFromStruct(getSignedBeaconBlockPhase0(i)),
  },
]);

/**
 * Test bytes per instance in different representations of raw binary data
 */
function testRunnerMemoryBpi(testCases: {getInstance: (bytes: number) => unknown; id: string}[]): void {
  const longestId = Math.max(...testCases.map(({id}) => id.length));

  for (const {id, getInstance} of testCases) {
    const bpi = testRunnerMemory({
      getInstance,
      convergeFactor: 0.2 / 100,
    });

    // eslint-disable-next-line no-console
    console.log(`${id.padEnd(longestId)} - ${bpi.toFixed(1)} bytes / instance`);
  }
}
