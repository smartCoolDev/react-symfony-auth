// @flow

import { LOCATION_CHANGE } from "react-router-redux";

import {
  USER_IDENTITY_UPDATE,
  USER_ACCOUNT_UPDATE,
  USER_TOKEN_UPDATE,
  USER_LIST_UPDATE,
  USER_DETAILS_UPDATE,
  LOGIN_FORM_UPDATE,
  REGISTRATION_FORM_UPDATE,
} from "../constants/actionTypeConstants";
import { setAccessToken, getIdentity } from "../utils/userHelper";

import type { UserState } from "./reducerTypes.js.flow";
import type { UserAction } from "../actions/actionCreatorTypes.js.flow";

const initialState = {
  identity: getIdentity(),
  account: { attributes: {}, updatedAt: null },
  token: { attributes: {}, message: null, updatedAt: null },
  list: { items: [], message: null, updatedAt: null },
  details: { attributes: {}, message: null, updatedAt: null },
  loginForm: { errors: {} },
  registrationForm: { errors: {}, reset: false },
};

export default function reduce(
  state: UserState = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case LOCATION_CHANGE:
      return { ...initialState, identity: getIdentity() };
    case USER_IDENTITY_UPDATE: {
      setAccessToken(action.token);
      return { ...state, identity: getIdentity() };
    }
    case USER_ACCOUNT_UPDATE:
      return {
        ...state,
        account: { attributes: action.attributes, updatedAt: new Date() },
      };
    case USER_TOKEN_UPDATE:
      return {
        ...state,
        token: {
          attributes: action.attributes,
          message: action.message,
          updatedAt: new Date(),
        },
      };
    case USER_LIST_UPDATE:
      return {
        ...state,
        list: {
          items: action.items,
          message: action.message,
          updatedAt: new Date(),
        },
      };
    case USER_DETAILS_UPDATE:
      return {
        ...state,
        details: {
          attributes: action.attributes,
          message: action.message,
          updatedAt: new Date(),
        },
      };
    case LOGIN_FORM_UPDATE:
      return { ...state, loginForm: { errors: action.errors } };
    case REGISTRATION_FORM_UPDATE:
      return {
        ...state,
        registrationForm: { errors: action.errors, reset: action.reset },
      };
    default:
      return state;
  }
}
