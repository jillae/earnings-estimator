/**
 * STRUKTURERAD LOGGNING FÖR FÖRBÄTTRAD DEBUGGING
 * 
 * Centraliserad loggning med kategorier och nivåer
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'calculation' | 'validation' | 'ui' | 'state' | 'performance' | 'system';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  component?: string;
}

class StructuredLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Begränsa antal lagrade loggar

  private createEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
    component?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      component
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Begränsa antal loggar
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Konsol-utskrift med färgkodning
    const prefix = `[${entry.level.toUpperCase()}] [${entry.category}]`;
    const message = entry.component ? `${entry.component}: ${entry.message}` : entry.message;
    
    switch (entry.level) {
      case 'debug':
        console.debug(`%c${prefix}`, 'color: #666', message, entry.data || '');
        break;
      case 'info':
        console.info(`%c${prefix}`, 'color: #0066cc', message, entry.data || '');
        break;
      case 'warn':
        console.warn(`%c${prefix}`, 'color: #ff9900', message, entry.data || '');
        break;
      case 'error':
        console.error(`%c${prefix}`, 'color: #cc0000', message, entry.data || '');
        break;
    }
  }

  debug(category: LogCategory, message: string, data?: any, component?: string) {
    this.addLog(this.createEntry('debug', category, message, data, component));
  }

  info(category: LogCategory, message: string, data?: any, component?: string) {
    this.addLog(this.createEntry('info', category, message, data, component));
  }

  warn(category: LogCategory, message: string, data?: any, component?: string) {
    this.addLog(this.createEntry('warn', category, message, data, component));
  }

  error(category: LogCategory, message: string, data?: any, component?: string) {
    this.addLog(this.createEntry('error', category, message, data, component));
  }

  // Beräknings-specifika metoder
  calculationStart(component: string, inputs: any) {
    this.debug('calculation', 'Beräkning startad', inputs, component);
  }

  calculationResult(component: string, results: any) {
    this.info('calculation', 'Beräkning slutförd', results, component);
  }

  calculationError(component: string, error: any) {
    this.error('calculation', 'Beräkningsfel', error, component);
  }

  // Validerings-specifika metoder
  validationStart(component: string, data: any) {
    this.debug('validation', 'Validering startad', data, component);
  }

  validationSuccess(component: string, result: any) {
    this.info('validation', 'Validering godkänd', result, component);
  }

  validationFailure(component: string, errors: string[]) {
    this.warn('validation', 'Validering misslyckades', { errors }, component);
  }

  // State-specifika metoder
  stateChange(component: string, from: any, to: any) {
    this.debug('state', 'Tillståndsändring', { from, to }, component);
  }

  // UI-specifika metoder
  userAction(component: string, action: string, data?: any) {
    this.info('ui', `Användarhandling: ${action}`, data, component);
  }

  // Performance-specifika metoder
  performanceMark(component: string, operation: string, duration?: number) {
    this.debug('performance', `${operation} ${duration ? `(${duration}ms)` : 'start'}`, undefined, component);
  }

  // Hämta loggar för debugging
  getLogs(level?: LogLevel, category?: LogCategory): LogEntry[] {
    return this.logs.filter(log => {
      if (level && log.level !== level) return false;
      if (category && log.category !== category) return false;
      return true;
    });
  }

  // Exportera loggar för analys
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Rensa loggar
  clearLogs() {
    this.logs = [];
    this.info('system', 'Loggar rensade');
  }

  // Visa sammanfattning av loggar
  getLogSummary(): { [key: string]: number } {
    const summary: { [key: string]: number } = {};
    
    this.logs.forEach(log => {
      const key = `${log.level}_${log.category}`;
      summary[key] = (summary[key] || 0) + 1;
    });
    
    return summary;
  }
}

// Singleton-instans
export const logger = new StructuredLogger();

// Bekvämlighets-funktioner för vanliga användningsfall
export const logCalculation = {
  start: (component: string, inputs: any) => logger.calculationStart(component, inputs),
  result: (component: string, results: any) => logger.calculationResult(component, results),
  error: (component: string, error: any) => logger.calculationError(component, error)
};

export const logValidation = {
  start: (component: string, data: any) => logger.validationStart(component, data),
  success: (component: string, result: any) => logger.validationSuccess(component, result),
  failure: (component: string, errors: string[]) => logger.validationFailure(component, errors)
};

export const logState = {
  change: (component: string, from: any, to: any) => logger.stateChange(component, from, to)
};

export const logUI = {
  action: (component: string, action: string, data?: any) => logger.userAction(component, action, data)
};

export const logPerformance = {
  mark: (component: string, operation: string, duration?: number) => logger.performanceMark(component, operation, duration)
};