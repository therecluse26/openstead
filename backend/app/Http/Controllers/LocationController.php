<?php

namespace App\Http\Controllers;

use App\Services\LocationService;

class LocationController extends Controller
{
	public function index(LocationService $service)
	{
		return $service->getAllLocations();
	}

	public function getLocationsDropdown(LocationService $service)
	{
		return $service->getLocationsDropdown();
	}

}
