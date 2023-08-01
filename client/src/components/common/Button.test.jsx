import { create, read } from './path/to/your/file';

describe('create', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ message: 'success' }),
    }));
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should call fetch with the correct arguments', () => {
    const formData = { passwordReset: { email: 'john@example.com', appURL: 'http://localhost:8000' } };
    const isAuthenticated = false;
    const expectedRequest = new Request('http:/localhost:8000/user-tokens', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(formData),
    });

    return create(formData, isAuthenticated).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it('should include authorization header if user is authenticated', () => {
    const formData = { emailChange: { newEmail: 'jane@example.com', appURL: 'http://localhost:8000' } };
    const isAuthenticated = true;
    const expectedRequest = new Request('http:/localhost:8000/user-tokens', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer YOUR_ACCESS_TOKEN' }),
      body: JSON.stringify(formData),
    });

    jest.spyOn(userHelper, 'getAccessToken').mockReturnValue('YOUR_ACCESS_TOKEN');

    return create(formData, isAuthenticated).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it('should return a response object with the correct shape', () => {
    const formData = { passwordReset: { email: 'john@example.com', appURL: 'http://localhost:8000' } };
    const expectedResponse = { status: 201, body: { message: 'success' } };

    return create(formData, false).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});

describe('read', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ userToken: {} }),
    }));
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should call fetch with the correct arguments', () => {
    const token = 'YOUR_USER_TOKEN';
    const expectedRequest = new Request('http:/localhost:8000/user-tokens/YOUR_USER_TOKEN');

    return read(token).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(expectedRequest);
    });
  });

  it('should return a response object with the correct shape', () => {
    const token = 'YOUR_USER_TOKEN';
    const expectedResponse = { status: 200, body: { userToken: {} } };

    return read(token).then((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });
});
