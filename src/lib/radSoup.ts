/** Rad Soup fill from Figma Shader_Here (102:49), plus landing dither (110:259). */

export const SHADER_WIDTH = 1680;
export const SHADER_HEIGHT = 829;

function srgb(hex: string, alpha = 1) {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
    alpha,
  ] as const;
}

export const RAD_SOUP = {
  seed: 8,
  blur: 78,
  blobScale: 100,
  drift: 32,
  interactionStrength: 85,
  // Figma Shader_Here: cream, gold (not lime), rose, peach, sky blue.
  background: srgb("#e2d8d0"),
  blob1: srgb("#FFC021", 0.72),
  blob2: srgb("#c05d5e"),
  blob3: srgb("#fead5d"),
  blob4: srgb("#7FB4DF"),
};

const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uPhase;
uniform float uBlur;
uniform float uBscale;
uniform float uIstr;
uniform vec2 uDims;
uniform float uSeed;
uniform vec2 uMpos;
uniform vec2 uMvel;
uniform vec4 uBg;
uniform vec4 uC1;
uniform vec4 uC2;
uniform vec4 uC3;
uniform vec4 uC4;

in vec2 vUv;
out vec4 fragColor;

float hash11(float p) {
  return fract(sin(p * 127.1 + 311.7) * 43758.5453);
}

float blobDist(
  vec2 pos,
  float cx,
  float cy,
  float rx,
  float ry,
  float rot,
  float sd,
  float phase
) {
  vec2 d = pos - vec2(cx, cy);
  float cs = cos(rot);
  float sn = sin(rot);
  vec2 rd = vec2(d.x * cs + d.y * sn, -d.x * sn + d.y * cs);
  float dist = length(rd / vec2(rx, ry));
  float angle = atan(rd.y, rd.x);

  float w1a = 0.08 + hash11(sd + 10.0) * 0.12;
  float w1f = 1.0 + floor(hash11(sd + 11.0) * 3.0);
  float w1p = hash11(sd + 12.0) * 6.283 + phase * 0.3;

  float w2a = 0.06 + hash11(sd + 13.0) * 0.10;
  float w2f = 2.0 + floor(hash11(sd + 14.0) * 2.0);
  float w2p = hash11(sd + 15.0) * 6.283 + phase * 0.25;

  float w3a = 0.03 + hash11(sd + 16.0) * 0.05;
  float w3f = 4.0 + floor(hash11(sd + 17.0) * 4.0);
  float w3p = hash11(sd + 18.0) * 6.283 + phase * 0.4;

  float w4a = 0.02 + hash11(sd + 19.0) * 0.03;
  float w4f = 5.0 + floor(hash11(sd + 20.0) * 4.0);
  float w4p = hash11(sd + 21.0) * 6.283 + phase * 0.35;

  float deform = 1.0
    + w1a * sin(angle * w1f + w1p)
    + w2a * sin(angle * w2f + w2p)
    + w3a * sin(angle * w3f + w3p)
    + w4a * sin(angle * w4f + w4p);

  return dist / deform;
}

// Figma landing dither (110:259): Bayer 16×16, pixelSize 2, 3 color levels.
// Recursive I₂ = [[0,2],[3,1]]; finer scale lives in the high bits (small*4).
float bayer16(ivec2 p) {
  int x = p.x & 15;
  int y = p.y & 15;
  int v = 0;
  for (int i = 0; i < 4; i++) {
    int bx = (x >> i) & 1;
    int by = (y >> i) & 1;
    int qoff = 2 * (bx ^ by) + by;
    v += qoff << ((3 - i) * 2);
  }
  return (float(v) + 0.5) / 256.0;
}

vec3 figmaDither(vec3 c, vec2 fragPx) {
  const float pixelSize = 2.0;
  const float levels = 3.0;
  ivec2 cell = ivec2(floor(fragPx / pixelSize));
  float t = bayer16(cell);
  float L = levels - 1.0;
  vec3 off = vec3((t - 0.5) / L);
  return clamp(round((c + off) * L) / L, 0.0, 1.0);
}

void main() {
  float phase = uPhase;
  float blur = uBlur;
  float bscale = uBscale;
  float istr = uIstr;
  vec2 dims = uDims;
  float seed = uSeed;
  vec2 mpos = uMpos;
  vec2 mvel = uMvel;

  float shortSide = min(dims.x, dims.y);
  vec2 p = (vUv * dims - dims * 0.5) / shortSide;

  vec2 mUV = (mpos - dims * 0.5) / shortSide;
  vec2 toMouse = p - mUV;
  float md = length(toMouse);
  float iRadius = 0.4;
  float falloff = exp(-md * md / (iRadius * iRadius * 0.5));
  if (istr > 0.0 && md > 0.001) {
    vec2 outward = toMouse / md;
    vec2 tangent = vec2(-outward.y, outward.x);
    vec2 velContrib = mvel / shortSide * 0.15;
    p = p + (outward * 0.18 + tangent * 0.042 + velContrib) * falloff * istr;
  }

  float cx0 = (0.76 - 0.5) + (hash11(seed * 7.0 + 1.0) - 0.5) * 0.06;
  float cy0 = (0.10 - 0.5) + (hash11(seed * 7.0 + 2.0) - 0.5) * 0.06;
  float cx1 = (0.60 - 0.5) + (hash11(seed * 7.0 + 138.0) - 0.5) * 0.06;
  float cy1 = (1.02 - 0.5) + (hash11(seed * 7.0 + 139.0) - 0.5) * 0.06;
  float cx2 = (1.05 - 0.5) + (hash11(seed * 7.0 + 275.0) - 0.5) * 0.06;
  float cy2 = (0.60 - 0.5) + (hash11(seed * 7.0 + 276.0) - 0.5) * 0.06;
  float cx3 = (0.08 - 0.5) + (hash11(seed * 7.0 + 412.0) - 0.5) * 0.06;
  float cy3 = (0.51 - 0.5) + (hash11(seed * 7.0 + 413.0) - 0.5) * 0.06;
  float cx4 = (0.16 - 0.5) + (hash11(seed * 7.0 + 549.0) - 0.5) * 0.06;
  float cy4 = (0.22 - 0.5) + (hash11(seed * 7.0 + 550.0) - 0.5) * 0.06;

  float arx = dims.x / shortSide;
  float ary = dims.y / shortSide;

  float dp0 = hash11(seed * 7.0 + 3.0) * 6.283;
  float dx0 = sin(phase * 0.7 + dp0) * 0.35 + sin(phase * 0.31 + dp0 + 1.0) * 0.18;
  float dy0 = cos(phase * 0.53 + dp0 + 2.0) * 0.30 + sin(phase * 0.22 + dp0 + 3.0) * 0.15;

  float dp1 = hash11(seed * 7.0 + 140.0) * 6.283;
  float dx1 = sin(phase * 0.6 + dp1) * 0.40 + sin(phase * 0.28 + dp1 + 1.5) * 0.15;
  float dy1 = cos(phase * 0.45 + dp1 + 2.5) * 0.35 + sin(phase * 0.19 + dp1 + 3.5) * 0.20;

  float dp2 = hash11(seed * 7.0 + 277.0) * 6.283;
  float dx2 = sin(phase * 0.55 + dp2) * 0.32 + sin(phase * 0.33 + dp2 + 0.7) * 0.20;
  float dy2 = cos(phase * 0.48 + dp2 + 1.8) * 0.38 + sin(phase * 0.25 + dp2 + 2.8) * 0.16;

  float dp3 = hash11(seed * 7.0 + 414.0) * 6.283;
  float dx3 = sin(phase * 0.65 + dp3) * 0.38 + sin(phase * 0.27 + dp3 + 1.2) * 0.17;
  float dy3 = cos(phase * 0.5 + dp3 + 2.2) * 0.33 + sin(phase * 0.21 + dp3 + 3.2) * 0.18;

  float dp4 = hash11(seed * 7.0 + 551.0) * 6.283;
  float dx4 = sin(phase * 0.58 + dp4) * 0.30 + sin(phase * 0.35 + dp4 + 0.9) * 0.22;
  float dy4 = cos(phase * 0.42 + dp4 + 1.5) * 0.36 + sin(phase * 0.24 + dp4 + 2.5) * 0.19;

  float sd0 = seed * 7.0 + 0.0 * 137.0;
  float rx0 = (0.28 + hash11(sd0 + 4.0) * 0.12) * bscale;
  float ry0 = (0.24 + hash11(sd0 + 5.0) * 0.10) * bscale;
  float rot0 = hash11(sd0 + 6.0) * 6.283;

  float sd1 = seed * 7.0 + 1.0 * 137.0;
  float rx1 = (0.50 + hash11(sd1 + 4.0) * 0.24) * bscale;
  float ry1 = (0.38 + hash11(sd1 + 5.0) * 0.20) * bscale;
  float rot1 = hash11(sd1 + 6.0) * 6.283;

  float sd2 = seed * 7.0 + 2.0 * 137.0;
  float rx2 = (0.30 + hash11(sd2 + 4.0) * 0.16) * bscale;
  float ry2 = (0.34 + hash11(sd2 + 5.0) * 0.18) * bscale;
  float rot2 = hash11(sd2 + 6.0) * 6.283;

  float sd3 = seed * 7.0 + 3.0 * 137.0;
  float rx3 = (0.34 + hash11(sd3 + 4.0) * 0.20) * bscale;
  float ry3 = (0.32 + hash11(sd3 + 5.0) * 0.18) * bscale;
  float rot3 = hash11(sd3 + 6.0) * 6.283;

  float sd4 = seed * 7.0 + 4.0 * 137.0;
  float rx4 = (0.42 + hash11(sd4 + 4.0) * 0.18) * bscale;
  float ry4 = (0.40 + hash11(sd4 + 5.0) * 0.16) * bscale;
  float rot4 = hash11(sd4 + 6.0) * 6.283;

  float featherMin = 1.25 / shortSide;
  float feather = max(featherMin, pow(blur, 1.25) * 0.40 * bscale);

  float fc0x = cx0 * arx + dx0;
  float fc0y = cy0 * ary + dy0;
  float fc1x = cx1 * arx + dx1;
  float fc1y = cy1 * ary + dy1;
  float fc2x = cx2 * arx + dx2;
  float fc2y = cy2 * ary + dy2;
  float fc3x = cx3 * arx + dx3;
  float fc3y = cy3 * ary + dy3;
  float fc4x = cx4 * arx + dx4;
  float fc4y = cy4 * ary + dy4;

  float b0 = blobDist(p, fc0x, fc0y, rx0, ry0, rot0, sd0, phase);
  float b1 = blobDist(p, fc1x, fc1y, rx1, ry1, rot1, sd1, phase);
  float b2 = blobDist(p, fc2x, fc2y, rx2, ry2, rot2, sd2, phase);
  float b3 = blobDist(p, fc3x, fc3y, rx3, ry3, rot3, sd3, phase);
  float b4 = blobDist(p, fc4x, fc4y, rx4, ry4, rot4, sd4, phase);

  float a0 = 1.0 - smoothstep(1.0 - feather, 1.0 + feather, b0);
  float a1 = 1.0 - smoothstep(1.0 - feather, 1.0 + feather, b1);
  float a2 = 1.0 - smoothstep(1.0 - feather, 1.0 + feather, b2);
  float a3 = 1.0 - smoothstep(1.0 - feather, 1.0 + feather, b3);
  float a4 = 1.0 - smoothstep(1.0 - feather, 1.0 + feather, b4);

  vec4 col0 = uC1;
  vec4 col1 = uC2;
  vec4 col2 = vec4(col1.rgb * 0.81 + uBg.rgb * 0.19, col1.a);
  vec4 col3 = uC3;
  vec4 col4 = uC4;

  vec3 color = uBg.rgb;
  float alpha = uBg.a;

  float ba0 = a0 * col0.a;
  color = mix(color, col0.rgb, ba0);
  alpha = alpha * (1.0 - ba0) + ba0;

  float ba1 = a1 * col1.a;
  color = mix(color, col1.rgb, ba1);
  alpha = alpha * (1.0 - ba1) + ba1;

  float ba2 = a2 * col2.a;
  color = mix(color, col2.rgb, ba2);
  alpha = alpha * (1.0 - ba2) + ba2;

  float ba3 = a3 * col3.a;
  color = mix(color, col3.rgb, ba3);
  alpha = alpha * (1.0 - ba3) + ba3;

  float ba4 = a4 * col4.a;
  color = mix(color, col4.rgb, ba4);
  alpha = alpha * (1.0 - ba4) + ba4;

  // Do not lift after mix: gold R is already 1, so a gain clips R and reads lime.
  color = clamp(color, 0.0, 1.0);
  vec3 dithered = figmaDither(color, vUv * dims);
  color = mix(color, dithered, 0.42);

  float blobCover = max(max(max(ba0, ba1), max(ba2, ba3)), ba4);
  float wash = mix(0.62, 0.84, blobCover);

  float edgeL = smoothstep(0.0, 0.05, vUv.x);
  float edgeR = smoothstep(0.0, 0.05, 1.0 - vUv.x);
  float edgeT = smoothstep(0.0, 0.055, vUv.y);
  float edgeB = smoothstep(0.0, 0.28, 1.0 - vUv.y);
  float edge = edgeL * edgeR * edgeT * edgeB;

  float outA = wash * edge * alpha;
  fragColor = vec4(color * outA, outA);
}
`;

type Uniforms = {
  phase: WebGLUniformLocation;
  blur: WebGLUniformLocation;
  bscale: WebGLUniformLocation;
  istr: WebGLUniformLocation;
  dims: WebGLUniformLocation;
  seed: WebGLUniformLocation;
  mpos: WebGLUniformLocation;
  mvel: WebGLUniformLocation;
  bg: WebGLUniformLocation;
  c1: WebGLUniformLocation;
  c2: WebGLUniformLocation;
  c3: WebGLUniformLocation;
  c4: WebGLUniformLocation;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "unknown compile error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function loc(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
  const value = gl.getUniformLocation(program, name);
  if (!value) throw new Error(`Missing uniform ${name}`);
  return value;
}

export type PointerState = {
  x: number;
  y: number;
  inside: boolean;
};

export class RadSoupRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private uniforms: Uniforms;
  private vao: WebGLVertexArrayObject;
  private quad: WebGLBuffer;
  private phase = 0;
  private lastTime = -1;
  private smoothVelX = 0;
  private smoothVelY = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private mouseInfluence = 0;
  private wasInside = false;
  private destroyed = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) {
      throw new Error("Rad Soup shader failed to compile");
    }
    const program = gl.createProgram();
    if (!program) throw new Error("Could not create WebGL program");
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Rad Soup shader failed to link");
    }
    this.program = program;
    this.uniforms = {
      phase: loc(gl, program, "uPhase"),
      blur: loc(gl, program, "uBlur"),
      bscale: loc(gl, program, "uBscale"),
      istr: loc(gl, program, "uIstr"),
      dims: loc(gl, program, "uDims"),
      seed: loc(gl, program, "uSeed"),
      mpos: loc(gl, program, "uMpos"),
      mvel: loc(gl, program, "uMvel"),
      bg: loc(gl, program, "uBg"),
      c1: loc(gl, program, "uC1"),
      c2: loc(gl, program, "uC2"),
      c3: loc(gl, program, "uC3"),
      c4: loc(gl, program, "uC4"),
    };

    const vao = gl.createVertexArray();
    const quad = gl.createBuffer();
    if (!vao || !quad) throw new Error("Could not create WebGL buffers");
    this.vao = vao;
    this.quad = quad;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, -1, 1, 0, 0, 1, -1, 1, 1, 1, 1, 1, 0,
      ]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);
  }

  draw(nowMs: number, pointer: PointerState, animate: boolean, interact: boolean) {
    if (this.destroyed) return;
    const gl = this.gl;
    const t = nowMs * 0.001;
    if (this.lastTime < 0) this.lastTime = t;
    let dt = t - this.lastTime;
    dt = Math.min(dt, 0.1);
    this.lastTime = t;

    if (animate) {
      this.phase += dt * Math.pow(RAD_SOUP.drift / 100, 1.5) * 2.5;
    }

    const hasM = interact && pointer.inside;
    if (hasM) {
      if (!this.wasInside) {
        this.lastMouseX = pointer.x;
        this.lastMouseY = pointer.y;
      }
      const rawVx = (pointer.x - this.lastMouseX) / Math.max(dt, 0.001);
      const rawVy = (pointer.y - this.lastMouseY) / Math.max(dt, 0.001);
      const smooth = Math.min(1, dt * 8);
      this.smoothVelX += (rawVx - this.smoothVelX) * smooth;
      this.smoothVelY += (rawVy - this.smoothVelY) * smooth;
      this.mouseInfluence = Math.min(1, this.mouseInfluence + dt * 4);
      this.lastMouseX = pointer.x;
      this.lastMouseY = pointer.y;
    } else {
      this.smoothVelX *= Math.max(0, 1 - dt * 5);
      this.smoothVelY *= Math.max(0, 1 - dt * 5);
      this.mouseInfluence = Math.max(0, this.mouseInfluence - dt * 3);
    }
    this.wasInside = hasM;

    const mx = this.lastMouseX * this.mouseInfluence;
    const my = this.lastMouseY * this.mouseInfluence;
    const istr = interact
      ? (RAD_SOUP.interactionStrength / 100) * this.mouseInfluence
      : 0;

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniform1f(this.uniforms.phase, this.phase);
    gl.uniform1f(this.uniforms.blur, RAD_SOUP.blur / 100);
    gl.uniform1f(this.uniforms.bscale, RAD_SOUP.blobScale / 100);
    gl.uniform1f(this.uniforms.istr, istr);
    gl.uniform2f(this.uniforms.dims, SHADER_WIDTH, SHADER_HEIGHT);
    gl.uniform1f(this.uniforms.seed, RAD_SOUP.seed);
    gl.uniform2f(this.uniforms.mpos, mx, my);
    gl.uniform2f(
      this.uniforms.mvel,
      this.smoothVelX * this.mouseInfluence,
      this.smoothVelY * this.mouseInfluence,
    );
    gl.uniform4f(this.uniforms.bg, ...RAD_SOUP.background);
    gl.uniform4f(this.uniforms.c1, ...RAD_SOUP.blob1);
    gl.uniform4f(this.uniforms.c2, ...RAD_SOUP.blob2);
    gl.uniform4f(this.uniforms.c3, ...RAD_SOUP.blob3);
    gl.uniform4f(this.uniforms.c4, ...RAD_SOUP.blob4);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const gl = this.gl;
    gl.deleteBuffer(this.quad);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }
}

export function createRadSoupContext(canvas: HTMLCanvasElement) {
  return canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
}
