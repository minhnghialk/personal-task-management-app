// jest.setup.js
import { TextEncoder, TextDecoder } from "util";

// Fix TextEncoder/TextDecoder cho jsdom
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Mock CSS/SCSS
jest.mock("*.css", () => ({}));
jest.mock("*.scss", () => ({}));

// Mock react-router-dom
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    Link: ({ children }) => children,
  };
});

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock fetch toàn cục
globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
