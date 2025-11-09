/*
    How this framework works:
    - A Scene contains SceneObjects
    - A SceneObject contains Components and child SceneObjects if needed
    - A Component is a behaviour that can be attached to a SceneObject
    - A MeshRenderer is a Component that draws a Mesh
    - An AnimationComponent is a Component that animates the Transform of the SceneObject it is attached to using Keyframes and interpolation
    
    - In scene.js, create a Scene, create SceneObjects, add Components/Childs to the SceneObjects, and add the SceneObjects to Scene.SCENEOBJECTS array
    - In main.js and in the render loop, call scene.render() to init, start and update all SceneObjects in the scene
*/

const DEBUG = true; //disable for some performance i guess

function tMatrix(matrix) {
    gPush();
    {
        matrix();
    }   
    gPop();
}

class Scene {
    constructor() {
        this.TIME = 0;              //current time since the start of the scene
        this.DELTATIME = 0.016;         //time difference between current frame and previous frame
        this.SCENESTARTED = false;  //indicates if the scene has been started
        this.SCENEOBJECTS = [];     //contains all the SceneObjects in the scene 
    }
    render() {
        if(DEBUG) {
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                if(!(this.SCENEOBJECTS[i] instanceof SceneObject)) {
                    console.error("SceneObject at index " + i + " is not an instance of SceneObject. It is of type " + typeof(this.SCENEOBJECTS[i]) + ". Make sure to only add SceneObjects to the SCENEOBJECTS array.");
                    throw new Error("Invalid SceneObject in SCENEOBJECTS array.");
                }
            }
        }

        if(this.SCENESTARTED == false) {
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].init(this);
            }
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].start();
            }
            this.SCENESTARTED = true;
            window.requestAnimFrame(render);
        }

        //if(this.SCENESTARTED == true) {
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                if(this.SCENEOBJECTS[i].scene == null) {
                    this.SCENEOBJECTS[i].init(this);
                }
                this.SCENEOBJECTS[i].update();
            }
        //}
    }

    destroy(sceneObject) {
        for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
            if(this.SCENEOBJECTS[i] == sceneObject) {
                this.SCENEOBJECTS[i].children = [];
                this.SCENEOBJECTS[i].components = [];
                this.SCENEOBJECTS.splice(i, 1); //remove from array
                console.log("Destroyed SceneObject " + sceneObject);
                break;
            }
        }
    }
}

class Transform {
    constructor(t=vec3(0.0, 0.0, 0.0), r=vec3(0.0, 0.0, 0.0), s=vec3(1.0, 1.0, 1.0)) {
        this.translation = t;
        this.rotation = r;
        this.scale = s;
    }
}

class Component {
    constructor() {
        this.root;
        this.scene;
        this.isActive = true;
    }
    init(root, scene) {
        this.root = root;
        this.scene = scene;
    }
    start() {
        // to be overridden
    }
    update() {
        // to be overridden
    }
}

class SceneObject {
    constructor() {
        this.transform = new Transform();
        this.components = [];
        this.children = [];
        this.isActive = true;
        this.isDestroyed = false;
        this.scene;
    }

    transformSceneObject() {
        gTranslate(this.transform.translation[0], this.transform.translation[1], this.transform.translation[2]);
        gRotate(this.transform.rotation[0], 1, 0, 0);
        gRotate(this.transform.rotation[1], 0, 1, 0);
        gRotate(this.transform.rotation[2], 0, 0, 1);
        gScale(this.transform.scale[0], this.transform.scale[1], this.transform.scale[2]);
    }

    update() {
        tMatrix(() => {
            this.transformSceneObject();
            if(this.isActive && !this.isDestroyed) {
                for(let component of this.components) {
                    if(component.isActive) component.update();
                    
                }
                for(let child of this.children) {
                    if(child.isActive) child.update();
                }
            }
        });
        
    }
    init(scene) {
        this.scene = scene;
        for(let component of this.components) {
            component.init(this, this.scene);
        }
    }
    start() {
        console.log("Starting SceneObject: " );
        console.log(this);
        tMatrix(() => {
            this.transformSceneObject();
            for(let component of this.components) {
                component.start();
            }
            for(let child of this.children) {
                child.init(this.scene);
                child.start();
            }
        });
    }

    addComponent(component) {
        if(DEBUG && !(component instanceof Component)) {
            console.error("Tried to add a component that is not an instance of Component. It is of type " + typeof(component) + ".");
            throw new Error("Invalid component added to SceneObject.");
        }
        this.components.push(component);
        if(this.scene != null && this.scene.SCENESTARTED) { //if the scene has already started, init and start the component immediately
            component.init(this, this.scene);
            component.start();
        }
        
    }
    addChild(child) {
        if(DEBUG && !(child instanceof SceneObject)) {
            console.error("Tried to add a child that is not an instance of SceneObject. It is of type " + typeof(child) + ".");
            throw new Error("Invalid child added to SceneObject.");
        }
        this.children.push(child);
        if(this.scene != null && this.scene.SCENESTARTED) { //if the scene has already started, init and start the child immediately
            child.init(this.scene);
            child.start();
        }
    }
    getComponent(componentType) { //pass the component class type as argument
        for(let component of this.components) {
            if(component instanceof componentType) {
                return component;
            }
        }
        return null;
    } 
    getTransform() {
        let tf = new Transform();
        tf.translation = this.transform.translation;
        tf.rotation = this.transform.rotation;
        tf.scale = this.transform.scale;
        return tf;
    }
    destroy() {
        this.isDestroyed = true;
        this.scene.destroy(this);
    }
}

class Mesh {
    constructor(draw = (placeholder) => {console.warn("No draw function defined for this mesh.");}) {
        this.draw = draw; //draw is the function used to draw the mesh
    }
}

class MeshRenderer extends Component {
    constructor(mesh=new Mesh(), shaderProgram=() => default_program()) {
        super();
        this.mesh = mesh;
        this.shaderProgram = shaderProgram;
    }
    update() {
        tMatrix(() => {
            this.mesh.draw(this.shaderProgram());
        });
    }
}

// copied from main.js, setMV()
var default_shader;
function default_program() {
    if(glow_shader == null) {
        glow_shader = initShaders(gl, "vertex-shader", "fragment-shader");
    }

    gl.useProgram(default_shader);

    const modelViewMatrixLoc = gl.getUniformLocation(default_shader, "modelViewMatrix");
    const normalMatrixLoc = gl.getUniformLocation(default_shader, "normalMatrix");

    modelViewMatrix = mult(viewMatrix,modelMatrix) ;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix) ;
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );

    return default_shader;
}

var glow_shader;
function glow_program(glowColor, glowStrength) {
    if(glow_shader == null) {
        glow_shader = initShaders(gl, "vertex-shader", "glow-fragment-shader");
    }

    gl.useProgram(glow_shader);

    const modelViewMatrixLoc = gl.getUniformLocation(glow_shader, "modelViewMatrix");
    const normalMatrixLoc = gl.getUniformLocation(glow_shader, "normalMatrix");

    modelViewMatrix = mult(viewMatrix,modelMatrix) ;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix) ;
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );

    const glowColorLoc = gl.getUniformLocation(glow_shader, "glowColor");
    const glowStrengthLoc = gl.getUniformLocation(glow_shader, "glowStrength");
    gl.uniform4fv(glowColorLoc, flatten(glowColor));
    gl.uniform1f(glowStrengthLoc, glowStrength);

    return glow_shader;

}

class Keyframe {
    constructor(timestamp, targetTransform) {
        this.timestamp = timestamp;
        this.targetTransform = targetTransform;
    }

    // this is a basic interpolation function that we will use for now
    matrixInterpolation(t1, t2, time, totalTime) {
        
        let factor = time / totalTime;
        let transform = new Transform();
        if(t2 == null || t1 == null)  return transform;

        transform.translation = mix(t2.translation, t1.translation, factor);
        transform.rotation = mix(t2.rotation, t1.rotation, factor);
        transform.scale = mix(t2.scale, t1.scale, factor);

        return transform;
    }
}

class Callbackframe {
    constructor(timestamp, callback) {
        this.timestamp = timestamp;
        this.callback = callback;
    }
}

class AnimationComponent extends Component {
    constructor(keyframes=[], callbacks=[]) {
        super();
        this.keyframes = keyframes;
        this.callbacks = callbacks;
        this.currentKeyframe = new Keyframe();
        this.targetKeyframe = new Keyframe();

        this.currentTime = 0.0;         //curent time of the animation (it is DIFFERENT from Scene.TIME)
        this.offsetTime = 0.0;          //make the animation start at a different time
        this.offsetKeyframes = 0.0;     //delay when the animation will play. makes it easier to create an animation normally and play it at a later time
        this.animationLength = 0.0;
        this.isLooped = false;
        this.isPaused = false;
    }
    update() {
        if(!this.isPaused) {
            if(this.scene.TIME > this.offsetKeyframes) {
                this.currentTime = this.scene.TIME - this.offsetKeyframes + this.offsetTime;
            }
        } else {
            return;
        }

        for(let callback of this.callbacks) {
            if(this.currentTime >= callback.timestamp && (this.currentTime - this.scene.DELTATIME) < callback.timestamp) {
                callback.callback();
            }
        }
        
        if(this.isLooped) { 
            this.currentTime %= this.animationLength;
        } else if(this.currentTime > this.animationLength) {
            this.currentTime = this.animationLength;
        }
        
        if(this.keyframes != null && this.keyframes.length >= 2) {
            for(let i = 0; i < this.keyframes.length - 1; i++) {
                if(this.currentTime >= this.keyframes[i].timestamp && this.currentTime < this.keyframes[i + 1].timestamp) {
                    this.currentKeyframe = this.keyframes[i];
                    this.targetKeyframe = this.keyframes[i + 1];
                    break;
                }
            }
            let totalTime = this.targetKeyframe.timestamp - this.currentKeyframe.timestamp;
            let time = this.currentTime - this.currentKeyframe.timestamp;
            
            this.root.transform = this.currentKeyframe.matrixInterpolation(
                this.currentKeyframe.targetTransform,
                this.targetKeyframe.targetTransform,
                time,
                totalTime
            );
        }
    }
    
    start() {
        this.keyframes.sort((a, b) => a.timestamp - b.timestamp);

        if(this.keyframes.length > 0) {
            this.animationLength = this.keyframes[this.keyframes.length - 1].timestamp;
        }

        if(this.keyframes[0].timestamp > 0.0) { //create initial keyframe at time 0 if there isn't one
            let initialKeyframe = new Keyframe(0.0, this.root.transform);
            this.keyframes.unshift(initialKeyframe);
        }
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => a.timestamp - b.timestamp);
    }

}

class CameraControllerComponent extends Component {
    constructor() {
        super();
        this.enableLookObject = true;
        this.lookObject = null;     // the scene object the camera is looking at
        this.lookSpeed = 5.0;
        this.moveSpeed = 30.0;      // units per second
        this.keys = {};
    }
    update() {
        let deltaTime = this.scene.DELTATIME;
        let moveSpeed = this.moveSpeed;
        let keys = this.keys;

        let forward = normalize(subtract(at, eye));
        let right = normalize(cross(forward, up));

        if (keys['w']) this.root.transform.translation = add(this.root.transform.translation, scalev(moveSpeed * deltaTime, forward));
        if (keys['s']) this.root.transform.translation = subtract(this.root.transform.translation, scalev(moveSpeed * deltaTime, forward)); 
        if (keys['a']) this.root.transform.translation = subtract(this.root.transform.translation, scalev(moveSpeed * deltaTime, right));
        if (keys['d']) this.root.transform.translation = add(this.root.transform.translation, scalev(moveSpeed * deltaTime, right));
        if (keys[' ']) this.root.transform.translation = add(this.root.transform.translation, scalev(moveSpeed * deltaTime, up));
        if (keys['shift']) this.root.transform.translation = subtract(this.root.transform.translation, scalev(moveSpeed * deltaTime, up));

        eye = this.root.transform.translation;

        if(this.lookObject == null || this.enableLookObject == false) {
            at = add(eye, forward);
        } else {
            //at = this.lookObject.transform.translation;
            let speed = this.lookSpeed * (deltaTime != null ? deltaTime : 0.016);
            at = mix( this.lookObject.transform.translation, at, speed);
            
        }
        
        if(this.scene.TIME % 0.5 == 0) {
            //console.log("Camera position: " + eye);
            //console.log("Camera at: " + at);
        }
        

        viewMatrix = lookAt(eye, at, up);

        modelViewMatrix = mult(viewMatrix, modelMatrix);

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    }

    
    start() {
        window.addEventListener("keydown", (e) => { this.keys[e.key.toLowerCase()] = true; });
        window.addEventListener("keyup", (e) => { this.keys[e.key.toLowerCase()] = false; });
    }

    setLookObject(sceneObject) {
        this.previousLookObject = this.lookObject;
        this.lookObject = sceneObject;
    }

}

/**
 * Places a number of asteroids randomly within a rectangular area.
 */
class AsteroidRandomPlacer extends Component {
    constructor(bottomLeft = vec3(-1,-1,-1), topRight = vec3(1,1,1), count = 10) {
        super();
        this.bottomLeft = bottomLeft;
        this.topRight = topRight;
        this.count = count;

        this.spawns = [];
    }
    
    start() {
        
        for(let i = 0; i < this.count; i++) {
            let x = Math.random() * (this.topRight[0] - this.bottomLeft[0]) + this.bottomLeft[0];
            let y = Math.random() * (this.topRight[1] - this.bottomLeft[1]) + this.bottomLeft[1];
            let z = Math.random() * (this.topRight[2] - this.bottomLeft[2]) + this.bottomLeft[2];

            let pos = vec3(x, y, z);
            let asteroid = new SceneObject();

            let mesh = new Mesh(() => {
                drawCube();
            });
            asteroid.addComponent(new MeshRenderer(mesh));

            asteroid.transform.translation = pos;

            this.scene.SCENEOBJECTS.push(asteroid);

            this.spawns.push(asteroid);
        }
    }
}

class ParticleSystem extends Component {
    constructor(particleLayers=[]) {
        super();
        this.particleLayers = particleLayers;
    }

    init(root, scene) {
        super.init(root, scene);
        for(let layer of this.particleLayers) {
            layer.init(root, scene);
        }
    }

    update() {
        for(let layer of this.particleLayers) {
            layer.update(this.scene.DELTATIME);
        }
    }
}

class ParticleLayer extends Component{
    constructor(mesh, direction = vec3(0.0, 1.0, 0.0), spread = 0.0, speed = 10.0, lifetime = 3.0, emissionRate = 15.0, emissionTime = 2.0) {
        super();
        this.mesh = mesh;
        this.currentTime = 0.0;
        this.cooldownTimer = 0.0;

        this.direction = direction;
        this.spread = spread;
        this.speed = speed;
        this.lifetime = lifetime;

        this.emissionRate = emissionRate; //particles per second
        this.emissionTime = emissionTime; //how long the particlelayer will emit particles for. a value of 0 means indefinite
    }

    update() {

        if(this.scene.DELTATIME != null) {
            this.cooldownTimer += this.scene.DELTATIME;
            this.currentTime += this.scene.DELTATIME;

            if(this.currentTime >= this.emissionTime && this.emissionTime != 0.0) {
                return;
            }
        }
        
        if(this.cooldownTimer >= 1.0/this.emissionRate) {
            this.cooldownTimer = 0;

            let directionWithRot = normalize(add(this.direction, this.root.transform.rotation));
            let directionWithSpread = vec3(
                directionWithRot[0] + (Math.random() - 0.5) * this.spread,
                directionWithRot[1] + (Math.random() - 0.5) * this.spread,
                directionWithRot[2] + (Math.random() - 0.5) * this.spread
            );

            directionWithSpread = normalize(directionWithSpread);
            directionWithSpread[0] *= this.speed;
            directionWithSpread[1] *= this.speed;
            directionWithSpread[2] *= this.speed;

            let particle = new SceneObject();
            particle.transform = this.root.getTransform();

            let directionWithSpreadTranslation = add(directionWithSpread, this.root.transform.translation);

            particle.addComponent(new MeshRenderer(this.mesh));
            let ac_particle = new AnimationComponent(
                [
                    new Keyframe(this.scene.TIME, this.root.transform),
                    new Keyframe(this.lifetime + this.scene.TIME, new Transform(directionWithSpreadTranslation, this.root.transform.rotation, vec3(0.0, 0.0, 0.0)))
                ],
                [
                    new Callbackframe(this.lifetime + this.scene.TIME, () => { particle.destroy(); })
                ]
            );
            particle.init(this.scene);
            particle.addComponent(ac_particle);
            this.scene.SCENEOBJECTS.push(particle);
        }
    }
}