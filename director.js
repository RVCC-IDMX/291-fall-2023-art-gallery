//Let's call it the Director. It calls the shots.
var Director = {

    //It holds a list of scenes
    scene: {},

    //Add a scene to the list
    addScene: (name, scene) => {

        //If it exists throw an error
        if (Director.scene[name])
            throw "That scene already exists!";

        //Otherwise add it
        Director.scene[name] = scene;

        //If it's the first scene, make it the active one
        if (Director.currentScene == null)
            Director.currentScene = name;

    },

    //And it keeps track of the current one
    currentScene: null,

    //And a function to change scenes
    showScene: async (nextSceneName, params) => {

        if (params == undefined) params = {};

        let currentScene = Director.scene[Director.currentScene];
        nextScene = Director.scene[nextSceneName];

        if (params.transition == undefined)
            params.transition = Director.cut;

        await params.transition(currentScene, nextScene, params);

        Director.currentScene = nextSceneName;
    },

    //
    //Transitions
    //

    //Cut (no transition)
    cut: async (currentScene, nextScene, params) => {
        app.stage.removeChild(currentScene);
        app.stage.addChild(nextScene);
    },

    //Fade between
    fade: async (currentScene, nextScene, params) => {

        //Check duration
        if (params == undefined) params = {};
        if (params.duration == undefined) params.duration = 500;

        //Fade out current scene
        await Animate.to(currentScene, { alpha: 0, duration: params.duration / 2 });
        //Remove it from stage
        app.stage.removeChild(currentScene);
        //Set next scene to zero alpha
        nextScene.alpha = 0;
        //Add it to the stage
        app.stage.addChild(nextScene);
        //Fade it in
        await Animate.to(nextScene, { alpha: 1, duration: params.duration / 2 });
        //Reset the off-stage scene's alpha back
        currentScene.alpha = 1;
    },

    //Slide in a particular direction
    swipe: async (currentScene, nextScene, params) => {

        //Set up destinations
        let currentSceneEndX, currentSceneEndY;
        let nextSceneStartX, nextSceneStartY;

        //Check duration
        if (params == undefined) params = {};
        if (params.duration == undefined) params.duration = 500;

        //Set default direction
        if (params.direction == undefined) params.direction = "left";

        //Figure out initial and end positions
        if (params.direction == "left") {
            currentSceneEndX = -app.view.width;
            currentSceneEndY = 0;
            nextSceneStartX = app.view.width;
            nextSceneStartY = 0;
        }
        else if (params.direction == "right") {
            currentSceneEndX = app.view.width;
            currentSceneEndY = 0;
            nextSceneStartX = -app.view.width;
            nextSceneStartY = 0;
        }
        else if (params.direction == "up") {
            currentSceneEndX = 0;
            currentSceneEndY = -app.view.height;
            nextSceneStartX = 0;
            nextSceneStartY = app.view.height;
        }
        else if (params.direction == "down") {
            currentSceneEndX = 0;
            currentSceneEndY = app.view.height;
            nextSceneStartX = 0;
            nextSceneStartY = -app.view.height;
        }
        else if (params.direction == "topleft") {
            currentSceneEndX = -app.view.width;
            currentSceneEndY = -app.view.height;
            nextSceneStartX = app.view.width;
            nextSceneStartY = app.view.height;
        }

        //Set up next scene
        nextScene.x = nextSceneStartX;
        nextScene.y = nextSceneStartY;
        app.stage.addChild(nextScene);

        //Slide out current scene as it moves off
        Animate.to(currentScene, {
            x: currentSceneEndX, y: currentSceneEndY,
            duration: params.duration,
            easing: Animate.easeInOut
        });
        //WHILE bringing in the next scene
        await Animate.to(nextScene, {
            x: 0, y: 0,
            duration: params.duration,
            easing: Animate.easeInOut
        });
        //We only "await" on the last animation, so that they both move at the same time

        //Remove the old scene from stage
        app.stage.removeChild(currentScene);

        //And just to be nice, move the old scene back to neutral
        currentScene.x = 0;
        currentScene.y = 0;

    },

};