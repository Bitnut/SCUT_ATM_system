/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    card_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: true
    },
    balance: {
      type: "DOUBLE",
      allowNull: true,
      defaultValue: '0'
    },
    wrongtimes: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    is_frozen: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'user'
  });
};
