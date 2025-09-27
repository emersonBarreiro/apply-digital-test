import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DateRangeDto } from './dto/date-range.dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deletion-summary')
  @ApiOperation({
    summary: 'Get percentage of deleted vs non-deleted products',
  })
  @ApiResponse({
    status: 200,
    description: 'Deletion report retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDeletionReport() {
    return this.reportsService.getDeletedProductsPercentage();
  }

  @Get('pricing-analysis')
  @ApiOperation({
    summary: 'Get percentage of products with/without price in date range',
  })
  @ApiQuery({ type: DateRangeDto })
  @ApiResponse({
    status: 200,
    description: 'Pricing analysis retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPricingAnalysis(@Query() dateRange: DateRangeDto) {
    return this.reportsService.getNonDeletedProductsReport(
      dateRange.startDate,
      dateRange.endDate,
    );
  }

  @Get('data-quality')
  @ApiOperation({
    summary: 'Get data quality report with missing fields and invalid data',
  })
  @ApiResponse({
    status: 200,
    description: 'Data quality report retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDataQualityReport() {
    return this.reportsService.getDataQualityReport();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get comprehensive report with all metrics' })
  @ApiQuery({ type: DateRangeDto })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive report retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllReports(@Query() dateRange: DateRangeDto) {
    return this.reportsService.getAllReports(
      dateRange.startDate,
      dateRange.endDate,
    );
  }
}
