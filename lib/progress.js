var eventy = require('eventy');

module.exports = Progress;

function Progress() {
  var progress = eventy(this);

  progress.begin = 0;
  progress.end = 1;
  progress.fps = 60;
  progress.duration = 0;
  progress.continuous = false;

  progress.on('step', function (progression) {
    progress.onStep && progress.onStep(progression);
  });

  progress.on('end', function () {
    progress.onEnd && progress.onEnd();
  });
}

/**
 * Setup delta, linear by default
 */
Progress.prototype.delta = function (progress) {
  return progress;
}

/**
 * Start progress calculation
 */
Progress.prototype.start = function () {
  var start = new Date;

  function step() {
    var passed = new Date - start;
    var progress, progressDelta;

    progress = passed / this.duration;
    this.trigger('progress', progress);

    if (progress > 1) {
      progress = 1;
    }

    progressDelta = this.delta(progress);
    this.trigger('progress-delta', progressDelta);
    this.trigger('step', progressDelta * this.end + this.begin);

    if (passed >= this.duration) {
      this.trigger('end');

      if (!this.continuous) {
        this.stop();
      }
    }
  }

  this.id = setInterval(step.bind(this), 1000 / this.fps);
}

/**
 * Stop progress calculation
 */
Progress.prototype.stop = function () {
  if (this.id) {
    clearInterval(this.id);
    this.id = null;
    this.trigger('stop');
  }
}

/**
 * Pause progress calculation
 */
Progress.prototype.pause = function () {

}
