<?php

namespace App\Contracts\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface InventoryContract
{
	public function __call(string $method, array $arguments): mixed;

	public function count(): int;

	public function all(): Collection;

	public function getById(string|int $id): ?Model;
}