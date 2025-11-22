class AlarmClock {
  constructor() {
    this.alarmCollection = [];
    this.intervalId = null;
    this.checkIntervalMs = 1000; 
  }

  /**
   * @param {string} time 
   * @param {Function} callback
   */
  addClock(time, callback) {
    this._validateAlarmParameters(time, callback);
    this._warnIfAlarmExists(time);
    
    this.alarmCollection.push({
      callback,
      time,
      canCall: true
    });
  }

  _validateAlarmParameters(time, callback) {
    if (!time || !callback) {
      throw new Error('Отсутствуют обязательные аргументы');
    }
  }

  _warnIfAlarmExists(time) {
    const alarmExists = this.alarmCollection.some(alarm => alarm.time === time);
    if (alarmExists) {
      console.warn('Уже присутствует звонок на это же время');
    }
  }

  /**
   * @param {string} time
   */
  removeClock(time) {
    this.alarmCollection = this.alarmCollection.filter(
      alarm => alarm.time !== time
    );
  }

  /**
   * @returns {string}
   */
  getCurrentFormattedTime() {
    return new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  start() {
    if (this._isAlreadyRunning()) {
      return;
    }

    this.intervalId = setInterval(() => {
      this._checkAndExecuteAlarms();
    }, this.checkIntervalMs);
  }


  _isAlreadyRunning() {
    return this.intervalId !== null;
  }

  _checkAndExecuteAlarms() {
    const currentTime = this.getCurrentFormattedTime();
    
    this.alarmCollection.forEach(alarm => {
      if (this._shouldAlarmRing(alarm, currentTime)) {
        this._executeAlarm(alarm);
      }
    });
  }


  _shouldAlarmRing(alarm, currentTime) {
    return alarm.time === currentTime && alarm.canCall;
  }

  _executeAlarm(alarm) {
    alarm.canCall = false;
    alarm.callback();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  resetAllCalls() {
    this.alarmCollection.forEach(alarm => {
      alarm.canCall = true;
    });
  }

  clearAlarms() {
    this.stop();
    this.alarmCollection = [];
  }
}