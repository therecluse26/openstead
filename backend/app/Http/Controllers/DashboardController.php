<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;

final class DashboardController extends Controller
{
	public function getReports(DashboardService $service)
	{
		return $service->getDashboardReportData();
	}
}
