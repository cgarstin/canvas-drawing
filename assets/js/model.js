'use strict';
function ShapeModel(props) {
    this._props = props;

  this.newShape = new Event(this);
  this.updateErrors = new Event(this);

  this.shapeProps = {};

}

ShapeModel.prototype = {
  setShape: function(shapeProps) {
    
    this.shapeProps.shapeType = shapeProps.shapeType;
    this.shapeProps.posX = shapeProps.posX;
    this.shapeProps.posY = shapeProps.posY;
    this.shapeProps.width = shapeProps.width;
    this.shapeProps.height = shapeProps.height;
    this.shapeProps.fillColor = shapeProps.fillColor;
    this.shapeProps.borderWidth = shapeProps.borderWidth;
    this.shapeProps.borderColor = shapeProps.borderColor;

    //required removes transparency on the canvas
    if(shapeProps === 'init') {
      this.shapeProps.shapeType = 'square';
      this.shapeProps.posX = 0;
      this.shapeProps.posY = 0;
      this.shapeProps.width = $('#myCanvas')[0].width;
      this.shapeProps.height = $('#myCanvas')[0].height;
      this.shapeProps.fillColor = '#ffffff';
      this.shapeProps.init = true;
    }
    
    this.newShape.notify();
  
  },
  setErrors: function(args) {
    if(typeof args === 'undefined') {
      this.errorMsg = "";
      this.updateErrors.notify();
    } else if(args.errorType === 'invalidShape') {
      this.errorMsg = "\"" + args.shapeType + "\" isn't an accepted shape, please type one of: " + args.validShapes.toString().replace(/,/g,', ');
      this.updateErrors.notify();
    }
  },
  setCanvasSize: function(args) {
    var canvas = $(args.selector),
        context = canvas[0].getContext('2d'),
        container = canvas.parent(),
        image = context.getImageData(0, 0, canvas.width(), canvas.height());;
        canvas.attr('width', $(container).width() );
        canvas.attr('height', $(container).width()/1.62 )
        context.putImageData(image, 0, 0);
  }
};

