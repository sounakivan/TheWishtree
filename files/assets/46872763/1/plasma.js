pc.script.attribute('materials', 'asset', [], {
    type: 'material'
});
pc.script.attribute('shader', 'asset', [], {
    type: 'shader',
    max: 1
});

var Plasma = pc.createScript('plasma');

Plasma.attributes.add('materials', {type: 'asset', array: true});
Plasma.attributes.add('shader', {type: 'asset'});

Plasma.prototype.initialize = function () {
    // get the shader asset
    var fs = this.shader.resource;

    // update all the materials with the chunk
    for (var i = 0; i < this.materials.length; i++) {
        var material = this.materials[i].resource;
        material.chunks.emissiveConstPS = fs;
        // Force the shader generator to generate UV processing code
        material.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
            width: 1,
            height: 1,
            format: pc.PIXELFORMAT_R8_G8_B8
        });
        material.setParameter('iGlobalTime', 0);
        material.update();
    }

    this.time = 0;
};

Plasma.prototype.update = function (dt) {
    // update the time uniform in the new shader chunk
    this.time += dt;
    for (var i = 0; i < this.materials.length; i++) {
        var material = this.materials[i].resource;
        material.setParameter('iGlobalTime', this.time);
    }
};
