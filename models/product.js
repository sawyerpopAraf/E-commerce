module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });

    Product.associate = function(models) {
        Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
        Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
        Product.hasMany(models.CartItems);
        Product.belongsToMany(models.Order, { through: models.OrderDetails, foreignKey: 'productId' });
    };

    return Product;
};

