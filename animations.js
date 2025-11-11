// ============== PROTAGONIST ============
var PROTAGONIST_kf = [
    new Keyframe(0.0, new Transform(vec3(10, 10, -4.5), vec3(-12, 0, -32), vec3(1, 1, 1))),
    new Keyframe(5.0, new Transform(vec3(10, 10, 12), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(6.0, new Transform(vec3(10, 10, 8), vec3(0, 0, 0), vec3(1, 1, 0.5))),
    new Keyframe(6.2, new Transform(vec3(10, 10, 46), vec3(0, 0, 0), vec3(1, 1, 5))),
    new Keyframe(7.5, new Transform(vec3(10, 10, 80), vec3(0, 0, 0), vec3(1, 1, 1))),
    
    new Keyframe(9.0, new Transform(vec3(0, 0, -10), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(13.0, new Transform(vec3(0, 0, 10), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(15.0, new Transform(vec3(0, 0, 30), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(18.0, new Transform(vec3(10, 0, 80), vec3(0, 0, -95), vec3(1, 1, 1))),
    new Keyframe(22.0, new Transform(vec3(-30, 30, 110), vec3(0, 0, -195), vec3(1, 1, 1))),
    
    new Keyframe(22.02, new Transform(vec3(0, 0, 10), vec3(-25, 0, 90), vec3(1, 1, 1))),
    new Keyframe(24, new Transform(vec3(0, 30, 20), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(27, new Transform(vec3(0, 30, 20), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(28, new Transform(vec3(0, 30, 35), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(30, new Transform(vec3(10, 32, 45), vec3(0, 15, -45), vec3(1, 1, 1))),
    new Keyframe(33, new Transform(vec3(30, 32, 65), vec3(0, 15, 0), vec3(1, 1, 1))),
    new Keyframe(35, new Transform(vec3(30, 32, 65), vec3(0, 15, 45), vec3(1, 1, 1))),
    new Keyframe(38, new Transform(vec3(30, 32, 120), vec3(0, 15, 115), vec3(1, 1, 1))),
    new Keyframe(39, new Transform(vec3(30, 32, 130), vec3(0, 15, 180), vec3(1, 1, 0.5))),
    new Keyframe(39.4, new Transform(vec3(30, 32, 130), vec3(0, 15, 180), vec3(1, 1, 1))),
    new Keyframe(42, new Transform(vec3(30, 32, 220), vec3(0, 15, 180), vec3(1, 1, 7))),


]

var PROTAGONIST_cf = [];

// ============== CAMERA ==============

var CAMERA_kf = [
    new Keyframe(0.0, new Transform(vec3(15, 15, 0), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(2.0, new Transform(vec3(13, 13, 0), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(4.0, new Transform(vec3(13, 10, -5), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(5.0, new Transform(vec3(0, 5, 3), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(8.98, new Transform(vec3(0, 5, 3), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(9.0, new Transform(vec3(0, 4, 0), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(13.0, new Transform(vec3(0, 4, 20), vec3(0, 0, 0), vec3(1, 1, 1))),
    
    new Keyframe(15.0, new Transform(vec3(0, 4, 40), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(16.5, new Transform(vec3(7, 8, 70), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(18.0, new Transform(vec3(-10, 12, 40), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(20.0, new Transform(vec3(-10, 12, 60), vec3(0, 0, 0), vec3(1, 1, 1))),
    
    new Keyframe(22.0, new Transform(vec3(25, 25, 0), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(24.0, new Transform(vec3(5, 15, 0), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(25, new Transform(vec3(5, 25, 20), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(26, new Transform(vec3(0, 32, 26), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(28, new Transform(vec3(4, 32, 35), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(30, new Transform(vec3(20, 32, 30), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(31, new Transform(vec3(10, 25, 40), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(33, new Transform(vec3(25, 30, 50), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(34, new Transform(vec3(25, 30, 70), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(35, new Transform(vec3(40, 34, 115), vec3(0, 0, 0), vec3(1, 1, 1))),
]
var CAMERA_cf = [
    
    new Callbackframe(0.1, () => {
        CAMERA_controller.lookObject = PROTAGONIST;
    }),
    new Callbackframe(7.5, () => {
        warpParticle();
        PROTAGONIST.isActive = false;
    }),
    new Callbackframe(8.98, () => {
        warpParticle();
        PROTAGONIST.isActive = true;
        ENEMY_mr.isActive = true;
        CAMERA_controller.lookSpeed = 70;
        for(let a of asteroidPlacerComponent.spawns){
            //console.log(a);
            a.getComponent(MeshRenderer).isActive = true;
        }
    }),
    new Callbackframe(9.0, () => {
        CAMERA_controller.lookSpeed = 5.0;
        CAMERA_controller.lookObject = PROTAGONIST;
    }),
    new Callbackframe(12.5, () => {
        CAMERA_controller.lookSpeed = 0.3;
        CAMERA_controller.lookObject = ENEMY;
    }),
    new Callbackframe(13.5, () => {
        CAMERA_controller.lookObject = null;
        ENEMY_blaster_ps.canEmitParticles = true;
    }),
    new Callbackframe(14.5, () => {
        explodeParticle();
    }),
    new Callbackframe(15.25, () => {
        explodeParticle();
    }),
    new Callbackframe(16, () => {
        CAMERA_controller.lookObject = PROTAGONIST;
    }),
    new Callbackframe(17, () => {
        explodeParticle();
    }),
    new Callbackframe(18, () => {
        explodeParticle();
    }),
    new Callbackframe(20.5, () => {
        ENEMY_blaster_ps.canEmitParticles = false;
    }),
    new Callbackframe(22, () => {
        CAMERA_controller.lookSpeed = 30;
    }),
    new Callbackframe(26, () => {
        PROTAGONIST_blaster_ps.canEmitParticles = true;
    }),
    new Callbackframe(31, () => {
        explodeParticleEnemy();
    }),
    new Callbackframe(32, () => {
        explodeParticleEnemy();
    }),
    new Callbackframe(36, () => {
        explodeParticleEnemy();
        ENEMY.isActive = false;
    }),
    new Callbackframe(37, () => {
        PROTAGONIST_blaster_ps.canEmitParticles = false;
    }),
    new Callbackframe(42, () => {
        warpParticle();
        PROTAGONIST.isActive = false;
    })
]


// ============== ENEMY ==============
ENEMY_kf = [
    new Keyframe(9.0, new Transform(vec3(0, 25, -40), vec3(0, 0, -180), vec3(1, 1, 1))),
    new Keyframe(11.0, new Transform(vec3(0, 15, -20), vec3(0, 0, -90), vec3(1, 1, 1))),
    new Keyframe(13.0, new Transform(vec3(0, 0, -10), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(18.0, new Transform(vec3(5, 0, 40), vec3(0, 0, 45), vec3(1, 1, 1))),
    new Keyframe(22.0, new Transform(vec3(-30, 30, 90), vec3(0, 0, 45), vec3(1, 1, 1))),

    new Keyframe(22.02, new Transform(vec3(2.5, 0, -10), vec3(0, 0, -45), vec3(1, 1, 1))),
    
    new Keyframe(23.02, new Transform(vec3(2.5, 0, -10), vec3(0, 0, -45), vec3(1, 1, 1))),
    new Keyframe(24, new Transform(vec3(5, 30, 60), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(26, new Transform(vec3(10, 30, 80), vec3(0, 0, -35), vec3(1, 1, 1))),
    new Keyframe(30, new Transform(vec3(20, 30, 80), vec3(0, 0, -45), vec3(1, 1, 1))),
    new Keyframe(33, new Transform(vec3(40, 30, 100), vec3(0, 0, 45), vec3(1, 1, 1))),
    new Keyframe(35, new Transform(vec3(40, 30, 100), vec3(0, 0, 0), vec3(1, 1, 1))),
    new Keyframe(36, new Transform(vec3(37, 30, 100), vec3(0, 0, -45), vec3(1, 1, 1))),
];

ENEMY_cf = [
    
];

function warpParticle() {
    var testParticleSystemObject = new SceneObject();
    testParticleSystemObject.transform = PROTAGONIST.transform;
    testParticleSystemObject.init(PROTAGONIST.scene);

    var testParticleLayer1 = new ParticleLayer(
        new Mesh( () => { 
            // drawGlowShader( //this breaks scaling
            //     () => {
            //         gScale(15, 15, 15); 
            //         drawSphere();
            //     },
            //     vec3(1, 1, 1),
            //     vec3(0, 0, 1)
            // )
            setColor(vec4(0.6, 0.9, 1, 1));
            gScale(15, 15, 15); 
            drawSphere();
        } ), 
        vec3(0.0, 1.0, 0.0), 
        4.0, 0.2, 0.3, 20.0, 0.25
    );

    var testParticleSystem = new ParticleSystem(
        [testParticleLayer1]
    );
    testParticleSystemObject.addComponent( testParticleSystem );
    PROTAGONIST.addChild(testParticleSystemObject);

    scene.SCENEOBJECTS.push( testParticleSystemObject );
}

function explodeParticle() {
    var testParticleSystemObject = new SceneObject();
    testParticleSystemObject.transform = PROTAGONIST.transform;
    testParticleSystemObject.init(PROTAGONIST.scene);

    var testParticleLayer1 = new ParticleLayer(
        new Mesh( () => { 
            drawGlowShader(
                () => {
                    gScale(0.5, 0.5, 0.5); drawCone(); 
                },
                vec3(1, 1, 0.8),
                vec3(1, 0.8, 0)
            )
            
        } ), 
        vec3(0.0, 1.0, 0.0), 
        3.0, 30.0, 3.0, 50.0, 0.5
    );

    var testParticleLayer2 = new ParticleLayer(
        new Mesh( () => { 
            drawGlowShader(
                () => {
                    gScale(2.5, 2.5, 2.5); 
                    drawSphere(); 
                },
                vec3(1, 1, 0.8),
                vec3(1, 0.8, 0)
            )
            
        } ),  
        vec3(0.0, 1.0, 0.0), 
        4.0, 0.2, 0.3, 20.0, 0.25
    );

    var testParticleSystem = new ParticleSystem(
        [testParticleLayer1, testParticleLayer2]
    );
    testParticleSystemObject.addComponent( testParticleSystem );
    PROTAGONIST.addChild(testParticleSystemObject);

    scene.SCENEOBJECTS.push( testParticleSystemObject );
}

function explodeParticleEnemy() {
    var testParticleSystemObject = new SceneObject();
    testParticleSystemObject.transform = ENEMY.transform;
    testParticleSystemObject.init(ENEMY.scene);

    var testParticleLayer1 = new ParticleLayer(
        new Mesh( () => { 
            drawGlowShader(
                () => {
                    gScale(0.5, 0.5, 0.5); drawCone(); 
                },
                vec3(1, 1, 0.8),
                vec3(1, 0.8, 0)
            )
            
        } ), 
        vec3(0.0, 1.0, 0.0), 
        5.0, 50.0, 3.0, 250.0, 0.75
    );

    var testParticleLayer2 = new ParticleLayer(
        new Mesh( () => { 
            drawGlowShader(
                () => {
                    gScale(2.5, 2.5, 2.5); 
                    drawSphere(); 
                },
                vec3(1, 1, 0.8),
                vec3(1, 0.8, 0)
            )
            
        } ), 
        vec3(0.0, 1.0, 0.0), 
        4.0, 0.2, 0.3, 20.0, 0.25
    );

    var testParticleSystem = new ParticleSystem(
        [testParticleLayer1, testParticleLayer2]
    );
    testParticleSystemObject.addComponent( testParticleSystem );
    ENEMY.addChild(testParticleSystemObject);

    scene.SCENEOBJECTS.push( testParticleSystemObject );
}
