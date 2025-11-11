var scene = new Scene();

Math.seedrandom("big chungus++");

// ========== COMMON MESHES =============
var PROJECTILE_mesh = new Mesh(() => {
    tMatrix(() => {
        scale(0.2, 0.2, 0.2);
        drawGlowShader(
            drawSphere
        )
    });
});

// var TRAIL_mesh = new Mesh(() => {
//     tMatrix(() => {
//         scale(0.2, 0.2, 0.2);
//         drawCone();
//     });
// });

// ============= ENEMY =============
var ENEMY = new SceneObject();

function ENEMY_wing() {
    drawDefaultShader(
        () => {
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
        },
        () => {
            setColor(vec4(1, 0, 0, 1))
        }
    )
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
    drawDefaultShader(
        () => {
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
        },
        () => {
            setColor(vec4(0.3, 0.5, 1, 1));
        }
    )
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


// camera_controller.addComponent( ac_camera_controller );
scene.SCENEOBJECTS.push( CAMERA );

// var asteroidSO = new SceneObject();
// var asteroidPlacer = new RandomPlacer(
//     {
//         mesh : new Mesh(() => {
//                 drawCube();
//             })
//     }
// );
// asteroidSO.addComponent( asteroidPlacer );
// scene.SCENEOBJECTS.push( asteroidSO );

var useTexturesPrev;
var starsSO = new SceneObject();
var starsPlacer = new RandomPlacer(
    {
        mesh : new Mesh(() => {
            useTexturesPrev = useTextures;
            useTextures = false;
            gl.uniform1i( gl.getUniformLocation(default_shader,
                                        "useTextures"), useTextures );
            setColor(vec4(1.0, 1.0, 1.0, 1.0));
            gPush();{
                gScale(0.5, 0.5, 0.5);
                drawSphere();
            }gPop();
            useTextures = useTexturesPrev;
            gl.uniform1i( gl.getUniformLocation(default_shader,
                                        "useTextures"), useTextures );
        }),
        positionMultiplierCurve : () => {
            let random = Math.random();
            //stars are way more likely to be far away than close
            let mult = 0.5 + (1 - random ** 8)/2;
            return mult;
        },
        dontSpawnNegativePosMult : true,
        bottomLeft : vec3(-500,-500,-500), 
        topRight : vec3(500,500,500), 
        count : 500,
        minDistance : 100
    }
);
starsSO.addComponent( starsPlacer );
scene.SCENEOBJECTS.push( starsSO );



var sun_so = new SceneObject();
sun_so.transform.translation = vec3(100, 10, -100);
sun_so.transform.scale = vec3(50, 50, 50);
var sun_mesh = new SunMesh();
var sun_mesh_renderer = new MeshRenderer(sun_mesh);
sun_so.addComponent(sun_mesh_renderer);
scene.SCENEOBJECTS.push(sun_so);

var asteroidPlacer = new SceneObject();
var asteroidPlacerComponent = new AsteroidRandomPlacer(
    {
        positionMultiplierCurve : () => {
            let random = Math.random();
            //asteroids are more likely to be CLOSER than far away
            let mult = -(random ** 4) + 1;
            return mult;
        },
        bottomLeft : vec3(-50,-50,-50), 
        topRight : vec3(50,50,50), 
        count : 50
    }
);
asteroidPlacer.addComponent( asteroidPlacerComponent );
scene.SCENEOBJECTS.push( asteroidPlacer );

var projectile_so = new SceneObject();
projectile_so.transform.translation = vec3(5, 0, -5);
projectile_so.transform.scale = vec3(0.5, 0.5, 2);
var projectile_mesh = new ProjectileMesh();
var projectile_mesh_renderer = new MeshRenderer(projectile_mesh);
projectile_so.addComponent(projectile_mesh_renderer);
scene.SCENEOBJECTS.push(projectile_so);
scene.SCENEOBJECTS.push( CAMERA );

