import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Loan from '../models/Loan.js';

const getSummary = async (req, res) => {
  const [totalBooks, totalMembers, totalLoans, booksByCategory, loansByMonth, loansByStatus, availableBooks] =
    await Promise.all([
      Book.countDocuments(),
      Member.countDocuments(),
      Loan.countDocuments(),
      Book.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Loan.aggregate([
        {
          $group: {
            _id: { $month: '$loanDate' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Loan.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Book.aggregate([
        { $group: { _id: null, total: { $sum: '$available' } } },
      ]),
    ]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const loansPerMonth = monthNames.map((month, index) => {
    const found = loansByMonth.find((m) => m._id === index + 1);
    return { month, count: found ? found.count : 0 };
  });

  const statusMap = { borrowed: 0, returned: 0 };
  loansByStatus.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  const activeLoans = statusMap.borrowed;

  res.status(200).json({
    success: true,
    data: {
      totalBooks,
      totalMembers,
      totalLoans,
      activeLoans,
      availableBooks: availableBooks.length ? availableBooks[0].total : 0,
      booksByCategory,
      loansByStatus: statusMap,
      loansPerMonth,
    },
  });
};

export { getSummary };
