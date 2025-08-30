
const permissions = {
  // free: [
  //   'read:public',
  //   'create:trade', 'read:trade', 'update:trade', 'delete:trade',
  //   'read:plan',
  // ],
  paid: [
    'read:public',
    'read:paid',
    'create:import',
    'create:plan', 'update:plan', 'delete:plan',
  ]
};

module.exports = permissions;
  