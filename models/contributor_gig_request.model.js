module.exports = (sequelize, DataTypes) => {
  const ContributorGigRequest = sequelize.define("ContributorGigRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    music_lover_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gig_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ required: false
    },
    performance_terms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancellation_policy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_terms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "contributor_gig_requests", // ✅ FIXED to match migration
    timestamps: true,
    underscored: true,
  });

  return ContributorGigRequest;
};
