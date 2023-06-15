<?php

namespace App\Services\Inventory;

use App\Enums\ServiceType;
use App\Models\Service;
use Illuminate\Support\Collection;

class ServiceLogService
{
	public static function getFormattedTypes(): Collection
	{
		return collect(ServiceType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getTypeServices(ServiceType $type)
	{
		return Service::where('type', $type)->get();
	}

	public static function getServices(): Collection
	{
		return Service::all()->collect();
	}
}