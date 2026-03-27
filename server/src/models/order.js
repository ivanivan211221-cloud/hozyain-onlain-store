module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      status: {
        type: DataTypes.ENUM("NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"),
        defaultValue: "NEW",
      },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      customerName: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      paymentMethod: { type: DataTypes.STRING, allowNull: false },
      isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { timestamps: true }
  );
