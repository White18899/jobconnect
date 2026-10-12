/**
 * SideRays - WebGL Volumetric Rays Background Effect
 * Based on React Bits SideRays component by Nathan Gordon / ReactBits
 * Native WebGL implementation for high-performance, zero-dependency deployment
 */

(function () {
  'use strict';

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  }

  function originToFlip(origin) {
    switch (origin) {
      case 'top-left': return [1, 0];
      case 'bottom-right': return [0, 1];
      case 'bottom-left': return [1, 1];
      default: return [0, 0]; // top-right
    }
  }

  var VERT_SRC = [
    'attribute vec2 position;',
    'void main() {',
    '  gl_Position = vec4(position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_SRC = [
    'precision highp float;',
    'uniform float iTime;',
    'uniform vec2 iResolution;',
    'uniform float iSpeed;',
    'uniform vec3 iRayColor1;',
    'uniform vec3 iRayColor2;',
    'uniform float iIntensity;',
    'uniform float iSpread;',
    'uniform float iFlipX;',
    'uniform float iFlipY;',
    'uniform float iTilt;',
    'uniform float iSaturation;',
    'uniform float iBlend;',
    'uniform float iFalloff;',
    'uniform float iOpacity;',

    'float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {',
    '  vec2 sourceToCoord = coord - raySource;',
    '  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);',
    '  return clamp(',
    '    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +',
    '    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),',
    '    0.0, 1.0) *',
    '    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);',
    '}',

    'void main() {',
    '  vec2 fragCoord = gl_FragCoord.xy;',
    '  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;',
    '  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;',

    '  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);',
    '  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);',

    '  float tiltRad = iTilt * 3.14159265 / 180.0;',
    '  float cs = cos(tiltRad);',
    '  float sn = sin(tiltRad);',
    '  vec2 rel = coord - rayPos;',
    '  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;',

    '  float halfSpread = iSpread * 0.275;',
    '  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));',
    '  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));',

    '  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);',
    '  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);',

    '  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;',

    '  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;',
    '  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);',
    '  color.rgb *= brightness;',

    '  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));',
    '  color.rgb = mix(vec3(gray), color.rgb, iSaturation);',

    '  color.a = max(color.r, max(color.g, color.b)) * iOpacity;',
    '  gl_FragColor = color;',
    '}'
  ].join('\n');

  function initSideRays(container, options) {
    if (!container) return null;

    var opts = Object.assign({
      speed: 2.2,
      rayColor1: '#ffffff',
      rayColor2: '#94a3b8',
      intensity: 1.85,
      spread: 2.2,
      origin: 'top-right',
      tilt: 0,
      saturation: 0.0, // Monochromatic Black and White
      blend: 0.7,
      falloff: 1.6,
      opacity: 0.85
    }, options || {});

    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';

    container.appendChild(canvas);

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' }) ||
             canvas.getContext('experimental-webgl', { alpha: true });

    if (!gl) {
      console.warn('WebGL not supported for SideRays');
      return null;
    }

    function createShader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('SideRays shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    var vert = createShader(gl.VERTEX_SHADER, VERT_SRC);
    var frag = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    var prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('SideRays program link error:', gl.getProgramInfoLog(prog));
      return null;
    }

    gl.useProgram(prog);

    // Fullscreen single triangle covering clip-space
    var quadVerts = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    var uTime = gl.getUniformLocation(prog, 'iTime');
    var uRes = gl.getUniformLocation(prog, 'iResolution');
    var uSpeed = gl.getUniformLocation(prog, 'iSpeed');
    var uRay1 = gl.getUniformLocation(prog, 'iRayColor1');
    var uRay2 = gl.getUniformLocation(prog, 'iRayColor2');
    var uIntensity = gl.getUniformLocation(prog, 'iIntensity');
    var uSpread = gl.getUniformLocation(prog, 'iSpread');
    var uFlipX = gl.getUniformLocation(prog, 'iFlipX');
    var uFlipY = gl.getUniformLocation(prog, 'iFlipY');
    var uTilt = gl.getUniformLocation(prog, 'iTilt');
    var uSaturation = gl.getUniformLocation(prog, 'iSaturation');
    var uBlend = gl.getUniformLocation(prog, 'iBlend');
    var uFalloff = gl.getUniformLocation(prog, 'iFalloff');
    var uOpacity = gl.getUniformLocation(prog, 'iOpacity');

    var flips = originToFlip(opts.origin);
    var rgb1 = hexToRgb(opts.rayColor1);
    var rgb2 = hexToRgb(opts.rayColor2);

    gl.uniform1f(uSpeed, opts.speed);
    gl.uniform3f(uRay1, rgb1[0], rgb1[1], rgb1[2]);
    gl.uniform3f(uRay2, rgb2[0], rgb2[1], rgb2[2]);
    gl.uniform1f(uIntensity, opts.intensity);
    gl.uniform1f(uSpread, opts.spread);
    gl.uniform1f(uFlipX, flips[0]);
    gl.uniform1f(uFlipY, flips[1]);
    gl.uniform1f(uTilt, opts.tilt);
    gl.uniform1f(uSaturation, opts.saturation);
    gl.uniform1f(uBlend, opts.blend);
    gl.uniform1f(uFalloff, opts.falloff);
    gl.uniform1f(uOpacity, opts.opacity);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;

    function resize() {
      var w = container.clientWidth || window.innerWidth;
      var h = container.clientHeight || window.innerHeight;
      width = Math.floor(w * dpr);
      height = Math.floor(h * dpr);
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
    }

    resize();
    window.addEventListener('resize', resize);

    var animId = null;
    var isVisible = true;

    // Pause WebGL rendering when scrolled out of view to save battery/GPU
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(loop);
        }
      }, { threshold: 0.05 });
      obs.observe(container);
    }

    function loop(t) {
      if (!isVisible) {
        animId = null;
        return;
      }
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return {
      destroy: function () {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    var bgContainers = document.querySelectorAll('[data-side-rays], #side-rays-bg');
    bgContainers.forEach(function (el) {
      initSideRays(el, {
        speed: parseFloat(el.getAttribute('data-speed')) || 2.2,
        rayColor1: el.getAttribute('data-ray-color-1') || '#ffffff',
        rayColor2: el.getAttribute('data-ray-color-2') || '#94a3b8',
        intensity: parseFloat(el.getAttribute('data-intensity')) || 1.85,
        spread: parseFloat(el.getAttribute('data-spread')) || 2.2,
        origin: el.getAttribute('data-origin') || 'top-right',
        tilt: parseFloat(el.getAttribute('data-tilt')) || 0,
        saturation: parseFloat(el.getAttribute('data-saturation')) || 0.0, // Monochromatic black and white
        blend: parseFloat(el.getAttribute('data-blend')) || 0.7,
        falloff: parseFloat(el.getAttribute('data-falloff')) || 1.6,
        opacity: parseFloat(el.getAttribute('data-opacity')) || 0.85
      });
    });
  });

  window.initSideRays = initSideRays;
})();
