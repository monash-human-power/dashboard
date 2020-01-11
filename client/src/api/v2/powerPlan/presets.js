const defaultPreset = {
  name: 'Default',
  value: {
    fileName: 'default',
    mass: 75,
    startAdjust: 130,
    lowerBound: 1000,
    upperBound: 1200,
    step: 100,
    startTrap: 4682,
    endTrap: 4882,
    zones: [
      {
        recPower: 100,
        maxTime: 100,
        spentTime: 0,
      },
      {
        recPower: 210,
        maxTime: 90,
        spentTime: 0,
      },
      {
        recPower: 280,
        maxTime: 45,
        spentTime: 0,
      },
      {
        recPower: 350,
        maxTime: 45,
        spentTime: 0,
      },
      {
        recPower: 450,
        maxTime: 60,
        spentTime: 0,
      },
      {
        recPower: 0,
        maxTime: 0,
        spentTime: 0,
      },
    ],
  },
};

const presets = [
  defaultPreset,
];
export default presets;
