let store = {};
export default {
  setItem: jest.fn((key, value) => Promise.resolve((store[key] = value))),
  getItem: jest.fn(key => Promise.resolve(store[key] || null)),
  removeItem: jest.fn(key => Promise.resolve(delete store[key])),
  clear: jest.fn(() => Promise.resolve((store = {})))
}; 