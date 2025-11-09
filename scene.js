var scene = new Scene();

var so_ground = new SceneObject();

var mesh_ground = new Mesh(() => {
    gScale(20.0, 0.1, 20.0);
    drawCube(); 
});
so_ground.addComponent(new MeshRenderer(mesh_ground));
scene.SCENEOBJECTS.push(so_ground);

// Testing model (delete later)
var so_cube = new SceneObject();

var mesh_cube = new Mesh(() => {
   drawCube(); 
});

var kf_cube = [
    new Keyframe(1.0, new Transform(vec3(0.0, 3.0, -6.0), vec3(0.0, 90.0, 90.0), vec3(1.0, 1.0, 1.0))),
    new Keyframe(3.0, new Transform(vec3(0.0, 0.0, 0.0), vec3(0.0, 180.0, 180.0), vec3(1.0, 1.0, 1.0)))
];

var ac_cube = new AnimationComponent(kf_cube);
ac_cube.isLooped = true;

so_cube.addComponent(ac_cube);
so_cube.addComponent(new MeshRenderer(mesh_cube));

// Testing Child
var so_child = new SceneObject();
var mesh_child = new Mesh(() => {
   drawCone(); 
});

so_child.addComponent(new MeshRenderer(mesh_child));
so_child.transform.translation = vec3(0.0, 3.0, 0.0);
var kf_child = [
    new Keyframe(1.0, new Transform(vec3(0.0, 3.0, 0.0), vec3(640.0, 360.0, 150.0), vec3(1.0, 1.0, 1.0))),
    new Keyframe(3.0, new Transform(vec3(0.0, 3.0, 0.0), vec3(0.0, 720.0, 0.0), vec3(1.0, 1.0, 1.0)))
];

var ac_child = new AnimationComponent(kf_child);
ac_child.isLooped = true;
so_child.addComponent(ac_child);
so_cube.addChild(so_child); // add child to parent

//scene.SCENEOBJECTS.push(so_cube); // add parent to scene

// Camera controller
var so_lookAt1 = new SceneObject();
so_lookAt1.addComponent( new MeshRenderer( mesh_cube ) );
so_lookAt1.addComponent( new AnimationComponent(kf_cube));
scene.SCENEOBJECTS.push( so_lookAt1 );

var camera_controller = new SceneObject();
camera_controller.transform.translation[2] = 10.0;

var ca_camera_controller = new CameraControllerComponent();
ca_camera_controller.lookObject = so_cube;

camera_controller.addComponent( ca_camera_controller );
camera_controller.transform.translation[1] = 3.0;


var ac_camera_controller = new AnimationComponent( 
    [
        new Keyframe(6.0, new Transform(vec3(10.0, 3.0, 10.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)))
    ],
    [
        new Callbackframe(2, () => { 
            ca_camera_controller.lookObject = so_lookAt1; 
            console.log(ca_camera_controller);
            
            var testParticleSystemObject = new SceneObject();
            testParticleSystemObject.transform = ca_camera_controller.lookObject.transform;
            testParticleSystemObject.init(ca_camera_controller.scene);


            var testParticleLayer1 = new ParticleLayer(
                new Mesh( () => { gScale(0.5, 0.5, 0.5); drawCone(); } ), 
                vec3(0.0, 1.0, 0.0), 
                3.0, 30.0, 3.0, 50.0, 0.5
            );

            var testParticleLayer2 = new ParticleLayer(
                new Mesh( () => { gScale(2.5, 2.5, 2.5); drawSphere(); } ), 
                vec3(0.0, 1.0, 0.0), 
                4.0, 0.2, 0.3, 20.0, 0.25
            );

            var testParticleSystem = new ParticleSystem(
                [testParticleLayer1, testParticleLayer2]
            );
            testParticleSystemObject.addComponent( testParticleSystem );
            ca_camera_controller.lookObject.addChild(testParticleSystemObject);

            scene.SCENEOBJECTS.push( testParticleSystemObject ); 
        }),
    ]
);

camera_controller.addComponent( ac_camera_controller );
scene.SCENEOBJECTS.push( camera_controller );