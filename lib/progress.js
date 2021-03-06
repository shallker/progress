var eventy = require('eventy');

module.exports = Progress;

function Progress() {
  var progress = eventy(this);

  progress.begin = 0;
  progress.end = 1;
  progress.duration = 1000;

  Object.defineProperty(progress, 'progression', {
    get: function () {
      var passed = new Date - this.startTime;
      var progression = passed / this.duration;

      if (progression > 1) {
        progression = 1;
        this.done = true;
      }

      progression = this.delta(progression);

      return progression * (this.end - this.begin) + this.begin;
    }
  });

  Object.defineProperty(progress, 'done', {
    get: function () {
      var passed = new Date - this.startTime;

      if (passed > this.duration) {
        return true;
      } else {
        return false;
      }
    }
  });
}

Progress.prototype.delta = function (progression) {
  return progression;
}

Progress.prototype.start = function () {
  this.startTime = new Date;
}
