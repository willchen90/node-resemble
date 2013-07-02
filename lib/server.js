var Canvas = require('canvas'),
      Image = Canvas.Image,
    fs = require('graceful-fs');

module.exports = {
  createCanvas: function(width, height) {
    return new Canvas(width, height);
  },
  loadImageData: function( path, callback ){

    fs.readFile(path, function(err, data) {
      if (err) {
        throw err;
      }

      var hiddenImage = new Image();
      hiddenImage.src = data;

      var width = hiddenImage.width;
      var height = hiddenImage.height;
      var hiddenCanvas =  new Canvas(width, height);

      var context = hiddenCanvas.getContext('2d');
      context.drawImage(hiddenImage, 0, 0, width, height);

      var imageData = context.getImageData(0, 0, width, height);

      callback(imageData, width, height);
    });
  }
};
