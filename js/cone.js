export function cone(xrot, yrot, zrot) {
  var r = 200;
  var h = 280;
  var dAlpha = 0.1;
  var nodes = [];
  var faces = [];
  var alpha = 0;
  nodes[0] = [0, -h / 2, 0];
  var i = 1;
  while (alpha <= 2 * Math.PI + dAlpha) {
    var x = r * Math.cos(alpha);
    var z = r * Math.sin(alpha);
    nodes[i] = [x, h / 2, z];
    alpha += dAlpha;
    i += 1;
  }
  var p = 0;
  for (var n = 0; n < nodes.length - 1; n++) {
    var face = [nodes[0], nodes[p], nodes[p + 1]];
    faces[n] = face;
    p += 1;
  }

  function rotateZ3D(theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var x = node[0];
      var y = node[1];
      node[0] = x * cosTheta - y * sinTheta;
      node[1] = y * cosTheta + x * sinTheta;
    }
  }
  function rotateY3D(theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var x = node[0];
      var z = node[2];
      node[0] = x * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + x * sinTheta;
    }
  }

  // Rotate shape around the x-axis
  function rotateX3D(theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var y = node[1];
      var z = node[2];
      node[1] = y * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + y * sinTheta;
    }
  }

  rotateZ3D((zrot * Math.PI) / 180);
  rotateX3D((xrot * Math.PI) / 180);
  rotateY3D((yrot * Math.PI) / 180);

  return { faces, nodes };
}
