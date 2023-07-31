// @flow

import { URL_API_BASE } from "../constants/callConstants";
import { getAccessToken } from "../utils/userHelper";

import type { ResponseBody } from "./callTypes.js.flow";

export type RegistrationFormData = {|
  +email: string,
  +password: string,
  +appURL: string,
|};

export function index(): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/users`);

  return fetch(request).then((response) =>
    response.json().then((body) => ({ status: response.status, body }))
  );
}

export function create(
  formData: RegistrationFormData | BackendUserCreatingFormData,
  isAuthenticated: boolean
): Promise<ResponseBody> {
  let headers = { "Content-Type": "application/json" };
  if (isAuthenticated) {
    headers = { ...headers, Authorization: `Bearer ${getAccessToken()}` };
  }
  const request = new Request(`${URL_API_BASE}/users`, {
    method: "POST",
    headers: new Headers(headers),
    body: JSON.stringify(formData),
  });

  return fetch(request).then((response) =>
    response.json().then((body) => ({ status: response.status, body }))
  );
}

export function read(id: number): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/users/${id}`);

  return fetch(request).then((response) =>
    response.json().then((body) => ({ status: response.status, body }))
  );
}

export function update(
  id: string,
  formData: BackendUserUpdatingFormData
): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/users/${id}`, {
    method: "PATCH",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    }),
    body: JSON.stringify(formData),
  });

  return fetch(request).then((response) =>
    response.json().then((body) => ({ status: response.status, body }))
  );
}

export default { index, create, read, update };
