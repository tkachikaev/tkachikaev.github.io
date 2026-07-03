(() => {
  const scene = document.querySelector(".bubi-parallax");
  const assets = window.BubiParallaxAssets;

  if (!scene || !assets) return;

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

  scene.classList.add("has-game-clouds");
})();
