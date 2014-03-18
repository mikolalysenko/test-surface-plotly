"use strict"

var shell = require("gl-now")({ clearColor: [0,0,0,0] })
var camera = require("game-shell-orbit-camera")(shell)
var createSurface = require("gl-surface-plot")
var createAxes = require("gl-axes")

var ndarray = require("ndarray")
var fill = require("ndarray-fill")
var diric = require("dirichlet")
var glm = require("gl-matrix")
var mat4 = glm.mat4

var surface, axes

shell.on("gl-init", function() {
  var gl = shell.gl
  gl.enable(gl.DEPTH_TEST)

  //Set up camera
  camera.lookAt(
    [0, 0, 2],      //Eye position
    [256, 256, 64], //Eye target
    [0, 0, 1])      //Up direction

  //Create field
  var field = ndarray(new Float32Array(512*512), [512,512])
  fill(field, function(x,y) {
    return 128 * diric(10, 10.0*(x-256)/512) * diric(10, 10.0*(y-256)/512)
  })
  surface = createSurface(gl, field)
  axes = createAxes(gl, { extents: surface.bounds, tickSpacing: [16,16,16] })
})

shell.on("gl-render", function() {
  var cameraParams = {
    view: camera.view(),
    projection:  mat4.perspective(new Array(16), Math.PI/4.0, shell.width/shell.height, 0.1, 1000000.0)
  }
  surface.draw(cameraParams)
  axes.draw(cameraParams)
})