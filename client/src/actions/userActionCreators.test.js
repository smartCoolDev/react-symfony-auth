import { USER_IDENTITY_UPDATE } from "../constants/actionTypeConstants";
import {
  logIn,
  logOut,
  updateDetails,
  register,
  viewOne,
} from "./userActionCreators";
import { push } from "react-router-redux";

describe("logIn", () => {
  it("should handle successful login", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 200,
      body: {
        attributes: {
          accessToken: "abc123",
          userID: 123,
        },
      },
    };

    const dispatch = jest.fn();
    const createAuthorizationMock = jest.fn(() =>
      Promise.resolve(mockResponse)
    );

    return logIn(formData)(dispatch, createAuthorizationMock).then(() => {
      expect(createAuthorizationMock).toHaveBeenCalledWith(formData);
      expect(dispatch).toHaveBeenCalledWith({
        type: USER_IDENTITY_UPDATE,
        token: mockResponse.body.attributes.accessToken,
      });
      expect(dispatch).toHaveBeenCalledWith(
        push(
          ROUTE_USER_DETAILS.replace(
            ":id",
            String(mockResponse.body.attributes.userID)
          )
        )
      );
    });
  });

  it("should handle login with errors", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 401,
      body: {
        message: "Invalid email or password",
      },
    };

    const dispatch = jest.fn();
    const createAuthorizationMock = jest.fn(() =>
      Promise.resolve(mockResponse)
    );

    return logIn(formData)(dispatch, createAuthorizationMock).then(() => {
      expect(createAuthorizationMock).toHaveBeenCalledWith(formData);
      expect(dispatch).toHaveBeenCalledWith({
        type: LOGIN_FORM_UPDATE,
        errors: {
          email: [mockResponse.body.message],
          password: [" "],
        },
      });
    });
  });

  it("should throw an error for unexpected response", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 500,
      body: {},
    };

    const dispatch = jest.fn();
    const createAuthorizationMock = jest.fn(() =>
      Promise.resolve(mockResponse)
    );

    return logIn(formData)(dispatch, createAuthorizationMock).catch((error) => {
      expect(error.message).toBe("Unexpected response returned.");
    });
  });
});

describe("logOut", () => {
  it("should dispatch actions to log out user and redirect to login page", () => {
    const dispatch = jest.fn();

    logOut()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: USER_IDENTITY_UPDATE,
      token: null,
    });
    expect(dispatch).toHaveBeenCalledWith(push(ROUTE_LOGIN));
  });
});

describe("updateDetails", () => {
  it("should handle successful details update", () => {
    const id = "123";
    const formData = {
      name: "John Doe",
      email: "john@example.com",
      houseNumber: "123",
      streetAddress: "Main St",
      city: "Anytown",
      postcode: "12345",
    };

    const mockResponse = {
      status: 200,
      body: {
        attributes: formData,
      },
    };

    const dispatch = jest.fn();
    const updateMock = jest.fn(() => Promise.resolve(mockResponse));

    return updateDetails(id, formData)(dispatch, updateMock).then(() => {
      expect(updateMock).toHaveBeenCalledWith(id, formData);
      expect(dispatch).toHaveBeenCalledWith({
        type: USER_DETAILS_UPDATE,
        attributes: mockResponse.body.attributes,
        message: null,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: APP_NOTIFICATIONS_ADD,
        tag: "success",
        message: "Your details have been updated.",
        redirect: false,
      });
    });
  });

  it("should handle details update with errors", () => {
    const id = "123";
    const formData = {
      name: "",
      email: "john@example.com",
      houseNumber: "123",
      streetAddress: "Main St",
      city: "Anytown",
      postcode: "12345",
    };

    const mockResponse = {
      status: 422,
      body: {
        errors: {
          name: ["Name is required"],
        },
      },
    };

    const dispatch = jest.fn();
    const updateMock = jest.fn(() => Promise.resolve(mockResponse));

    return updateDetails(id, formData)(dispatch, updateMock).then(() => {
      expect(updateMock).toHaveBeenCalledWith(id, formData);
      expect(dispatch).toHaveBeenCalledWith({
        type: USER_DETAILS_UPDATE,
        attributes: {},
        message: mockResponse.body.errors.name[0],
      });
    });
  });

  it("should throw an error for unexpected response", () => {
    const id = "123";
    const formData = {
      name: "John Doe",
      email: "john@example.com",
      houseNumber: "123",
      streetAddress: "Main St",
      city: "Anytown",
      postcode: "12345",
    };

    const mockResponse = {
      status: 500,
      body: {},
    };

    const dispatch = jest.fn();
    const updateMock = jest.fn(() => Promise.resolve(mockResponse));

    return updateDetails(id, formData)(dispatch, updateMock).catch((error) => {
      expect(error.message).toBe("Unexpected response returned.");
    });
  });
});

describe("register", () => {
  it("should dispatch the correct actions on successful registration", () => {
    const formData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 200,
      body: {},
    };

    const createMock = jest.fn(() => Promise.resolve(mockResponse));
    const dispatch = jest.fn();

    return register(
      formData,
      createMock
    )(dispatch).then(() => {
      expect(createMock).toHaveBeenCalledWith(formData, false);
      expect(dispatch).toHaveBeenCalledWith({
        type: REGISTRATION_FORM_UPDATE,
        errors: {},
        reset: true,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: APP_NOTIFICATIONS_ADD,
        tag: "success",
        message: "A user successfully created.",
        redirect: false,
      });
    });
  });
});

describe("viewOne", () => {
  it("should handle successful user details retrieval", () => {
    const id = 123;
    const mockResponse = {
      status: 200,
      body: {
        attributes: {
          name: "John Doe",
          email: "john@example.com",
          houseNumber: "123",
          streetAddress: "Main St",
          city: "Anytown",
          postcode: "12345",
        },
      },
    };
    const dispatch = jest.fn();
    const readMock = jest.fn(() => Promise.resolve(mockResponse));

    return viewOne(id)(dispatch, readMock).then(() => {
      expect(readMock).toHaveBeenCalledWith(id);
      expect(dispatch).toHaveBeenCalledWith({
        type: USER_DETAILS_UPDATE,
        attributes: mockResponse.body.attributes,
        message: null,
      });
    });
  });

  it("should handle user details retrieval with errors", () => {
    const id = 123;
    const mockResponse = {
      status: 404,
      body: {
        message: "User not found",
      },
    };
    const dispatch = jest.fn();
    const readMock = jest.fn(() => Promise.resolve(mockResponse));

    return viewOne(id)(dispatch, readMock).then(() => {
      expect(readMock).toHaveBeenCalledWith(id);
      expect(dispatch).toHaveBeenCalledWith({
        type: USER_DETAILS_UPDATE,
        attributes: {},
        message: mockResponse.body.message,
      });
    });
  });

  it("should throw an error for unexpected response", () => {
    const id = 123;
    const mockResponse = {
      status: 500,
      body: {},
    };
    const dispatch = jest.fn();
    const readMock = jest.fn(() => Promise.resolve(mockResponse));

    return viewOne(id)(dispatch, readMock).catch((error) => {
      expect(error.message).toBe("Unexpected response returned.");
    });
  });
});
