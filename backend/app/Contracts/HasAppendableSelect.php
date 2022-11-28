<?php

namespace App\Contracts;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Collection;

/**
 * Contract to require AppendableSelect component api methods
 */
interface HasAppendableSelect
{
	/**
	 * Gets base types
	 *
	 * @return iterable
	 */
	public function getTypes(): iterable;

	/**
	 * Gets values for selected base type
	 *
	 * @param string $type
	 * @return ResourceCollection|Collection
	 */
	public function getTypeValues(string $type): ResourceCollection|Collection;

}