<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Contains implements Rule
{

	public $contains;

	public function __construct($contains = null)
	{
		$this->contains = $contains;
	}

	public function passes($attribute, $value)
	{
		if (!$this->contains) {
			return true;
		}
		if (str_contains($value, $this->contains)) {
			return false;
		}
		return true;
	}

	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message()
	{
		return 'Value does not contain given string "' . $this->contains . '"';
	}
}
