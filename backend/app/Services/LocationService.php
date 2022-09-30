<?php

namespace App\Services;

use App\Models\Location;

class LocationService
{
	public function getAllLocations()
	{
		return Location::all();
	}

	public function getLocationsDropdown()
	{
		return $this->getAllLocations()->map(function ($l) {
			return ['label' => $l->name, 'value' => $l->id];
		});
	}
}