// jest.setup.js
import { TextEncoder, TextDecoder } from "util";

// Fix TextEncoder/TextDecoder cho jsdom
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Mock react-router-dom với navigate có thể assert
export const navigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
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
