var BtnYesNo = pc.createScript('btnYesNo');

//static variable
BtnYesNo.socket = null;

BtnYesNo.attributes.add('hoverAsset', {
    type:'asset',
    assetType:'texture'
});

BtnYesNo.attributes.add('activeAsset', {
    type:'asset',
    assetType:'texture'
});

BtnYesNo.attributes.add('option', {
    type:'boolean',
    title: 'Yes',
    default: false
});

// initialize code called once per entity
BtnYesNo.prototype.initialize = function() {
    //connect to network server
    var socket = io.connect('https://networking-playcanvas.glitch.me');
    BtnYesNo.socket = socket;
    
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
    
    this.startScreen = app.root.findByName('Start');
    this.welcomeScreen = app.root.findByName('Welcome');
    this.prompt1 = app.root.findByName('Prompt1');
    this.prompt2 = app.root.findByName('Prompt2');
    this.prompt3 = app.root.findByName('Prompt3');
    this.lantern = app.root.findByName('Lantern');
    this.particles = app.root.findByName('Particle System');
    this.butterfly = app.root.findByName('Butterfly');
    
};


// When the cursor enters the element assign the hovered texture
BtnYesNo.prototype.onEnter = function (event) {
    this.hovered = true;
    event.element.textureAsset = this.hoverAsset;

    // set our cursor to a pointer
    document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
BtnYesNo.prototype.onLeave = function (event) {
    this.hovered = false;
    event.element.textureAsset = this.originalTexture;

    // go back to default cursor
    document.body.style.cursor = 'default';
};

// When we press the element assign the active texture
BtnYesNo.prototype.onPress = function (event) {
    event.element.textureAsset = this.activeAsset;
    // console.log("button was pressed");
    
    if (this.prompt1.enabled === true) {
        if (this.option === true) {
            this.prompt2.enabled = true;
            this.prompt1.enabled = false;
            this.lantern.enabled = true;
            this.particles.enabled = true;
            
            BtnYesNo.socket.emit ('addedLantern');
        } 
        else {
            this.prompt2.enabled = true;
            this.prompt1.enabled = false;
            this.particles.enabled = true;
        }
        
    }
    
//     if (this.prompt2.enabled === true) {
//         this.prompt3.enabled = true;
//         this.prompt2.enabled = false;
//     }
    
    if (this.prompt3.enabled === true) {
        this.startScreen.enabled = true;
        this.prompt3.enabled = false;
        this.butterfly.enabled = true;
    }
    
};

// When we release the element assign the original texture if
// we are not hovering or the hover texture if we are still hovering
BtnYesNo.prototype.onRelease = function (event) {
    event.element.textureAsset = this.hovered ? this.hoverAsset : this.originalTexture;
};