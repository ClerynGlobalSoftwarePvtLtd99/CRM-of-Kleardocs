// Temporary fix for error handling
const errorHandlingFix = `
      let errorMessage = 'Failed to process request';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.toString && typeof error.toString === 'function') {
        errorMessage = error.toString();
      }
      showToastMessage(errorMessage, "error");
`;

console.log('Error handling fix ready');
