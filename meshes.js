var prev_program; //used to restore draw state

var asteroid_program;
class AsteroidMesh extends Mesh {
    constructor() {
        super(() => {
            this.drawAsteroid();
        });

        //this.shape;
        this.colorOffset;
    }

    initialize() {

    }

    drawAsteroid() {

        // if(this.shape == null)
        //     this.shape = Math.floor(Math.random() * 2);

        // if(this.shape == 0)
        // {
        if(this.colorOffset == null){
            //color should be darker overall
            let offset = (Math.random() - 1) * 0.3;
            this.colorOffset = vec4(
                offset,
                offset,
                offset,
                0.0
            );
        }

        gl.uniform4fv( gl.getUniformLocation(program, "offsetColor"), 
            flatten(this.colorOffset) ) ;
        drawSphere();
        // }
            
        // if(this.shape == 1){
        //     gPush();
        //     gScale(0.5, 0.5, 0.5);
        //     drawCube();
        //     gPop();
        // }
            
    }
}

var glow_program;
var cubeVAO, cubeVertexCount;
var glowCubeMesh_initialized = false;
class GlowCubeMesh extends Mesh {
    constructor() {
        super(() => { this.draw_cube(); });
    }

    initialize() {
        if (cubeVAO) return;

        if (!glow_program)
            glow_program = initShaders(gl, "glow-vertex-shader", "glow-fragment-shader");
        
        const aPosition = gl.getAttribLocation(glow_program, "aPosition");
        const aColor    = gl.getAttribLocation(glow_program, "aColor");

        cubeVAO = gl.createVertexArray();
        gl.bindVertexArray(cubeVAO);

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -0.5,-0.5,-0.5,  0.5,-0.5,-0.5,  0.5,0.5,-0.5,  -0.5,0.5,-0.5,
            -0.5,-0.5, 0.5,  0.5,-0.5, 0.5,  0.5,0.5, 0.5,  -0.5,0.5, 0.5
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
            0,1,2,2,3,0, 4,5,6,6,7,4,
            0,4,7,7,3,0, 1,5,6,6,2,1,
            3,2,6,6,7,3, 0,1,5,5,4,0
        ]), gl.STATIC_DRAW);

        cubeVertexCount = 36;

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }


    draw_cube() {

        if (!glowCubeMesh_initialized) {
            this.initialize();
            glowCubeMesh_initialized = true;
        }

        prev_program = gl.getParameter(gl.CURRENT_PROGRAM);

        if (!glow_program) {
            glow_program = initShaders(gl, "glow-vertex-shader", "glow-fragment-shader");
        }

        gl.useProgram(glow_program);

        // === Set uniforms for this program ===
        const modelViewMatrix = mult(viewMatrix, modelMatrix);
        const normalMatrix = inverseTranspose(modelViewMatrix);

        gl.uniformMatrix4fv(
            gl.getUniformLocation(glow_program, "modelViewMatrix"),
            false,
            flatten(modelViewMatrix)
        );
        gl.uniformMatrix4fv(
            gl.getUniformLocation(glow_program, "normalMatrix"),
            false,
            flatten(normalMatrix)
        );
        gl.uniformMatrix4fv(
            gl.getUniformLocation(glow_program, "projectionMatrix"),
            false,
            flatten(projectionMatrix)
        );

        gl.uniform4fv(
            gl.getUniformLocation(glow_program, "glowColor"),
            flatten(vec4(1.0, 0.0, 0.0, 1.0))
        );
        gl.uniform1f(
            gl.getUniformLocation(glow_program, "glowStrength"),
            0.5
        );

        // === Draw ===
        gl.bindVertexArray(cubeVAO);
        gl.drawElements(gl.TRIANGLES, cubeVertexCount, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);

        gl.useProgram(prev_program);
    }
}
