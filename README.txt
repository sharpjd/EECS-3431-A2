EECS3431 A2 - Project by Anthony Dang and Jason Dong

All required elements are fulfiled.

This animation implements a SceneObject-based architecture.

--- Scene ---
A Scene contains SceneObjects that are updated every frame, TIME (the time elapsed since the start), and DELTATIME (the time between rendered frames).
Through dependency injection, each SceneObject contains a reference to a Scene.

--- SceneObject ---
Contain a transform, components, and child SceneObjects.
All transformation logic is done on every update frame.
SceneObjects can have child SceneObjects with their transformation being relative to their parent.
This allows for hierarchical objects such as with how the thrusters spin.

--- Component ---
A Component is a script that is attached to a SceneObject and is executed everytime the SceneObject is updated.
Using components helps us separate responsibilities, like allowing meshes to be independent from animations.

--- MeshRenderer ---
A Component that draws a Mesh object. A Mesh object is an object containing a function to draw a Mesh.
We used MeshRenderers to render Meshes in the place of a SceneObject.

--- AnimationComponent ---
Allows us to manipulate the Transform of a SceneObject over time through interpolating between keyframes.
This component is used extensively when animating SceneObjects.
An AnimationComponent can also be used for "Callbackframes", allowing functions to be executed at a specified timestamp.
This allows for scripted sequences during an animation.

--- CameraControllerComponent  ---
Allows us to debug the camera and specify a SceneObject to look at using the lookAt function.
We can change the look object and look speed at runtime using callbackframes.
Using this alongside an AnimationComponent, we can keyframe the camera to fly around.

-- ParticleSystem and ParticleLayer ---
The particle system allows us to layer particle effects. 
Particles are SceneObjects with MeshRenderers and AnimationComponents and are animated based on specified parameters.
We used the particle system for projectiles and explosions.

