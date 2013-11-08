var eventy = require('eventy');

module.exports = Progress;

function Progress() {
  var progress = eventy(this);

  progress.fps = 60;
  progress.begin = 0;
  progress.end = 1;
  progress.progression = progress.begin;
}

/**
 * Start progress
 */
Progress.prototype.start = function () {
  function step() {
    this.trigger('step');
    this.trigger('progression', this.progression);
  }

  this.id = setInterval(step.bind(this), 1000 / this.fps);
}

Progress.prototype.forward = function (duration, delta) {
  duration = duration || 0;
  delta = delta || linear;

  if (duration === 0) {
    this.progression = this.end;
    this.trigger('forward-end');

    return;
  }

  var start = new Date;

  this.on('step', step);

  function step() {
    var passed = new Date - start;
    var progression = passed / duration;

    if (progression > 1) {
      progression = 1;
    }

    progression = delta(progression);
    this.progression = progression * this.end + this.begin;
    this.trigger('forward-step', this.progression);

    if (passed >= duration) {
      this.off('step', step);
      this.trigger('forward-end');
    }
  }
}

Progress.prototype.backward = function (duration, delta) {
  duration = duration || 0;
  delta = delta || linear;

  if (duration === 0) {
    this.progression = this.begin;
    this.trigger('backward-end');

    return;
  }

  var start = new Date;

  this.on('step', step);

  function step() {
    var passed = new Date - start;
    var progression = 1 - passed / duration;

    if (progression < 0) {
      progression = 0;
    }

    progression = delta(progression);
    this.progression = progression * this.end + this.begin;
    this.trigger('backward-step', this.progression);

    if (passed >= duration) {
      this.trigger('backward-end');
      this.off('step', step);
    }
  }
}

/**
 * Stop progress
 */
Progress.prototype.stop = function (duration, delta) {
  if (this.id) {
    clearInterval(this.id);
    this.id = null;
    this.trigger('stop');
  }
}

/**
 * Pause progress
 */
Progress.prototype.pause = function () {

}
