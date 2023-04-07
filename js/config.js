
const config = {
  msPerTick: 200,

  worldSize: {width: 1000, height: 1000},

  numAirbases: {1: 3, 2: 8},
  planes: {
    1: {
      'U-2': 1, 'B-52': 8, 'F-101': 8, 'F-106': 8,
    },
    2: {
      'MIG-19': 8, 'MIG-21': 4, 'IL-28': 6, 'TU-95': 12, 'Yak-28': 4,
    },
  },

  formationRadius: 40,
}

module.exports = {
  config,
};
