// -----JS CODE-----
// @input Asset.ObjectPrefab imagePrefab
// @input Asset.ObjectPrefab buttonPrefab
// @input Asset.Material button_image

function run(){
    // var easybtn = createObjectFromPrefab(script.buttonPrefab);
    // setTexture(easybtn, script.button_image);
    // easybtn.name = "easy_button";
    // easybtn.getTransform().setLocalScale(new vec3(50, 50, 10));
    // easybtn.getTransform().setLocalPosition(new vec3(-20,90,0));
}




function createObjectFromPrefab(prefab) {
    if (prefab) {
        var instanceObject = prefab.instantiate(script.getSceneObject());
        return instanceObject;
    }
    else {
        return undefined;
    }
}

function setTexture(object, img) {
    image = object.getComponentByIndex("Image", 0);
    if (image) {
        image.clearMaterials();
        image.addMaterial(img);
    } else {
        print("Error: cant set texture for this object");
    }
}


run();
