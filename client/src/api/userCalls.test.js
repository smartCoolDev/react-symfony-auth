import fetch, { Request, Headers } from "node-fetch";
import { index, create, read, update } from "./userCalls";

describe("index", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ users: [] }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it("should call fetch with the correct arguments", () => {
    const expectedRequest = new Request("http://localhost:8000/users");

    return index().then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should return a response object with the correct shape", () => {
    const expectedResponse = { status: 200, body: { users: [] } };

    return index().then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});

describe("create", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({ message: "success" }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it("should call fetch with the correct arguments", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
      appURL: "http://localhost:8000",
    };
    const isAuthenticated = false;
    const expectedRequest = new Request("http://your-api-url.com/users", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(formData),
    });

    return create(formData, isAuthenticated).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should include authorization header if user is authenticated", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
      appURL: "http://localhost:8000",
    };
    const isAuthenticated = true;
    const expectedRequest = new Request("http://your-api-url.com/users", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      }),
      body: JSON.stringify(formData),
    });

    jest
      .spyOn(require("../utils/userHelper"), "getAccessToken")
      .mockImplementation(() => "your-access-token");

    return create(formData, isAuthenticated).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should return a response object with the correct shape", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
      appURL: "http://localhost:8000",
    };
    const isAuthenticated = false;
    const expectedResponse = { status: 201, body: { message: "success" } };

    return create(formData, isAuthenticated).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});

describe("read", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ id: 123, name: "John Doe" }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it("should call fetch with the correct arguments", () => {
    const id = 123;
    const expectedRequest = new Request("http://your-api-url.com/users/123");

    return read(id).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should return a response object with the correct shape", () => {
    const id = 123;
    const expectedResponse = {
      status: 200,
      body: { id: 123, name: "John Doe" },
    };

    return read(id).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});

describe("update", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: "success" }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it("should call fetch with the correct arguments", () => {
    const id = "abc";
    const formData = {
      name: "John Doe",
      email: "john@example.com",
      houseNumber: "123",
      streetAddress: "Main St",
      city: "Anytown",
      postcode: "12345",
    };
    const expectedRequest = new Request("http://your-api-url.com/users/abc", {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      }),
      body: JSON.stringify(formData),
    });

    jest
      .spyOn(require("../utils/userHelper"), "getAccessToken")
      .mockImplementation(() => "your-access-token");

    return update(id, formData).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should return a response object with the correct shape", () => {
    const id = "abc";
    const formData = {
      name: "John Doe",
      email: "john@example.com",
      houseNumber: "123",
      streetAddress: "Main St",
      city: "Anytown",
      postcode: "12345",
    };
    const expectedResponse = { status: 200, body: { message: "success" } };

    return update(id, formData).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});
