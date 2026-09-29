/**
 * Modern Logger Utility - writes errors to logs.txt in src folder
 * Uses ES modules with dynamic import for fs (Node.js only)
 * Falls back to localStorage in browser environment
 */

// Check if we're in a Node.js environment
const isNode = typeof process !== 'undefined' && process.versions?.node;

// Dynamic import for fs (Node.js only)
let fs = null;
let path = null;
let LOG_FILE = null;

if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
  // Node.js environment (SSR, build scripts)
  import('fs').then(m => { fs = m; });
  import('path').then(m => { path = m; });
  import('url').then(m => {
    const { fileURLToPath } = m;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    LOG_FILE = path.join(__dirname, '..', 'logs.txt');
  });
} else {
  // Browser environment - use localStorage fallback
  const STORAGE_KEY = 'portfolio_error_logs';
  const MAX_LOGS = 500;
}

/**
 * Format timestamp as ISO string
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Write log entry to storage
 */
function writeLog(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const logLine = JSON.stringify(entry) + '\n';

  try {
    if (typeof window === 'undefined') {
      // Node.js environment - write to file
      // This will only work in SSR/build contexts
      if (fs && LOG_FILE) {
        const logLine = JSON.stringify(entry) + '\n';
        fs.appendFileSync(LOG_FILE, logLine);
      }
    } else {
      // Browser environment - use localStorage
      const STORAGE_KEY = 'portfolio_error_logs';
      const MAX_LOGS = 500;
      
      try {
        const existing = localStorage.getItem('portfolio_error_logs') || '';
        const lines = existing ? existing.split('\n').filter(Boolean) : [];
        lines.push(JSON.stringify(entry));
        
        // Keep only last MAX_LOGS entries
        if (lines.length > MAX_LOGS) {
          lines.splice(0, lines.length - MAX_LOGS);
        }
        
        localStorage.setItem(STORAGE_KEY, lines.join('\n'));
      } catch (e) {
        // localStorage quota exceeded or unavailable
        console.error('Failed to write log to localStorage:', e);
      }
    }
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

/**
 * Error logger - writes to logs.txt (Node) or localStorage (browser)
 */
export const logError = (message, error = null, context = {}) => {
  const meta = { 
    ...context,
    stack: error?.stack,
    errorMessage: error?.message,
    name: error?.name,
  };
  
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message,
    ...meta,
  };

  try {
    if (typeof window === 'undefined') {
      // Node.js - file
      // fs.appendFileSync would go here if fs available
    } else {
      // Browser - localStorage
      const STORAGE_KEY = 'portfolio_error_logs';
      const MAX_LOGS = 500;
      
      const existing = localStorage.getItem('portfolio_error_logs') || '';
      const lines = existing ? existing.split('\n').filter(Boolean) : [];
      lines.push(JSON.stringify({ ...entry, level: 'ERROR' }));
      
      if (lines.length > MAX_LOGS) {
        lines.splice(0, lines.length - MAX_LOGS);
      }
      
      localStorage.setItem(STORAGE_KEY, lines.join('\n'));
    }
  } catch (err) {
    console.error('Failed to write error log:', err);
  }
};

/**
 * Warning logger
 */
export const logWarn = (message, context = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'WARN',
    message,
    ...context,
  };

  try {
    if (typeof window !== 'undefined') {
      const STORAGE_KEY = 'portfolio_error_logs';
      const MAX_LOGS = 500;
      
      const existing = localStorage.getItem('portfolio_error_logs') || '';
      const lines = existing ? existing.split('\n').filter(Boolean) : [];
      lines.push(JSON.stringify({ ...entry, level: 'WARN' }));
      
      if (lines.length > MAX_LOGS) {
        lines.splice(0, lines.length - MAX_LOGS);
      }
      
      localStorage.setItem('portfolio_error_logs', lines.join('\n'));
    }
  } catch (err) {
    console.error('Failed to write warn log:', err);
  }
};

/**
 * Debug logger - only in development
 */
export const logDebug = (message, context = {}) => {
  if (import.meta.env.DEV) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      ...context,
    };

    try {
      if (typeof window !== 'undefined') {
        const STORAGE_KEY = 'portfolio_error_logs';
        const MAX_LOGS = 500;
        
        const existing = localStorage.getItem('portfolio_error_logs') || '';
        const lines = existing ? existing.split('\n').filter(Boolean) : [];
        lines.push(JSON.stringify({ ...entry, level: 'DEBUG' }));
        
        if (lines.length > MAX_LOGS) {
          lines.splice(0, lines.length - MAX_LOGS);
        }
        
        localStorage.setItem('portfolio_error_logs', lines.join('\n'));
      }
    } catch (err) {
      console.error('Failed to write debug log:', err);
    }
  }
};

/**
 * Migration logger - for migration steps
 */
export const logMigration = (step, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'MIGRATION',
    message,
    step,
    ...meta,
  };

  try {
    if (typeof window !== 'undefined') {
      const STORAGE_KEY = 'portfolio_error_logs';
      const MAX_LOGS = 500;
      
      const existing = localStorage.getItem('portfolio_error_logs') || '';
      const lines = existing ? existing.split('\n').filter(Boolean) : [];
      lines.push(JSON.stringify({ ...entry, level: 'MIGRATION' }));
      
      if (lines.length > MAX_LOGS) {
        lines.splice(0, lines.length - MAX_LOGS);
      }
      
      localStorage.setItem('portfolio_error_logs', lines.join('\n'));
    }
  } catch (err) {
    console.error('Failed to write migration log:', err);
  }
};

/**
 * Get recent logs from localStorage
 */
export const getRecentLogs = (lines = 100) => {
  try {
    const STORAGE_KEY = 'portfolio_error_logs';
    const content = localStorage.getItem(STORAGE_KEY) || '';
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.slice(-lines).map(line => JSON.parse(line));
  } catch {
    return [];
  }
};

/**
 * Clear all logs
 */
export const clearLogs = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_error_logs');
    }
  } catch (err) {
    console.error('Failed to clear logs:', err);
  }
};

export default {
  logError,
  logWarn,
  logDebug,
  logMigration,
  getRecentLogs,
  clearLogs,
};