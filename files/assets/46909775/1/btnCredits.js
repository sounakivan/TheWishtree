var BtnCredits = pc.createScript('btnCredits');

BtnCredits.attributes.add('hoverAsset', {
    type:'asset',
    assetType:'texture'
});

BtnCredits.attributes.add('activeAsset', {
    type:'asset',
    assetType:'texture'
});

BtnCredits.openCredits = false;
BtnCredits.openControls = false;

BtnCredits.attributes.add("buttonType", {type: "string", default: "", title: "Button Type"});

// initialize code called once per entity
BtnCredits.prototype.initialize = function() {
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
    
    var app = this.app;
    
    this.credits = app.root.findByName('Credits');
    this.credits.enabled = false;
    this.controls = app.root.findByName('Controls');
    this.controls.enabled = false;
};


// When the cursor enters the element assign the hovered texture
BtnCredits.prototype.onEnter = function (event) {
    this.hovered = true;
    event.element.textureAsset = this.hoverAsset;

    // set our cursor to a pointer
    document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
BtnCredits.prototype.onLeave = function (event) {
    this.hovered = false;
    event.element.textureAsset = this.originalTexture;

    // go back to default cursor
    document.body.style.cursor = 'default';
};

// When we press the element assign the active texture
BtnCredits.prototype.onPress = function (event) {
    event.element.textureAsset = this.activeAsset;
    
    if (this.buttonType === 'credits') {
        if (BtnCredits.openCredits === false) {
            
            BtnCredits.openCredits = true;
            
            if (this.controls.enabled === true) {
                BtnCredits.openControls = false;
            }
            
        } else {
            
            BtnCredits.openCredits = false;
        }
    }
    
    if (this.buttonType === 'controls') {
        if (BtnCredits.openControls === false) {
            
            BtnCredits.openControls = true;
            
            if (this.credits.enabled === true) {
                BtnCredits.openCredits = false;
            }
            
        } else {
            
            BtnCredits.openControls = false;
        }
    }
    
};

BtnCredits.prototype.update = function(dt) {
    
    if (BtnCredits.openCredits === true) {
        this.credits.enabled = true;
    } else {
        this.credits.enabled = false;
    }
    
    if (BtnCredits.openControls === true) {
        this.controls.enabled = true;
    } else {
        this.controls.enabled = false;
    }    
    
};

// When we release the element assign the original texture if
// we are not hovering or the hover texture if we are still hovering
BtnCredits.prototype.onRelease = function (event) {
    event.element.textureAsset = this.hovered ? this.hoverAsset : this.originalTexture;
};