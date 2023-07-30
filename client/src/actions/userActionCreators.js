// @flow

import { push } from "react-router-redux";

import type { Dispatch } from "redux";

import {
  APP_NOTIFICATIONS_ADD,
  USER_IDENTITY_UPDATE,
  USER_ACCOUNT_UPDATE,
  USER_TOKEN_UPDATE,
  USER_LIST_UPDATE,
  USER_DETAILS_UPDATE,
  LOGIN_FORM_UPDATE,
  REGISTRATION_FORM_UPDATE,
  PASSWORD_CHANGE_FORM_UPDATE,
} from "../constants/actionTypeConstants";
import { ROUTE_LOGIN, ROUTE_USER_DETAILS } from "../constants/routeConstants";
import { create as createAuthorization } from "../api/authorizationCalls";
import { index, create, read } from "../api/userCalls";
import {
  index as indexAccount,
  update as updateAccount,
} from "../api/accountCalls";
import {
  create as createToken,
  read as readToken,
} from "../api/userTokenCalls";

import type {
  AppNotificationAddingAction,
  UserIdentityUpdatingAction,
  UserAccountUpdatingAction,
  UserTokenUpdatingAction,
  UserListUpdatingAction,
  UserDetailsUpdatingAction,
  RegistrationFormUpdatingAction,
  LoginFormUpdatingAction,
  PasswordChangeFormUpdatingAction,
} from "../actions/actionCreatorTypes.js.flow";
import type { LoginFormData } from "../api/authorizationCalls";
import type { RegistrationFormData } from "../api/userCalls";
import type { PasswordChangeFormData } from "../api/accountCalls";
type LoginAction = UserIdentityUpdatingAction | LoginFormUpdatingAction;

export function logIn(formData: LoginFormData): Function {
  return (dispatch: Dispatch<LoginAction>): Promise<void> =>
    createAuthorization(formData).then((response) => {
      switch (response.status) {
        case 201:
          dispatch({
            type: USER_IDENTITY_UPDATE,
            token: response.body.attributes.accessToken,
          });
          // dispatch(push(ROUTE_HOME));
          dispatch(push(ROUTE_USER_DETAILS));
          break;
        case 401:
          dispatch({
            type: LOGIN_FORM_UPDATE,
            errors: {
              email: [response.body.message],
              password: [" "],
            },
          });
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

export function logOut(): Function {
  return (dispatch: Dispatch<UserIdentityUpdatingAction>): void => {
    dispatch({ type: USER_IDENTITY_UPDATE, token: null });
    dispatch(push(ROUTE_LOGIN));
  };
}

type RegistrationAction =
  | AppNotificationAddingAction
  | RegistrationFormUpdatingAction;

export function register(formData: RegistrationFormData): Function {
  return (dispatch: Dispatch<RegistrationAction>): Promise<void> =>
    create(formData, false).then((response) => {
      switch (response.status) {
        case 201:
          dispatch({ type: REGISTRATION_FORM_UPDATE, errors: {}, reset: true });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: "success",
            message:
              "A message with a confirmation link has been sent to your email.",
            redirect: false,
          });
          break;
        case 422:
          dispatch({
            type: REGISTRATION_FORM_UPDATE,
            errors: response.body.errors,
            reset: false,
          });
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

export function view(): Function {
  return (dispatch: Dispatch<UserListUpdatingAction>): Promise<void> =>
    index().then((response) => {
      switch (response.status) {
        case 200: {
          dispatch({
            type: USER_LIST_UPDATE,
            items: response.body.items,
            message: null,
          });
          break;
        }
        case 404: {
          dispatch({
            type: USER_LIST_UPDATE,
            items: [],
            message: response.body.message,
          });
          break;
        }
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

export function viewOne(id: number): Function {
  return (dispatch: Dispatch<UserDetailsUpdatingAction>): Promise<void> =>
    read(id).then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: USER_DETAILS_UPDATE,
            attributes: response.body.attributes,
            message: null,
          });
          break;
        case 404:
          dispatch({
            type: USER_DETAILS_UPDATE,
            attributes: {},
            message: response.body.message,
          });
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

type AccountViewAction = UserIdentityUpdatingAction | UserAccountUpdatingAction;

export function viewAccount(): Function {
  return (dispatch: Dispatch<AccountViewAction>): Promise<void> =>
    indexAccount().then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: USER_ACCOUNT_UPDATE,
            attributes: response.body.attributes,
          });
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

type PasswordChangeAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | PasswordChangeFormUpdatingAction;

export function changePassword(formData: PasswordChangeFormData): Function {
  return (dispatch: Dispatch<PasswordChangeAction>): Promise<void> =>
    updateAccount(formData).then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: PASSWORD_CHANGE_FORM_UPDATE,
            errors: {},
            reset: true,
          });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: "success",
            message: "Your password has been changed successfully.",
            redirect: false,
          });
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 422:
          dispatch({
            type: PASSWORD_CHANGE_FORM_UPDATE,
            errors: response.body.errors,
            reset: false,
          });
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

export function viewToken(token: string): Function {
  return (dispatch: Dispatch<UserTokenUpdatingAction>): Promise<void> =>
    readToken(token).then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {
              isUsed: Boolean(response.body.attributes.usedAt),
              isExpired: response.body.attributes.isExpired,
            },
            message: null,
          });
          break;
        case 404:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {},
            message: response.body.message,
          });
          break;
        default:
          throw new Error("Unexpected response returned.");
      }
    });
}

export default {
  logIn,
  logOut,

  register,
  view,
  viewOne,

  viewAccount,
  changePassword,

  viewToken,
};
