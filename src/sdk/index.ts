// CraveTray SDK - Main Export
// Note: Product-related components have been removed as they're not needed

// Version
export const SDK_VERSION = '1.0.0';

// Default styles for easy integration
export const defaultStyles = `
  .cravetray-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
  
  .cravetray-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    max-width: 28rem;
    margin: 0 auto;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
  }
`;