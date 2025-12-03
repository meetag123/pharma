// controllers/drugController.js
const { successResponse, errorResponse } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const drugService = require('../service/drug.service');

const getAllDrugs = catchAsync(async (req, res) => {
  const { page, limit, search,company } = req.query;

  const result = await drugService.getAllDrugs({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 30,
    search: search || '',
    company: company || ''
  });

  return successResponse(
    res,
    result.drugs,
    result.search ? `Search results for "${result.search}"` : 'Drugs fetched successfully',
    200,
    { pagination: result.pagination, search: result.search }
  );
});

const getAllCompanies = catchAsync(async (req, res) => {
  const companies = await drugService.getAllCompanies();

  return successResponse(
    res,
    companies,
    'Companies fetched successfully'
  );
});

module.exports = {
  getAllDrugs,
  getAllCompanies
};