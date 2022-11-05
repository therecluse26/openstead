<?php

namespace App\Contracts;

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
	 * @return iterable
	 */
	public function getTypeValues(string $type): iterable;
}