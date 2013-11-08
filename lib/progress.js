var eventy = require('eventy');

module.exports = Progress;

function Progress() {
  var progress = this;

  eventy(progress);
  progress.begin = 0;
  progress.end = 1;
  progress.fps = 60;
  progress.duration = 0;

  progress.on('step', function () {
    progress.onStep && progress.onStep();
  });

  progress.on('end', function () {
    progress.onEnd && progress.onEnd();
  });
}

function linear(time, begin, end, duration) {
  return time / duration * (end - begin);
}

/**
 * Setup easing, linear by default
 */
Progress.prototype.easing = linear;

/**
 * Start progress calculation
 */
Progress.prototype.start = function () {
  var progress = this;
  var start = new Date;

  function step() {
    var passed = new Date - start;
    var progression = progress.easing(passed, 0, 1, progress.duration);

    if (progression > 1) {
      progression = 1;
    }

    progress.onStep(progression * (progress.end - progress.begin));

    if (passed >= progress.duration) {
      progress.trigger('end');
      progress.stop();
    }
  }

  this.id = setInterval(step, 1000 / this.fps);
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
