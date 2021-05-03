var ChangeScene = pc.createScript('changeScene');

ChangeScene.attributes.add('hoverAsset', {
    type:'asset',
    assetType:'texture'
});

ChangeScene.attributes.add('activeAsset', {
    type:'asset',
    assetType:'texture'
});

ChangeScene.attributes.add("sceneName", {type: "string", default: "", title: "Scene Name to Load"});

// initialize code called once per entity
ChangeScene.prototype.initialize = function() {
    // Get the original button texture
    this.originalTexture = this.entity.element.textureAsset;

    // Whether the element is currently hovered or not
    this.hovered = false;

    // mouse events
    this.entity.element.on('mouseenter', this.onEnter, this);
    this.entity.element.on('mousedown', this.onPress, this);
    this.entity.element.on('mouseup', this.onRelease, this);
    this.entity.element.on('mouseleave', this.onLeave, this);

    // touch events
    this.entity.element.on('touchstart', this.onPress, this);
    this.entity.element.on('touchend', this.onRelease, this);
};


// When the cursor enters the element assign the hovered texture
ChangeScene.prototype.onEnter = function (event) {
    this.hovered = true;
    event.element.textureAsset = this.hoverAsset;

    // set our cursor to a pointer
    document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
ChangeScene.prototype.onLeave = function (event) {
    this.hovered = false;
    event.element.textureAsset = this.originalTexture;

    // go back to default cursor
    document.body.style.cursor = 'default';
};

// When we press the element assign the active texture
ChangeScene.prototype.onPress = function (event) {
    event.element.textureAsset = this.activeAsset;
    console.log("button was pressed");
    
    this.loadScene(this.sceneName);
};

// When we release the element assign the original texture if
// we are not hovering or the hover texture if we are still hovering
ChangeScene.prototype.onRelease = function (event) {
    event.element.textureAsset = this.hovered ? this.hoverAsset : this.originalTexture;
};

ChangeScene.prototype.loadScene = function(sceneName) {
    var oldHierarchy = this.app.root.findByName ('Root');
    
    // Get the path to the scene
    var scene = this.app.scenes.find(sceneName);
    
    // Load the scenes entity hierarchy
    this.app.scenes.loadSceneHierarchy(scene.url, function (err, parent) {
        if (!err) {
            oldHierarchy.destroy();
        } else {
            console.error(err);
        }
    });
};