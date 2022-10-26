export interface IProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
    };
}

export interface IBuffer {
    position : WebGLBuffer | null
}