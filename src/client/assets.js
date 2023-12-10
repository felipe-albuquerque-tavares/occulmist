const ASSET_NAMES = [
  'fire_staff.png',
  'player.png',
  'white_floor.png',
  'testBack.png',
  'testFore.png',
  'basic_bullet.png',
  'minimum_sword.png',
  'monster_1.png',
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
