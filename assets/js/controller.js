// function ListController(model, view) {
//   this._model = model;
//   this._view = view;

//   var _this = this;


//   this._view.listItemClicked.attach(function (sender, args) {
//     if(_this._model.weatherInfo.cityName != args.thisCity) {
//       _this.getWeather(args);
//     }
//   });
// }

// ListController.prototype = {
//   getWeather: function(args) {
//     var that = this;
//     $.ajax({
//       url: 'http://api.openweathermap.org/data/2.5/weather?q=' + args.thisCity + ',uk&units=metric',
//       success:function(data){
//         that._model.setWeather(data);
//       }
//     });
//   }
// };

function InputsController(model, view, validShapes) {

  this._model = model;
  this._view = view;

  var _this = this;
  this._view.goDraw.attach(function (sender, args) {
    if(validShapes.indexOf(args.shapeType) > -1) {
      _this.getShape(args);
    } else if(args === 'init') {
      _this.getShape(args);
    } else {
      args.errorType = 'invalidShape';
      args.validShapes = validShapes;
      _this.updateErrors(args);
      return;
    }
    _this.updateErrors();
  });

  this._view.windowResize.attach(function (sender, args){
    console.log(args);
    _this.resizeCanvas(args);
  });

}

InputsController.prototype = {
  getShape: function(args) {
    var that = this;
    that._model.setShape(args);
  },
  updateErrors: function(args) {
    var that = this;
    that._model.setErrors(args);
  },
  resizeCanvas: function(args) {
    var that = this;
    that._model.setCanvasSize(args);
  }
}

// function DrawingController(model, view) {

//   this._model = model;
//   this._view = view;

//   var _this = this;
//   console.info(this._view);
//   this._view.goDraw.attach(function (sender, args) {
//     // if(_this._model.weatherInfo.cityName != args.thisCity) {
//     //   _this.getWeather(args);
//     // }
//   });

// }

// DrawingController.prototype = {
//   drawShape: function(args) {
//     var that = this;
//   }
// }