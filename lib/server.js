var Canvas = require('canvas'),
      Image = Canvas.Image,
    fs = require('graceful-fs');

module.exports = {
  createCanvas: function(width, height) {
    return new Canvas(width, height);
  },
  loadImageData: function(path, callback) {
    if (Buffer.isBuffer(path)) {
      load(undefined, path);
    } else {
      fs.readFile(path, load);
    }

    function load(err, data) {
      if (err) {
        throw err;
      }

      function fakeImageData(callback) {
        var hiddenCanvas = new Canvas(0, 0),
            context = hiddenCanvas.getContext('2d'),
            imageData = context.getImageData(0, 0, 0, 0);

        return callback(imageData, 0, 0);
      }

      // node-canvas will segfault if passed an empty input. Protect from this case.
      // Tracked under https://github.com/LearnBoost/node-canvas/issues/285
      if (!data.length) {
        fakeImageData(callback);
      }

      var hiddenImage = new Image();

      // Some images may not be loaded due to errors. This protects against that.
      hiddenImage.onerror = function() {
        fakeImageData(callback);
      };

      // Wait for image to be loaded before trying to draw it to the hidden canvas
      hiddenImage.onload = function() {
        var width = hiddenImage.width,
            height = hiddenImage.height;

        var hiddenCanvas = new Canvas(width, height),
            context = hiddenCanvas.getContext('2d');

        context.drawImage(hiddenImage, 0, 0, width, height);

        var imageData = context.getImageData(0, 0, width, height);

        callback(imageData, width, height);
      };

      hiddenImage.src = data;
    }
  }
};
