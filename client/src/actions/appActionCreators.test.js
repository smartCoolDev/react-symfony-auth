import { updateErrorCode, removeNotification } from "./appActionCreators";

import {
  APP_ERROR_CODE_UPDATE,
  APP_NOTIFICATIONS_REMOVE,
} from "../constants/actionTypeConstants";

describe("updateErrorCode", () => {
  it("should return an action with the correct type and payload", () => {
    const code = 404;
    const expectedAction = {
      type: APP_ERROR_CODE_UPDATE,
      code,
    };
    expect(updateErrorCode(code)).toEqual(expectedAction);
  });
});

describe("removeNotification", () => {
  it("should return an action with the correct type and payload", () => {
    const index = 2;
    const expectedAction = {
      type: APP_NOTIFICATIONS_REMOVE,
      index,
    };
    expect(removeNotification(index)).toEqual(expectedAction);
  });
});
