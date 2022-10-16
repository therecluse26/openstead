<?php

namespace App\Contracts;

use Illuminate\Support\Collection;

interface FrontendFilterable
{
	public static function getFilters(): Collection;
}