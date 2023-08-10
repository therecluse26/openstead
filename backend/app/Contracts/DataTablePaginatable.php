<?php

namespace App\Contracts;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

interface DataTablePaginatable
{
	public function getFilters(): Collection;

	public function getDetailResource(): JsonResource;

	public function getListResource(): JsonResource;
}