// Update with your config settings.

module.exports = {
    client: 'postgresql',
    connection: {
      host: "ec2-54-83-50-174.compute-1.amazonaws.com",
      database: 'dfbfllc8mdi247',
      user:     'mdzyenmsusryqt',
      password: '685ef94b838b82b01c9c2e277270fbd295c145427ea0da8f4ffb07f4d23e973c'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
