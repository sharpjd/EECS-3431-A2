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
        this.SCENEOBJECTS = [];
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
            console.log("Initializing and starting scene...");
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].init(this);
            }
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].start();
            }
            this.SCENESTARTED = true;
            window.requestAnimFrame(render);
        }

        for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
            if(this.SCENEOBJECTS[i].scene == null) {
                this.SCENEOBJECTS[i].init(this);
            }
            this.SCENEOBJECTS[i].update();
        }
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
        this.parent;
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
        this.root;
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
                child.root = this;
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
            component.parent = this;
        }
        
    }
    addChild(child) {
        if(DEBUG && !(child instanceof SceneObject)) {
            console.error("Tried to add a child that is not an instance of SceneObject. It is of type " + typeof(child) + ".");
            throw new Error("Invalid child added to SceneObject.");
        }
        this.children.push(child);
        if(this.scene != null && this.scene.SCENESTARTED) { //if the scene has already started, init and start the child immediately
            child.root = this;
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
        this.isActive = true;
    }
}

class Mesh {
    constructor(draw) {
        this.draw = draw; //draw is the function used to draw the mesh
    }
}

class MeshRenderer extends Component {
    constructor(mesh=new Mesh()) {
        super();
        this.mesh = mesh;
    }
    update() {
        tMatrix(() => {
            this.mesh.draw();
        });
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
            if(this.lookSpeed > 100)
                at = this.lookObject.transform.translation;
            else 
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
 * Places a number of Meshes randomly within a rectangular area.
 * 
 * positionMultiplerCurve supports a function returning range 0-1 that is called for each spawn (allows non-linear distribution)
 */
class RandomPlacer extends Component {
    constructor(
            {
                mesh, 
                positionMultiplierCurve=null, 
                bottomLeft = vec3(-50,-50,-50), 
                topRight = vec3(50,50,50), 
                minDistance = 0,
                count = 100
            }
        )
    {
        super();
        this.mesh = mesh;
        this.bottomLeft = bottomLeft;
        this.topRight = topRight;
        this.count = count;
        this.minDistance = minDistance;
        this.positionMultiplierCurve = positionMultiplierCurve;
        
        if(typeof mesh === "undefined" || !(mesh instanceof Mesh)) {
            console.error("RandomPlacer: mesh is not an instance of Mesh.");
            throw new Error("Invalid mesh passed to RandomPlacer.");
        }

        if(positionMultiplierCurve != null && typeof positionMultiplierCurve !== "function") {
            console.error("RandomPlacer: positionMultiplierCurve is not a function.");
            throw new Error("Invalid positionMultiplierCurve passed to RandomPlacer.");
        }

        this.spawns = [];
    }
    
    start() {

        let positionMultiplier = 1.0;

        for(let i = 0; i < this.count; i++) {

            if(this.positionMultiplierCurve != null && typeof this.positionMultiplierCurve === "function") {

                positionMultiplier = this.positionMultiplierCurve();
            }

            let x = Math.random() * (this.topRight[0] - this.bottomLeft[0]) + this.bottomLeft[0];
            let y = Math.random() * (this.topRight[1] - this.bottomLeft[1]) + this.bottomLeft[1];
            let z = Math.random() * (this.topRight[2] - this.bottomLeft[2]) + this.bottomLeft[2];

            x *= positionMultiplier;
            y *= positionMultiplier;
            z *= positionMultiplier;

            let pos = vec3(x, y, z);

            if(length(pos) < this.minDistance){
                pos = scale(pos, this.minDistance / length(pos));
            }

            let asteroid = new SceneObject();

            asteroid.addComponent(new MeshRenderer(this.mesh));

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
        this.canEmitParticles = true;
    }

    init(root, scene) {
        super.init(root, scene);
        for(let layer of this.particleLayers) {
            layer.init(root, scene);
        }
    }

    update() {
        if(!this.canEmitParticles) return;
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

            let entityRoot = this.root; //the last root SceneObject
            while(entityRoot.root != null) {
                entityRoot = entityRoot.root;
            }
            
            let directionWithRot = normalize(rotateDir(this.direction, entityRoot.transform.rotation));
            //console.log(directionWithRot);

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
            particle.transform = entityRoot.getTransform();
            particle.transform.scale = this.root.transform.scale;

            let directionWithSpreadTranslation = add(directionWithSpread, entityRoot.transform.translation);

            particle.addComponent(new MeshRenderer(this.mesh));
            
            let ac_particle = new AnimationComponent(
                [
                    new Keyframe(this.scene.TIME, new Transform(entityRoot.transform.translation, entityRoot.transform.rotation, particle.transform.scale)),
                    new Keyframe(this.lifetime + this.scene.TIME, new Transform(directionWithSpreadTranslation, entityRoot.rotation, vec3(0.0, 0.0, 0.0)))
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

/**
 * Based on RandomPlacer. Places asteroids randomly within a rectangular area.
 */
class AsteroidRandomPlacer extends Component {
    constructor(
            {
                positionMultiplierCurve=null, 
                bottomLeft = vec3(-50,-50,-50), 
                topRight = vec3(50,50,50), 
                count = 100
            } = {}
        )
    {
        super();
        this.bottomLeft = bottomLeft;
        this.topRight = topRight;
        this.count = count;
        this.positionMultiplierCurve = positionMultiplierCurve;
    

        if(positionMultiplierCurve != null && typeof positionMultiplierCurve !== "function") {
            console.error("RandomPlacer: positionMultiplierCurve is not a function.");
            throw new Error("Invalid positionMultiplierCurve passed to RandomPlacer.");
        }

        this.spawns = [];
    }
    
    start() {

        let positionMultiplier = 1.0;

        //individual asteroids
        for(let i = 0; i < this.count; i++) {

            if(this.positionMultiplierCurve != null && typeof this.positionMultiplierCurve === "function") {

                positionMultiplier = this.positionMultiplierCurve();
            }

            //distribute randomly
            let x = Math.random() * (this.topRight[0] - this.bottomLeft[0]) + this.bottomLeft[0];
            let y = Math.random() * (this.topRight[1] - this.bottomLeft[1]) + this.bottomLeft[1];
            let z = Math.random() * (this.topRight[2] - this.bottomLeft[2]) + this.bottomLeft[2];

            x *= positionMultiplier;
            y *= positionMultiplier;
            z *= positionMultiplier;

            let center = vec3(x, y, z);
            let mainAsteroidPart;
            //an asteroid contains multiple sub-asteroids to create lumpiness illusion
            for(let i = 0; i < 5 + Math.floor(Math.random() * 6); i++) {

                let pos_offset_scale = 1.8; // scale factor
                let pos_offset = vec3(
                    (Math.random() - 0.5) * pos_offset_scale,
                    (Math.random() - 0.5) * pos_offset_scale,
                    (Math.random() - 0.5) * pos_offset_scale
                );

                let scale_max = 1.5;
                let scale_min = 0.5;
                let scale = scale_min + Math.random() * (scale_max - scale_min);
                let scale_offset = vec3(
                    scale,
                    scale,
                    scale
                );

                let rotation_offset = vec3(
                    Math.random() * 360,
                    Math.random() * 360,
                    Math.random() * 360
                );

                let asteroid = new SceneObject();
                let asteroidMesh = new AsteroidMesh();
                let asteroidMeshRenderer = new MeshRenderer(asteroidMesh);
                asteroid.addComponent(asteroidMeshRenderer);
                asteroidMeshRenderer.isActive = false;

                asteroid.transform.translation = add(center, pos_offset);
                asteroid.transform.rotation = rotation_offset;
                asteroid.transform.scale = scale_offset;

                if(mainAsteroidPart == null) {
                    mainAsteroidPart = asteroid;
                    // let asteroidSpinny = new AsteroidSpinny();
                    // mainAsteroidPart.addComponent(asteroidSpinny);
                } else {
                    mainAsteroidPart.addChild(asteroid);
                }

                this.scene.SCENEOBJECTS.push(asteroid);
                this.spawns.push(asteroid);
            }
        }
    }
}

// class AsteroidSpinny extends Component {
//     constructor() {
//         super();
//         this.rotationSpeed;
//         this.started = false;
//     }
//     start() {
//         let minRotSpeed = 300;
//         let maxRotSpeed = 3600;

//         this.rotationSpeed = vec3(
//             minRotSpeed + (Math.random() * (maxRotSpeed - minRotSpeed)),
//             minRotSpeed + (Math.random() * (maxRotSpeed - minRotSpeed)),
//             minRotSpeed + (Math.random() * (maxRotSpeed - minRotSpeed))
//         );

//         this.started = true;
//         //console.log(this.rotationSpeed);
//     }
//     update() {

//         if(!this.started)
//             this.start();

//         if(this.scene.DELTATIME != 0 && this.parent != null) {
//             this.parent.transform.rotation =
//             add(scalev(this.scene.DELTATIME, this.rotationSpeed), 
//                 this.parent.transform.rotation);
//         }
        
//     }
// }

function rotateDir(d, r) {
    // convert deg → rad
    const k = Math.PI/180;
    let [x,y,z] = d.map(v=>v*k);
    let [rx,ry,rz] = r.map(v=>v*k);

    // create quaternion from Euler (YZX order)
    const cy = Math.cos(ry/2), sy = Math.sin(ry/2);
    const cx = Math.cos(rx/2), sx = Math.sin(rx/2);
    const cz = Math.cos(rz/2), sz = Math.sin(rz/2);

    const qw = cy*cx*cz + sy*sx*sz;
    const qx = cy*sx*cz + sy*cx*sz;
    const qy = sy*cx*cz - cy*sx*sz;
    const qz = cy*cx*sz - sy*sx*cz;

    // rotate vector
    const vx = x, vy = y, vz = z;
    const ix =  qw*vx + qy*vz - qz*vy;
    const iy =  qw*vy + qz*vx - qx*vz;
    const iz =  qw*vz + qx*vy - qy*vx;
    const iw = -qx*vx - qy*vy - qz*vz;

    const xr = ix*qw + iw*-qx + iy*-qz - iz*-qy;
    const yr = iy*qw + iw*-qy + iz*-qx - ix*-qz;
    const zr = iz*qw + iw*-qz + ix*-qy - iy*-qx;

    // convert back to deg
    const inv = 180/Math.PI;
    return [xr*inv, yr*inv, zr*inv];
}