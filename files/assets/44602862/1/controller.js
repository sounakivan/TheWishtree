var Controller = pc.createScript('controller');

// Controller.attributes.add('maxGrabDistance', {
//     type: 'number',
//     title: 'Max Grab Distance',
//     default: 0.1
// });

Controller.prototype.initialize = function() {
    // this.ray = new pc.Ray();
    // this.vecA = new pc.Vec3();
    // this.vecB = new pc.Vec3();
    // this.quat = new pc.Quat();
    // this.color = new pc.Color(1, 1, 1);
    // this.holdingEntity = null;
    // this.teleportableEntity = null;
    // this.hoverEntity = null;
    // this.hoverPoint = new pc.Vec3();
    // this.teleportable = true;
    // this.active = true;
    // this.mouseCoords = new pc.Vec2();
    // this.holdingDistance = 0;
    // this.holdingOffset = new pc.Vec3();
    // this.holdingNoOffset = true;
    
    this.modelEntity = this.entity.findByName('Model');
    // this.grabAnchor = new pc.Entity();
    // this.grabAnchor.reparent(this.entity);
};

Controller.prototype.setInputSource = function(inputSource, asset) {
    var self = this;
    
    this.inputSource = inputSource;
    this.inputSource.once('remove', this.onRemove, this);
    
    this.on('hover', this.onHover, this);
    this.on('blur', this.onBlur, this);
    
    // this.inputSource.on('selectstart', this.onSelectStart, this);
    // this.inputSource.on('selectend', this.onSelectEnd, this);
    
    if (inputSource.hand) {
        this.joints = [ ];
        var material = new pc.StandardMaterial();
        
        // create boxes for each joint
        for(var i = 0; i < inputSource.hand.joints.length; i++) {
            var joint = inputSource.hand.joints[i];
            var entity = new pc.Entity();
            entity.addComponent('model', {
                type: 'box'
            });
            entity.joint = joint;
            entity.model.material = material;
            
            this.joints.push(entity);
            this.entity.addChild(entity);
        }
        // paint red when tracking lost
        inputSource.hand.on('trackinglost', function() {
            this.joints[0].model.material.diffuse.set(1, 0, 0);
            this.joints[0].model.material.update();
        }, this);
        // paint white when tracking restored
        inputSource.hand.on('tracking', function() {
            this.joints[0].model.material.diffuse.set(1, 1, 1);
            this.joints[0].model.material.update();
        }, this);
        
    } else if (asset) {
        // if model provided for a controller
        asset.ready(function() {
            if (! this.entity.parent)
                return;
            
            var glb = asset.resource;
            var blob = new Blob([ glb ]);
    
            // load from glb
            this.app.assets.loadFromUrlAndFilename(URL.createObjectURL(blob), 'container.glb', "container", function (err, containerAsset) {
                if (! self.entity.parent) {
                    containerAsset.unload();
                    self.app.assets.remove(containerAsset);
                    return;
                }
                
                if (err) {
                    console.error(err);    
                } else {
                    // update model
                    self.modelEntity.setLocalScale(1, 1, 1);
                    self.modelEntity.model.type = 'asset';
                    self.modelEntity.model.asset = containerAsset.resource.model;
                    self.modelEntity.containerAsset = containerAsset;
                }
            });
        }, this);
        // load model
        this.app.assets.load(asset);
    }
};

Controller.prototype.onRemove = function() {
    if (this.modelEntity.containerAsset) {
        console.log(this.modelEntity.containerAsset);
        this.modelEntity.containerAsset.unload();
        this.app.assets.remove(this.modelEntity.containerAsset);
        this.modelEntity.containerAsset = null;
    }
    
    this.entity.destroy();
};

// Controller.prototype.onSelectStart = function() {
//     this.pick();
    
//     if (this.teleportableEntity) {
//         // teleport
//         if (this.app.xr.active) {
//             this.app.fire('teleport:to', this.hoverPoint);
//         }
//     } else if (this.hoverEntity && ! this.holdingEntity) {
//         this.hoverEntity.fire('object:interact', this);
//         this.hoverEntity.fire('object:hold', this);
//     }
// };

// Controller.prototype.onSelectEnd = function() {
//     if (this.teleportableEntity) {
//         if (! this.app.xr.active && this.teleportable) {
//             this.app.fire('teleport:to', this.hoverPoint);
//         }
//     }
    
//     if (this.hoverEntity) {
//         this.hoverEntity.fire('object:attemptuse', this);
//     }
    
//     if (this.holdingEntity) {
//         this.holdingEntity.fire('object:release', this);
//     }
// };

// Controller.prototype.getAttachPosition = function () {
//     return this.grabAnchor.getPosition();
// };

// Controller.prototype.getAttachRotation = function () {
//     return this.grabAnchor.getRotation();
// };

// Controller.prototype.attach = function (entity) {
//     if (this.holdingEntity) return;
    
//     this.holdingEntity = entity;
//     this.grabAnchor.setPosition(entity.getPosition());
    
//     this.holdingDistance = entity.getPosition().distance(this.app.mainCamera.getPosition());
// };

// Controller.prototype.detach = function (entity) {
//     if (! this.holdingEntity) return;
    
//     this.holdingEntity = null;
// };

// Controller.prototype.getHeldEntity = function () {
//     return this.holdingEntity;
// };

// Controller.prototype.updateAttachment = function (entity, rotationOffset) {
//     entity.setPosition(this.getAttachPosition());
//     this.quat.mul2(this.getAttachRotation(), rotationOffset);
//     entity.setRotation(this.quat);    
// };

// Controller.prototype.filterPicker = function(entity) {
//     if (this.holdingEntity === entity)
//         return false;
    
//     return true;
// };

// Controller.prototype.pick = function() {
//     if (this.inputSource) {
//         this.ray.set(this.inputSource.getOrigin(), this.inputSource.getDirection());
//     } else if (! pc.Mouse.isPointerLocked()) {
//         this.app.mainCamera.camera.screenToWorld(this.mouseCoords.x, this.mouseCoords.y, this.app.mainCamera.camera.nearClip, this.vecA);
//         this.app.mainCamera.camera.screenToWorld(this.mouseCoords.x, this.mouseCoords.y, this.app.mainCamera.camera.farClip, this.vecB);
//         this.vecB.sub(this.vecA).normalize();
//         this.ray.set(this.vecA, this.vecB);
        
//         if (this.holdingEntity) {
//             this.vecB.scale(this.holdingDistance);
//             this.vecB.add(this.vecA);
            
//             if (this.holdingNoOffset) {
//                 this.holdingNoOffset = false;
//                 this.holdingOffset.copy(this.grabAnchor.getPosition()).sub(this.vecB);
//             }
            
//             this.vecB.add(this.holdingOffset);
//             this.grabAnchor.setPosition(this.vecB);
//         } else {
//             this.holdingNoOffset = true;
//         }
//     } else {
//         this.ray.set(this.app.mainCamera.getPosition(), this.app.mainCamera.forward);
//     }
    
//     var hoverEntity = this.app.shapeWorld.raycast(this.ray, this.filterPicker.bind(this), this.hoverPoint);
//     var validTeleport = false;
    
//     if (! this.active) hoverEntity = null;
    
//     if (this.hoverEntity !== hoverEntity) {
//         if (this.hoverEntity)
//             this.hoverEntity.fire('object:offhover', this);
        
//         if (hoverEntity)
//             hoverEntity.fire('object:onhover', this);
        
//         this.hoverEntity = hoverEntity;
//     }
    
//     if (this.hoverEntity) {
//         if (! this.holdingEntity) {
//             // check teleportable
//             if (this.hoverEntity.tags.has('floor')) {
//                 var dot = this.hoverEntity.up.dot(this.ray.direction);
//                 if (dot <= 0) validTeleport = true;
//             }
//         }
//     }
    
//     if (validTeleport) {
//         this.teleportableEntity = this.hoverEntity;
//     } else {
//         this.teleportableEntity = null;
//     }
// };

Controller.prototype.update = function(dt) {
    // if (this.inputSource && this.inputSource.targetRayMode !== 'gaze') {
    //     // render ray line
    //     this.vecA.copy(this.inputSource.getOrigin());
    //     this.vecB.copy(this.inputSource.getDirection());
    //     this.vecB.scale(1000).add(this.vecA);
    //     if (this.inputSource.selecting) {
    //         this.color.set(0, 1, 0);
    //     } else {
    //         this.color.set(1, 1, 1);
    //     }
    //     this.app.renderLine(this.vecA, this.vecB, this.color);
    // }
    
    // it is a hand
    if (this.inputSource && this.inputSource.hand) {
        // update physical joints
        for(var i = 0; i < this.joints.length; i++) {
            var joint = this.joints[i].joint;
            var r = joint.radius * 2;
            this.joints[i].setLocalScale(r, r, r);
            this.joints[i].setPosition(joint.getPosition());
            this.joints[i].setRotation(joint.getRotation());
        }
    } else if (this.inputSource && this.inputSource.grip) {
        // is can be gripped, enable model and transform it accordingly
        this.modelEntity.enabled = true;
        this.entity.setPosition(this.inputSource.getPosition());
        this.entity.setRotation(this.inputSource.getRotation());
    } else {
        this.modelEntity.enabled = false;
        
        if (! this.inputSource || this.inputSource.targetRayMode === 'gaze') {
            this.entity.setPosition(this.app.mainCamera.getPosition());
            this.entity.setRotation(this.app.mainCamera.getRotation());
        }
    }
    
//     this.pick();
    
//     if (this.teleportableEntity) {
//         this.vecB.copy(this.hoverEntity.up).scale(0.01);
//         this.vecA.copy(this.hoverPoint).add(this.vecB);
//         this.app.fire('teleport:transform', this.vecA, this.hoverEntity.getRotation());
//         this.app.fire('teleport:show');
//     } else {
//         this.app.fire('teleport:hide');
//     }
};
