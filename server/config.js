/**
 * Configuration file for Supabase
 * 
 * ⚠️ SECURITY WARNING: This file contains sensitive credentials
 * DO NOT commit this file to version control
 * Keep your credentials in .env file and use environment variables in production
 */

const SUPABASE_CONFIG = {
  url: "https://oyzykffjsorswwnwnmmh.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95enlrZmZqc29yc3d3bndubW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDc5NTEsImV4cCI6MjA4NzA4Mzk1MX0.3eM-b5yna3LlgZOZRppeogYnlGx6npw14xFCJl7RtXg"
};

// Export for browser (make it available globally)
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

// Export for Node.js/CommonJS modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
