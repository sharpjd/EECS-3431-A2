var scene = new Scene();

var so_ground = new SceneObject();
var mesh_ground = new Mesh(() => {
    gTranslate(0, -2, 0);
    gScale(20.0, 0.1, 20.0);
    drawCube(); 
});
so_ground.addComponent(new MeshRenderer(mesh_ground));
//scene.SCENEOBJECTS.push(so_ground);

// ========== COMMON MESHES =============
var PROJECTILE_mesh = new Mesh(() => {
    tMatrix(() => {
        scale(0.2, 0.2, 0.2);
        drawSphere();
    });
});

var TRAIL_mesh = new Mesh(() => {
    tMatrix(() => {
        scale(0.2, 0.2, 0.2);
        drawCone();
    });
});

// ============= ENEMY =============
var ENEMY = new SceneObject();

function ENEMY_wing() {
    tMatrix(() => {
        gTranslate(3, 0, 0);
        tMatrix(() => {
            tMatrix(() => {
                gTranslate(0, 0, 2);
                gScale(0.75, 0.75, 0.75);
                drawCone();
            });
            gTranslate(0, 0, -1);
            drawCone();
            gTranslate(0, 0, -0.5);
            gScale(0.75, 0.75, 0.5);
            drawSphere();
        });
        tMatrix(() => {
            gScale(1, 1, 3);
            drawCylinder();
        });

        gTranslate(-6, 0, 0);
        tMatrix(() => {
            tMatrix(() => {
                gTranslate(0, 0, 2);
                gScale(0.75, 0.75, 0.75);
                drawCone();
            });
            gTranslate(0, 0, -1);
            drawCone();
            gTranslate(0, 0, -0.5);
            gScale(0.75, 0.75, 0.5);
            drawSphere();
        });
        tMatrix(() => {
            gScale(1, 1, 3);
            drawCylinder();
        });
    });
    gScale(2, 0.2, 1);
    gRotate(45, 0, 0, 1);
    drawCube();
} 

var ENEMY_mesh_body = new Mesh(() => {
    tMatrix(() => {
        gRotate(25, 0, 0, 1);
        ENEMY_wing();
    });
    tMatrix(() => {
        gRotate(-25, 0, 0, 1);
        ENEMY_wing();
    });

    tMatrix(() => {
        gScale(1.5, 1.5, 3);
        drawCylinder();
    });

    tMatrix(() => {
        gTranslate(0, 0, -1);
        drawCone();
        gTranslate(0, 0, -0.5);
        gScale(0.75, 0.75, 0.5);
        drawSphere();
    });

    tMatrix(() => {
        gTranslate(0, 0, 3);
        gScale(1, 1, 4);
        drawCone();
    });
    tMatrix(() => {
        gTranslate(0, 0.65, 2);
        gRotate(10, 1, 0, 0);
        gScale(0.2, 0.2, 0.5);
        drawSphere();
    });
});

// ============ ENEMY BLASTER
var ENEMY_blasterPos = new SceneObject();
ENEMY_blasterPos.transform.translation = vec3(0, 0, 0.5);
ENEMY_blasterPos.transform.scale = vec3(0.4, 0.4, 1.2);
ENEMY.addChild(ENEMY_blasterPos);

var ENEMY_blaster_ps = new ParticleSystem([
    new ParticleLayer(PROJECTILE_mesh, vec3(0, 0, 1), 0.05, 350, 5, 3, 0.0)
]);
ENEMY_blaster_ps.canEmitParticles = false;
ENEMY_blasterPos.addComponent(ENEMY_blaster_ps);

var ENEMY_mr = new MeshRenderer(ENEMY_mesh_body);
ENEMY.addComponent(ENEMY_mr);
var ENEMY_ac = new AnimationComponent(ENEMY_kf, ENEMY_cf);
ENEMY.addComponent(ENEMY_ac);
scene.SCENEOBJECTS.push( ENEMY );

ENEMY_mr.isActive = false;

// PROTAGONIST
var PROTAGONIST = new SceneObject();
var PROTAGONIST_ac = new AnimationComponent(PROTAGONIST_kf, PROTAGONIST_cf);
PROTAGONIST.addComponent(PROTAGONIST_ac)

var PROTAGONIST_mesh_body = new Mesh(() => {
    tMatrix(() => {
        gTranslate(0, 0, -0.5);
        gScale(2, 1, 2);
        drawCylinder();
    });
    tMatrix(() => {
        gTranslate(0, 0, 0.75);
        gScale(1, 0.5, 0.5);
        drawCone();
    });
    tMatrix(() => {
        gTranslate(0, 0.5, -0.5);
        gScale(0.25, 0.25, 0.5);
        drawSphere();
    });
    tMatrix(() => {
        gTranslate(0, 0, -1.75);
        gScale(1, 0.5, -0.5);
        drawCone();
    });
    tMatrix(() => {
        gTranslate(0, 0, -3);
        gScale(1, 0.5, 2.5);
        drawCylinder();
    });
    tMatrix(() => {
        gTranslate(0, 0, -4);
        gScale(3, 1, 1);
        gRotate(90, 0, 1, 0);
        
        drawCylinder();
    });
});

PROTAGONIST.addComponent(new MeshRenderer(PROTAGONIST_mesh_body));
scene.SCENEOBJECTS.push( PROTAGONIST );

// ============== THRUSTERS ==============
var PROTAGONIST_thrusterApos = new SceneObject();
var PROTAGONIST_thrusterBpos = new SceneObject();
PROTAGONIST_thrusterApos.transform.translation = vec3(-2, 0, -4);
PROTAGONIST_thrusterBpos.transform.translation = vec3(2, 0, -4);
PROTAGONIST_thrusterBpos.transform.scale = vec3(-1, 1, 1)
PROTAGONIST.addChild(PROTAGONIST_thrusterApos);
PROTAGONIST.addChild(PROTAGONIST_thrusterBpos);

var PROTAGONIST_thruster = new SceneObject();
var PROTAGONIST_thruster_mesh = new Mesh(() => {
    gScale(1, 1, 2);
    tMatrix(() => {
        gScale(1.5, 1.5, 1.5);
        drawCylinder();

        gScale(2, 2, 0.25);
        drawCylinder(); //ring 1

        gScale(0.75, 0.75, 0.25);
        drawCylinder(); //ring 2
    });
    tMatrix(() => {
        gTranslate(0, 0, 1);
        gScale(1, 1, 1);
        drawCone();
        gTranslate(0, 0, -1.5);
        drawCone();
        gScale(0.5, 0.5, 0.5);
        drawSphere();
    });
    tMatrix(() => {
        gTranslate(0, 0, 1);
        gScale(0.2, 0.2, 0.75);
        drawSphere();
    });
});

var PROTAGONIST_thruster_kf = [
    new Keyframe(3.0, new Transform(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 180.0), vec3(1.0, 1.0, 1.0)))
];
var PROTAGONIST_thruster_ac = new AnimationComponent(PROTAGONIST_thruster_kf);
PROTAGONIST_thruster_ac.isLooped = true;

PROTAGONIST_thruster.addComponent(new MeshRenderer(PROTAGONIST_thruster_mesh));
PROTAGONIST_thruster.addComponent(PROTAGONIST_thruster_ac);

// ============== THRUSTER CAP ==============
var PROTAGONIST_thrusterCap = new SceneObject();
var PROTAGONIST_thrusterCap_mr = new MeshRenderer(new Mesh(() => {gScale(0.25, 0.25, 1); drawCone();}))
var PROTAGONIST_thrusterCap_ac = new AnimationComponent([
    new Keyframe(0.0, new Transform(vec3(0, 0, 3.5), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(1.0, new Transform(vec3(0, 0, 4), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(2.0, new Transform(vec3(0, 0, 3.5), vec3(0, 0, 0), vec3(1, 1, 1))),
]);
PROTAGONIST_thrusterCap_ac.isLooped = true;
PROTAGONIST_thrusterCap.addComponent(PROTAGONIST_thrusterCap_mr);
PROTAGONIST_thrusterCap.addComponent(PROTAGONIST_thrusterCap_ac);

PROTAGONIST_thruster.addChild(PROTAGONIST_thrusterCap);
PROTAGONIST_thrusterCap.transform.translation = vec3()


PROTAGONIST_thrusterApos.addChild(PROTAGONIST_thruster);
PROTAGONIST_thrusterBpos.addChild(PROTAGONIST_thruster);

// ============== BLASTER ==============
var PROTAGONIST_blasterPos = new SceneObject();
PROTAGONIST_blasterPos.transform.translation = vec3(0, 0, 0.5);
PROTAGONIST.addChild(PROTAGONIST_blasterPos);

var PROTAGONIST_blaster_mesh = new Mesh(() => {
    tMatrix(() => {
        gScale(0.25, 0.25, 1);
        drawSphere();
    });
});

var PROTAGONIST_blaster_ps = new ParticleSystem([
    new ParticleLayer(PROJECTILE_mesh, vec3(0, 0, 1), 0.25, 350, 5, 15, 0.0)
]);
PROTAGONIST_blaster_ps.canEmitParticles = false;

var PROTAGONIST_blaster = new SceneObject();
PROTAGONIST_blaster.transform.scale = vec3(0.5, 0.5, 1.2);
PROTAGONIST_blaster.addComponent(new MeshRenderer(PROTAGONIST_blaster_mesh));
PROTAGONIST_blaster.addComponent(PROTAGONIST_blaster_ps)
PROTAGONIST_blasterPos.addChild(PROTAGONIST_blaster);


// ============= CAMERA ============
var CAMERA = new SceneObject();
var CAMERA_controller = new CameraControllerComponent();
var CAMERA_ac = new AnimationComponent(CAMERA_kf, CAMERA_cf);
CAMERA.addComponent( CAMERA_controller );
CAMERA.addComponent( CAMERA_ac );

CAMERA.transform.translation[2] = -3;
CAMERA.transform.translation[1] = 3;

CAMERA_controller.lookObject = PROTAGONIST;

scene.SCENEOBJECTS.push( CAMERA );