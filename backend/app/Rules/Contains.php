<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Contains implements Rule
{
	public string $contains;

	public function __construct(?string $contains = null)
	{
		$this->contains = $contains;
	}

	public function passes($attribute, $value): bool
	{
		if (!$this->contains) {
			return true;
		}
		return str_contains($value, $this->contains);
	}

	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message(): string
	{
		return 'Value does not contain given string "' . $this->contains . '"';
	}
}
