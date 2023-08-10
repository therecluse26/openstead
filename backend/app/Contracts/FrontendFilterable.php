<?php

namespace App\Contracts;

use Illuminate\Support\Collection;

interface FrontendFilterable
{
	public function getFilters(): Collection;
}