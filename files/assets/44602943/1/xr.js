var Vr = pc.createScript('vr');

Vr.attributes.add('buttonVr', {
    type: 'entity',
    title: 'VR Button'
});

Vr.attributes.add('elementUnsupported', {
    type: 'entity',
    title: 'Unsupported Message'
});

Vr.attributes.add('elementUnavailable', {
    type: 'entity',
    title: 'Unavailable Message'
});

Vr.attributes.add('elementHttpsRequired', {
    type: 'entity',
    title: 'HTTPS Required Message'
});

Vr.attributes.add('cameraEntity', {
    type: 'entity',
    title: 'Camera'
});

Vr.prototype.initialize = function() {
    this.app.xr.on('available:' + pc.XRTYPE_VR, this.checkButton, this);
    this.app.xr.on('start', this.checkButton, this);
    this.app.xr.on('end', this.checkButton, this);
    
    this.buttonVr.element.on('click', function() {
        this.sessionStart();
    }, this);
    
    // esc - end session
    this.app.keyboard.on('keydown', function (evt) {
        if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) {
            this.app.xr.end();
        }
    }, this);
    
    this.checkButton();
};

Vr.prototype.checkButton = function() {
    if (this.app.xr.supported) {
        this.elementHttpsRequired.enabled = false;
        // this.elementUnsupported.enabled = false;
        // this.elementUnavailable.enabled = false;
        
        if (this.app.xr.active) {
            // hide button in XR session
            this.buttonVr.enabled = false;
        } else {
            // check if session type is available
            var available = this.app.xr && ! this.app.xr.active && this.app.xr.isAvailable(pc.XRTYPE_VR);
            
            // show/hide button outside of XR session
            this.buttonVr.enabled = available;
            
            // if (! available)
            //     this.elementUnavailable.enabled = true;
        }
    } else {
        // WebXR is not supported
        this.buttonVr.enabled = false;
        this.elementUnavailable.enabled = false;
        
        // Check if we are on HTTPS
        if (window.location.protocol == "https:") {
            this.elementUnsupported.enabled = true;
            this.elementHttpsRequired.enabled = false;
        } 
        // else {
        //     this.elementUnsupported.enabled = false;
        //     this.elementHttpsRequired.enabled = true;
        // }
    }
};

Vr.prototype.sessionStart = function() {
    if (! this.app.xr.supported) {
        // WebXR is not supported
        return;
    }
    
    if (this.app.xr.active) {
        // session already active
        return;
    }
    
    if (! this.app.xr.isAvailable(pc.XRTYPE_VR)) {
        // this session type is not available
        return;
    }
    
    // ask for motion permissions if we can
    if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission().then(function(response) {
            if (response !== 'granted')
                return;
            
            window.addEventListener('deviceorientation', function (e) {
                // start session
                this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR);
            }.bind(this));
        }.bind(this)).catch(console.error);
    } else {
        // start session
        this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR);
    }
};