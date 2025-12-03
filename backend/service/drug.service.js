
const Drug = require('../model/drug.model');

const getAllDrugs = async (options = {}) => {
  const { page = 1, limit = 30, search = '' ,company=''} = options;
  const skip = (page - 1) * limit;
  let query = {};
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { code: searchRegex },
      { genericName: searchRegex },
      { brandName: searchRegex },
      { company: searchRegex }
    ];
  }
  if (company && company.trim()) {
    query.company = { $regex: `^${company}$`, $options: 'i' }; 
  }

  const totalCount = await Drug.countDocuments(query);
  const drugs = await Drug.find(query)
    .select('code genericName brandName company launchDate')
    .sort({ launchDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return {
    drugs,
    pagination: {
      currentPage: +page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit: +limit,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    },
    search: search || null
  };
};

const getAllCompanies = async () => {
  return await Drug.distinct('company').then(companies => companies.sort());
};

module.exports = {
  getAllDrugs,
  getAllCompanies
};