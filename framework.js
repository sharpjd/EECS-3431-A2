function tMatrix(matrix) {
    gPush();
    {
        matrix();
    }   
    gPop();
}

class SceneTime {
    constructor() {
        this.TIME = 0;
        this.DELTATIME = 0;
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
        this.sceneTime;
    }
    update() {
        // to be overridden
    }
}

class SceneObject {
    constructor() {
        this.transform = new Transform();
        this.components = [new Component()];
        this.children = [];
        this.isActive = true;
        this.isDestroyed = false;
        this.sceneTime = new SceneTime();
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
    start(sceneTime) {
        this.sceneTime = sceneTime;
        for(let component of this.components) {
            component.sceneTime = sceneTime;
            component.root = this;
        }
        for(let child of this.children) {
            child.start(sceneTime);
        }
    }

    addComponent(component) {
        this.components.push(component);
    }
    addChild(child) {
        this.children.push(child);
    }
    getComponent(componentType) {
        for(let component of this.components) {
            if(component instanceof componentType) {
                return component;
            }
        }
        return null;
    } 
}

class Mesh {
    draw() {
        // to be overridden
    }
}

class MeshRenderer extends Component {
    constructor(mesh) {
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

    matrixInterpolation(t1, t2, time, totalTime) {
        let factor = time / totalTime;
        let interpolated = new Transform();
        interpolated.translation = mix(t1.translation, t2.translation, factor);
        interpolated.rotation = mix(t1.rotation, t2.rotation, factor);
        interpolated.scale = mix(t1.scale, t2.scale, factor);
        return interpolated;
    }
}

class AnimationComponent extends Component {
    constructor(keyframes=[]) {
        super();
        this.keyframes = keyframes;
        this.currentKeyframe = new Keyframe();
        this.targetKeyframe = new Keyframe();

        this.currentTime = 0.0;
        this.offsetTime = 0.0;
        this.animationLength = 0.0;
        this.isLooped = false;
        this.isPaused = false;
    }
    update() {
        if(this.isLooped) {
            this.currentTime %= this.animationLength;
        }
        if(!this.isPaused) {
            this.currentTime = this.sceneTime.TIME + this.offsetTime;
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
        
        let interpolatedTransform = this.currentKeyframe.matrixInterpolation(
            this.currentKeyframe.targetTransform,
            this.targetKeyframe.targetTransform,
            time,
            totalTime
        );

        this.root.transform = interpolatedTransform;
    }
    
    start(root, sceneTime) {
        super.start(root, sceneTime);
        if(this.keyframes.length > 0) {
            this.animationLength = this.keyframes[this.keyframes.length - 1].timestamp;
        }
        else if(this.animationLength == 0.0) { //create new keyframe and put it in the front
            let initialKeyframe = new Keyframe(0.0, root.transform);
            this.keyframes.unshift(initialKeyframe);
        }
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => a.timestamp - b.timestamp);
    }

}
