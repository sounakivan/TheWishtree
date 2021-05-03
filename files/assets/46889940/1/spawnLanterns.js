var SpawnLanterns = pc.createScript('spawnLanterns');

SpawnLanterns.attributes.add('numLanterns', {
    type: 'number',
    default: 100
});



// initialize code called once per entity
SpawnLanterns.prototype.initialize = function() {
    for (i = 0; i < this.numLanterns; i++) {
        this.generate();
    }
};

// update code called every frame
SpawnLanterns.prototype.update = function(dt) {
    // var x = Math.PI;
};

SpawnLanterns.prototype.generate = function() {
    var lanternAsset = this.app.assets.get(46890031);
    var instance = lanternAsset.resource.instantiate();
    
    instance.setLocalPosition(
        pc.math.random(-100, 100),
        pc.math.random(30, 90),
        pc.math.random(-100, 100)
    );
    
    this.app.root.addChild(instance);
};