function InputsView(model, elements) {
  this._model = model;
  this._elements = elements;
  
  trigger = elements.trigger;
  clear = elements.clear;
  canvas = elements.canvas;

  this.goDraw = new Event(this);
  this.windowResize = new Event(this);

  var _this = this;

  this._model.newShape.attach(function () {
    _this.addShape();
  });

  this._model.updateErrors.attach(function () {
    _this.updateErrors();
  });

  $(trigger.selector).on('submit', function (e) {
    e.preventDefault();
    var shapeProps = {};
    $('.shapeVars input').each(function(){
      shapeProps[this.className] = $(this).val().toLowerCase();
    });
    
    _this.goDraw.notify(shapeProps);
  });

  $(window).on('resize', function() {
    _this.windowResize.notify(canvas);
  });

  $(function() {
    _this.windowResize.notify(canvas);
    _this.goDraw.notify('init');
  });

}

InputsView.prototype = {
  addShape: function() {
    var myCanvas = $('#myCanvas')[0],
    context = myCanvas.getContext('2d'),
    shapeProps = this._model.shapeProps;

    context.beginPath();
    if(shapeProps.shapeType === 'circle') {
      context.arc(shapeProps.posX, shapeProps.posY, shapeProps.width, 0, 2 * Math.PI, false);
    }
    if(shapeProps.shapeType === 'square') {
      context.rect(shapeProps.posX, shapeProps.posY, shapeProps.width, shapeProps.height)
    }
    if(shapeProps.shapeType === 'line') {
      context.moveTo(shapeProps.posX, shapeProps.posY);
      context.lineTo(shapeProps.width, shapeProps.height);
      context.stroke();
    }
    if(shapeProps.shapeType === 'clear') {
      // Store the current transformation matrix
        context.save();

      // Use the identity matrix while clearing the canvas
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, myCanvas.width, myCanvas.height);

      // Restore the transform
      context.restore();
      context.beginPath();
      context.rect(0, 0, myCanvas.width, myCanvas.height);
      context.fillStyle = shapeProps.fillColor;
      context.fill();
      return;
    }

    if(shapeProps.shapeType === 'fill') {

        
      // The CanvasPixelArray object indicates the color components of each pixel of an image, 
      // first for each of its three RGB values in order (0-255) and then its alpha component (0-255), 
      // proceeding from left-to-right, for each row (rows are top to bottom).
      // That's why we have to assign each color component separately. 
      function getPixelColor(img, x, y) {
        var data = img.data;
        var offset = ((y * (img.width * 4)) + (x * 4));
        var result = data[offset + 0] << 24; // r
        result |= data[offset + 1] << 16; // g
        result |= data[offset + 2] << 8; // b
        return result;
      }

      function hexToRGB(hex){
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 0xFF;
        var b = bigint & 255;
        return [r,g,b,255];
      }

        // flood fill tool
      (function toolFiller() {
        
        // BUG: infinite recursion when the area is already filled with the active color.

        // Putting the offsets in such an order as to minimize the
        // possibility of cache miss during array access.
        var dx = [ 0, -1, +1,  0];
        var dy = [-1,  0,  0, +1];

        var img = context.getImageData(0, 0, myCanvas.width, myCanvas.height);
        var imgData = img.data;
        var hitColor = getPixelColor(img, parseInt(shapeProps.posX), parseInt(shapeProps.posY));
        var newColor = (parseInt(hexToRGB(shapeProps.fillColor.substring(1,7))[0]) << 24) | (parseInt(hexToRGB(shapeProps.fillColor.substring(1,7))[1]) << 16) | (parseInt(hexToRGB(shapeProps.fillColor.substring(1,7))[2]) << 8);
        
        if(hitColor === newColor) {
          //color at point is already the desired color, prevents script freezing
          return false;
        }

        var stack = [];
        stack.push(parseInt(shapeProps.posX));
        stack.push(parseInt(shapeProps.posY));

        while (stack.length > 0) {
          var curPointY = stack.pop();
          var curPointX = stack.pop();

          for (var i = 0; i < 4; i++) {
            var nextPointX = curPointX + dx[i];
            var nextPointY = curPointY + dy[i];

            if (nextPointX < 0 || nextPointY < 0 || nextPointX >= myCanvas.width || nextPointY >= myCanvas.height) {
                continue;
            }
            // Inline implementation of isSameColor.
            var nextPointOffset = (nextPointY * myCanvas.width + nextPointX) * 4;
            if (imgData[nextPointOffset + 0] == ((hitColor >> 24) & 0xFF)
              && imgData[nextPointOffset + 1] == ((hitColor >> 16) & 0xFF) 
              && imgData[nextPointOffset + 2] == ((hitColor >> 8) & 0xFF))
            {
              // Inline implementation of setPixelColor.
              imgData[nextPointOffset + 0] = (newColor >> 24) & 0xFF;
              imgData[nextPointOffset + 1] = (newColor >> 16) & 0xFF;
              imgData[nextPointOffset + 2] = (newColor >>  8) & 0xFF;
              imgData[nextPointOffset + 3] = 255;

              stack.push(nextPointX);
              stack.push(nextPointY);
            }
          }
        }
        context.putImageData(img, 0, 0);
        return;
      })();

    }

    context.fillStyle = shapeProps.fillColor;
    context.fill();
    if(shapeProps.borderWidth>0){
      context.lineWidth = shapeProps.borderWidth;
      context.strokeStyle = shapeProps.borderColor;
      context.stroke();
    }
        
  },
  updateErrors: function() {
    var errorBox = $('.errorBox');
    errorBox.text(this._model.errorMsg);
  },
  canvasResize: function() {
  }
};

