import {number16Vector6Type} from "../../testTypes";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: number16Vector6Type,
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});