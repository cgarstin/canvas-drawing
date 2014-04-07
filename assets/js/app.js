$(function () {
  
  var shape = new ShapeModel([]),
      validShapes = ['square', 'circle', 'line', 'clear', 'fill'],
  shapeInput = new InputsView(shape, {
    'shapeVars': $('.shapeVars'),
    'trigger': $('.drawForm'),
    'canvas': $('#myCanvas')
  })

  inputsController = new InputsController(shape, shapeInput, validShapes);
  
});