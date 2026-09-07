/** Replace these mock methods with API calls once the backend is available. */
export const authService = {
  requestOtp: async (phone: string) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { phone, expiresInSeconds: 300 };
  },
  verifyOtp: async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { verified: code.length === 4 };
  },
};
