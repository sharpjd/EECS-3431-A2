/*
    How this framework works:
    - A Scene contains SceneObjects
    - A SceneObject contains Components and child SceneObjects if needed
    - A Component is a behaviour that can be attached to a SceneObject
    - A MeshRenderer is a Component that draws a Mesh
    - An AnimationComponent is a Component that animates the Transform of the SceneObject it is attached to using Keyframes and interpolation
    
    - In main.js, create a Scene, create SceneObjects, add Components/Childs to the SceneObjects, and add the SceneObjects to Scene.SCENEOBJECTS array
    - In the render loop, call scene.render() to init, start and update all SceneObjects in the scene
*/

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
        this.DELTATIME = 0;         //time difference between current frame and previous frame
        this.SCENESTARTED = false;  //indicates if the scene has been started
        this.SCENEOBJECTS = [];     //contains all the SceneObjects in the scene
    }
    render() {
        if(this.TIME == 0) {
            this.SCENESTARTED = false;
        }
        if(this.SCENESTARTED == false) {
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].init(this);
            }
            for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
                this.SCENEOBJECTS[i].start();
            }
            this.SCENESTARTED = true;
        }

        for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
            this.SCENEOBJECTS[i].update();
        }
    }

    destroy(sceneObject) {
        for( var i = this.SCENEOBJECTS.length-1; i >= 0; i-- ) {
            if(this.SCENEOBJECTS[i] == sceneObject) {
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
                    component.update();
                }
                for(let child of this.children) {
                    child.update();
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
        for(let component of this.components) {
            component.start();
        }
        for(let child of this.children) {
            child.init(this.scene);
            child.start();
        }
    }

    addComponent(component) {
        this.components.push(component);
    }
    addChild(child) {
        this.children.push(child);
    }
    getComponent(componentType) { //pass the component class type as argument
        for(let component of this.components) {
            if(component instanceof componentType) {
                return component;
            }
        }
        return null;
    } 
    destroy() {
        this.isDestroyed = true;
        this.scene.destroy(this);
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

class Keyframe {
    constructor(timestamp, targetTransform) {
        this.timestamp = timestamp;
        this.targetTransform = targetTransform;
    }

    // this is a basic interpolation function that we will use for now
    matrixInterpolation(t1, t2, time, totalTime) {
        let factor = time / totalTime;
        let transform = new Transform();

        transform.translation = mix(t2.translation, t1.translation, factor);
        transform.rotation = mix(t2.rotation, t1.rotation, factor);
        transform.scale = mix(t2.scale, t1.scale, factor);

        return transform;
    }
}

class AnimationComponent extends Component {
    constructor(keyframes=[]) {
        super();
        this.keyframes = keyframes;
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
        
        if(this.isLooped) { 
            this.currentTime %= this.animationLength;
        } else if(this.currentTime > this.animationLength) {
            this.currentTime = this.animationLength;
        }
        
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
    
    start() {
        this.keyframes.sort((a, b) => a.timestamp - b.timestamp);

        if(this.keyframes.length == 0) {
            let initialKeyframe1 = new Keyframe(0.0, root.transform);
            let initialKeyframe2 = new Keyframe(1.0, root.transform);
            this.keyframes.push(initialKeyframe1);
            this.keyframes.push(initialKeyframe2);

        }

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
        this.moveSpeed = 30.0;   // units per second
        this.keys = {};
    }
    update() {
        let deltaTime = this.scene.DELTATIME;
        let moveSpeed = this.moveSpeed;
        let keys = this.keys;

        console.log(this.scene);

        let forward = normalize(subtract(at, eye));
        let right = normalize(cross(forward, up));

        if (keys['w']) eye = add(eye, scalev(moveSpeed * deltaTime, forward));
        if (keys['s']) eye = subtract(eye, scalev(moveSpeed * deltaTime, forward));

        if (keys['a']) eye = subtract(eye, scalev(moveSpeed * deltaTime, right));
        if (keys['d']) eye = add(eye, scalev(moveSpeed * deltaTime, right));

        if (keys[' ']) eye = add(eye, scalev(moveSpeed * deltaTime, up));
        if (keys['shift']) eye = subtract(eye, scalev(moveSpeed * deltaTime, up));

        at = add(eye, forward);

        console.log("Camera position: " + eye);

        viewMatrix = lookAt(eye, at, up);
        modelViewMatrix = mult(viewMatrix, modelMatrix);

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    }

    
    start() {
        window.addEventListener("keydown", (e) => { this.keys[e.key.toLowerCase()] = true; });
        window.addEventListener("keyup", (e) => { this.keys[e.key.toLowerCase()] = false; });
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
            let asteroid = new Asteroid();
            asteroid.transform.translation = pos;

            this.scene.SCENEOBJECTS.push(asteroid);

            this.spawns.push(asteroid);
        }
    }

}

class Asteroid extends SceneObject {
    constructor() {
        super();
    }

    start() {

        let mesh = new Mesh(() => {
            drawCube();
        });

        this.addComponent(new MeshRenderer(mesh));
    }
}