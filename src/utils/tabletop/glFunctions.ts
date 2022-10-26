import { IProgramInfo, IBuffer} from './interfaces';
import { mat4 } from 'gl-matrix'

const initGlContext = (gl: WebGLRenderingContext) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

const readShaders = (gl: WebGLRenderingContext) => {

    const vsSource = `#version 300 es
        in vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        out vec4 fragCoord;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    const fsSource = `#version 300 es
    #define GRID_WIDTH 10
    #define GRID_INTENSITY 0.7

    precision mediump float;
    precision mediump int;

    float grid_intensity = 0.7;
    int grid_width = 30;
    vec2 iResolution = vec2(10,10);
    out vec4 outColor;

    // Thick lines 
    float grid(vec2 fragCoord, float space, float gridWidth)
    {
        vec2 p = fragCoord - vec2(.5);
        vec2 size = vec2(gridWidth - .5);
        
        vec2 a1 = mod(p - size, space);
        vec2 a2 = mod(p + size, space);
        vec2 a = a2 - a1;
           
        float g = min(a.x, a.y);
        if (g < 0.5)    g = 0.0;
        else            g = 1.0;
        return clamp(g, 0., 1.0);
    }
    
    
    vec4 mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;
    
        // Pixel color
        vec3 col = vec3(1.0,1.0,1.0);
        
        // Gradient across screen
        // vec2 p = fragCoord.xy;           // Point
        // vec2 c = iResolution.xy / 2.0;   // Center
        // col *= (1.0 - length(c - p)/iResolution.x*0.5);
        
        // 2-size grid
        // col *= clamp(grid(fragCoord, 10., 1.) *  grid(fragCoord, 50., 1.5), grid_intensity, 1.0);
        col *= clamp(grid(fragCoord, 10., 1.) *  grid(fragCoord, 50., 1.5), 0.7, 1.0);
        
        // Output to screen
        fragColor = vec4(col,1.0);
        return fragColor;
    }

    void main() {
        outColor = vec4(0.0,0.0,0.0,1.0);
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
        color = mainImage(color, gl_FragCoord.xy);

        color.w = 1.0;
        if(outColor.w<0.0) color=vec4(1.0,0.0,0.0,1.0);
        if(outColor.x<0.0) color=vec4(1.0,0.0,0.0,1.0);
        if(outColor.y<0.0) color=vec4(0.0,1.0,0.0,1.0);
        if(outColor.z<0.0) color=vec4(0.0,0.0,1.0,1.0);
        if(outColor.w<0.0) color=vec4(1.0,1.0,0.0,1.0);

        outColor = vec4(color.xyz,1.0);
    }
    `;

    let sources = [vsSource, fsSource];

    return sources;
}

const loadShader = (gl: WebGLRenderingContext, shaderType: number, source: string) => {
    const shader = gl.createShader(shaderType);

    // Send the source to the shader object

    if (!shader) {
        throw new Error("Shader not created");
    }

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}



const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
        throw new Error("Shaders could not be obtained");
    }

    // Create the shader program

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
        throw new Error("Shader program creation failed")
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}


const initBuffers = (gl: WebGLRenderingContext) => {

    // Create a buffer for the square's positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.

    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    let buffer : IBuffer = {
        position: positionBuffer,
    };
    return {
        position: positionBuffer,
    };
}


const drawScene = (gl: WebGLRenderingContext, programInfo: IProgramInfo, buffers: IBuffer) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 1 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}


export const handleCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = 1920;
    canvas.height = 1080;
    let gl = canvas.getContext('webgl2');


    if (gl === null) {
        throw new Error("WebGl not found");
    }

    initGlContext(gl);
    let shaders = readShaders(gl);
    let shaderProgram = initShaderProgram(gl, shaders[0], shaders[1]);

    if (!shaderProgram) {
        throw new Error("Could not initialize shader program");
    }

    const programInfo : IProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    let buffer = initBuffers(gl);
    if (!buffer) {
        throw new Error("Buffer not created");
    }
    drawScene(gl, programInfo, buffer);
}

