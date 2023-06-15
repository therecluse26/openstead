<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface Repository
{
	public function getModel(): Model|Inventoriable;

	public function __call(string $method, array $arguments): mixed;

	public function count(): int;

	public function all(): Collection;

	public function getById(string|int $id): ?Model;
}