import prisma from '../prisma/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const storeCount = await prisma.store.count();
    const ratingCount = await prisma.rating.count();

    res.json({
      users: userCount,
      stores: storeCount,
      ratings: ratingCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        if (user.role === 'store_owner') {
          const storeRatings = await prisma.rating.findMany({
            where: {
              store: {
                owner_id: user.id,
              },
            },
            select: { rating: true },
          });

          let averageRating = 0;
          if (storeRatings.length > 0) {
            const total = storeRatings.reduce((sum, item) => sum + item.rating, 0);
            averageRating = total / storeRatings.length;
          }
          return { ...user, averageRating: parseFloat(averageRating.toFixed(2)) };
        }
        return user;
      })
    );

    res.json(usersWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};