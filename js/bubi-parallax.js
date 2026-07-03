(() => {
  const scene = document.querySelector(".bubi-parallax");
  const assets = window.BubiParallaxAssets;

  if (!scene || !assets) return;

  if (assets.sky) {
    scene.style.backgroundImage = `url("${assets.sky}")`;
  }

  if (assets.sun) {
    scene.style.setProperty("--bubi-parallax-sun", `url("${assets.sun}")`);
    scene.classList.add("has-game-sun");
  }

  const layers = {
    far: scene.querySelector(".bubi-parallax__cloud-layer--far"),
    mid: scene.querySelector(".bubi-parallax__cloud-layer--mid"),
    front: scene.querySelector(".bubi-parallax__cloud-layer--front")
  };

  Object.entries(layers).forEach(([name, layer]) => {
    if (layer && assets[name]) {
      layer.style.backgroundImage = `url("${assets[name]}")`;
    }
  });

  const mountains = scene.querySelector(".bubi-parallax__mountain-layer");
  if (mountains && assets.mountains) {
    mountains.style.backgroundImage = `url("${assets.mountains}")`;
    scene.classList.add("has-game-mountains");
  }

  scene.classList.add("has-game-clouds");
})();
