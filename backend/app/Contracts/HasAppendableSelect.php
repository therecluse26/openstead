<?php

namespace App\Contracts;

use Illuminate\Http\Resources\Json\ResourceCollection;

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
	 * @return ResourceCollection
	 */
	public function getTypeValues(string $type): ResourceCollection;

}