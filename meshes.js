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

        toggleTextures();

        gl.uniform4fv( gl.getUniformLocation(default_shader, "offsetColor"), 
            flatten(this.colorOffset) ) ;
        drawSphere();

        toggleTextures();
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

var sun_program;
var sunVAO, sunVertexCount;
class SunMesh extends Mesh { 
    constructor() {
        super(() => {
            this.drawSun();
        });
    }

    drawSun(){

        prev_program = gl.getParameter(gl.CURRENT_PROGRAM);

        if (!sun_program) {
            sun_program = initShaders(gl, "sun-vertex-shader", "sun-fragment-shader");
        }

        gl.useProgram(sun_program);

        const modelViewMatrix = mult(viewMatrix, modelMatrix);
        const normalMatrix = inverseTranspose(modelViewMatrix);

        gl.uniformMatrix4fv(
            gl.getUniformLocation(sun_program, "modelViewMatrix"),
            false,
            flatten(modelViewMatrix)
        );

        let n3 = mat3();
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                n3[i][j] = modelViewMatrix[i][j];
        gl.uniformMatrix3fv(
            gl.getUniformLocation(sun_program, "normalMatrix"),
            false,
            flatten(n3)
        );
        gl.uniformMatrix4fv(
            gl.getUniformLocation(sun_program, "projectionMatrix"),
            false,
            flatten(projectionMatrix)
        );

        gl.uniform1f(gl.getUniformLocation(sun_program, "uTime"), scene.TIME / 1000.0);
        gl.uniform3fv(gl.getUniformLocation(sun_program, "uSunColor"), vec3(1.0, 0.7, 0.1));  // orange core
        gl.uniform3fv(gl.getUniformLocation(sun_program, "uGlowColor"), vec3(1.0, 0.2, 0.0)); // reddish edge

        drawSphere(false);

        gl.useProgram(prev_program);
    }

}

function drawGlowShader(
    toDraw=() => {console.error("No draw function specified.")},
    innerColor=vec3(1.0, 0.8, 0.8),
    outerColor=vec3(1.0, 0.2, 0.0)
) {
    prev_program = gl.getParameter(gl.CURRENT_PROGRAM);

    if (!sun_program) {
        sun_program = initShaders(gl, "sun-vertex-shader", "sun-fragment-shader");
    }

    gl.useProgram(sun_program);

    const modelViewMatrix = mult(viewMatrix, modelMatrix);
    const normalMatrix = inverseTranspose(modelViewMatrix);

    gl.uniformMatrix4fv(
        gl.getUniformLocation(sun_program, "modelViewMatrix"),
        false,
        flatten(modelViewMatrix)
    );

    let n3 = mat3();
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            n3[i][j] = modelViewMatrix[i][j];
    gl.uniformMatrix3fv(
        gl.getUniformLocation(sun_program, "normalMatrix"),
        false,
        flatten(n3)
    );
    gl.uniformMatrix4fv(
        gl.getUniformLocation(sun_program, "projectionMatrix"),
        false,
        flatten(projectionMatrix)
    );

    gl.uniform1f(gl.getUniformLocation(sun_program, "uTime"), scene.TIME);
    gl.uniform3fv(gl.getUniformLocation(sun_program, "uSunColor"), innerColor);  // white-red core
    gl.uniform3fv(gl.getUniformLocation(sun_program, "uGlowColor"), outerColor); // reddish edge

    toDraw();

    gl.useProgram(prev_program);
}

function drawDefaultShader(
    toDraw=() => {console.error("No draw function specified.")},
    runAfterUsingShader=() => {}
){
    prev_program = gl.getParameter(gl.CURRENT_PROGRAM);

    gl.useProgram(default_shader)

    runAfterUsingShader();

    toDraw();

    gl.useProgram(prev_program);
}

class ProjectileMesh extends Mesh { 
    constructor() {
        super(() => {
            this.drawProjectile();
        });
    }

    drawProjectile(){
        drawGlowShader(() => drawCylinder(false));
    }

}