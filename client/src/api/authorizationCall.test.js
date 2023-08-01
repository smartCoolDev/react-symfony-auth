import { create } from "./authorizationCalls";

describe("create", () => {
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
    const formData = { email: "john@example.com", password: "password123" };
    const expectedRequest = new Request(
      "http://localhost:8000/authorizations",
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(formData),
      }
    );

    return create(formData).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it("should return a response object with the correct shape", () => {
    const formData = { email: "john@example.com", password: "password123" };
    const expectedResponse = { status: 200, body: { message: "success" } };

    return create(formData).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});
